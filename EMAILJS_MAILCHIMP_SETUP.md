# EmailJS & Mailchimp Setup Guide

This guide will help you configure EmailJS for the contact form and Mailchimp for newsletter subscriptions.

---

## EmailJS Setup (Contact Form)

### 1. Create EmailJS Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Connect Email Service
1. Go to **Email Services** in the dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the prompts to connect your email account
5. Copy your **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to **Email Templates** in the dashboard
2. Click **Create New Template**
3. Design your template with the following variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Email subject
   - `{{message}}` - Message content
   - `{{to_name}}` - Your business name
4. Example template:
   ```
   Subject: New Contact Form Submission - {{subject}}
   
   You have received a new message from {{from_name}} ({{from_email}}):
   
   {{message}}
   
   ---
   This message was sent via the Abella Stitches contact form.
   ```
5. Save and copy your **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to **Account** > **General**
2. Find your **Public Key** (e.g., `abcdefgh123456`)

### 5. Configure Frontend Environment
Create or update `frontend/.env` file:
```bash
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

---

## Mailchimp Setup (Newsletter)

### 1. Create Mailchimp Account
1. Visit [https://mailchimp.com/](https://mailchimp.com/)
2. Sign up for a free account (up to 500 contacts)
3. Complete the onboarding process

### 2. Create Audience
1. Go to **Audience** in the main navigation
2. Click **Create Audience** if you don't have one
3. Fill in your details:
   - **Audience Name**: "Abella Stitches Newsletter"
   - **Default From Email**: Your business email
   - **Default From Name**: "Abella Stitches"
4. Save your audience

### 3. Get Audience ID
1. Go to **Audience** > **Settings** > **Audience name and defaults**
2. Copy your **Audience ID** (e.g., `a1b2c3d4e5`)

### 4. Generate API Key
1. Click your profile icon > **Account & Billing**
2. Go to **Extras** > **API Keys**
3. Click **Create A Key**
4. Name it "Abella Stitches Backend"
5. Copy the generated **API Key** (starts with a long string like `abc123...xyz789-us1`)

### 5. Identify Server Prefix
Your API key ends with a server prefix (e.g., `-us1`, `-us2`, `-us19`)
Extract this for your configuration (e.g., `us1`)

### 6. Configure Backend Environment
Create or update `backend/.env` file:
```bash
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_AUDIENCE_ID=your_audience_id_here
```

---

## Testing the Integration

### Test Contact Form (EmailJS)
1. Start the frontend: `cd frontend && npm run dev`
2. Navigate to the Contact page
3. Fill in the form with:
   - Name
   - Email
   - Subject
   - Message
4. Click "Send Message"
5. Check the configured email inbox for the message

### Test Newsletter (Mailchimp)
1. Start both backend and frontend servers
2. Navigate to any page with the Newsletter component
3. Enter an email address
4. Click "Subscribe"
5. Log into Mailchimp dashboard
6. Go to **Audience** > **All contacts**
7. Verify the new subscriber appears in the list

---

## Troubleshooting

### EmailJS Issues
- **"Email service is not configured"**: Check environment variables are properly set
- **Emails not sending**: Verify Service ID and Template ID are correct
- **403 Error**: Public Key might be incorrect

### Mailchimp Issues
- **"Newsletter service is not configured"**: Verify all three environment variables are set
- **"Already subscribed"**: Email is already in the audience
- **API errors**: Check API key has correct permissions and server prefix matches

---

## Production Deployment

### Frontend (Vercel)
Add environment variables in Vercel dashboard:
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

### Backend (Vercel)
Add environment variables in Vercel dashboard:
- `MAILCHIMP_API_KEY`
- `MAILCHIMP_SERVER_PREFIX`
- `MAILCHIMP_AUDIENCE_ID`

**Note**: Redeploy both frontend and backend after adding environment variables.
