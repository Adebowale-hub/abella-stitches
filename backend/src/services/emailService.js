import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Load and populate HTML template
const loadTemplate = (templateName, variables) => {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace all template variables
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, variables[key] || '');
    });

    return html;
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (orderData) => {
    try {
        const {
            customerEmail,
            orderNumber,
            items,
            totalAmount,
            paymentReference,
            createdAt
        } = orderData;

        // Format items for email
        const itemsList = items.map(item =>
            `${item.productName} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}`
        ).join('\n');

        // Prepare template variables
        const variables = {
            to_email: customerEmail,
            to_name: customerEmail.split('@')[0],
            order_number: orderNumber,
            order_date: new Date(createdAt).toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            items_list: itemsList,
            total_amount: `₦${totalAmount.toLocaleString()}`,
            payment_reference: paymentReference
        };

        // Load template
        const html = loadTemplate('order_confirmation', variables);

        // Send email
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: `"Abella Stitches" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: `Order Confirmation - ${orderNumber}`,
            html: html,
            attachments: [{
                filename: 'logo.png',
                path: path.join(__dirname, '..', 'templates', 'logo.png'),
                cid: 'logo'
            }]
        });

        console.log(`✓ Order confirmation email sent to ${customerEmail} (${info.messageId})`);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
};

/**
 * Send order status update email
 */
export const sendOrderStatusEmail = async (orderData, newStatus) => {
    try {
        const { customerEmail, orderNumber } = orderData;

        const statusMessages = {
            processing: 'Your order is being processed and will be shipped soon.',
            shipped: 'Your order has been shipped and is on its way to you!',
            delivered: 'Your order has been successfully delivered. Enjoy your purchase!',
            cancelled: 'Your order has been cancelled. If you have any questions, please contact us.'
        };

        // Prepare template variables
        const variables = {
            to_email: customerEmail,
            to_name: customerEmail.split('@')[0],
            order_number: orderNumber,
            status_message: statusMessages[newStatus] || `Order status updated to ${newStatus}`,
            new_status: newStatus
        };

        // Load template
        const html = loadTemplate('order_status', variables);

        // Send email
        const transporter = createTransporter();
        const info = await transporter.sendMail({
            from: `"Abella Stitches" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: `Order Update - ${orderNumber}`,
            html: html,
            attachments: [{
                filename: 'logo.png',
                path: path.join(__dirname, '..', 'templates', 'logo.png'),
                cid: 'logo'
            }]
        });

        console.log(`✓ Status update email sent to ${customerEmail} (${info.messageId})`);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error sending status update email:', error);
        // Don't throw - email failure shouldn't block order updates
        return { success: false, error: error.message };
    }
};
