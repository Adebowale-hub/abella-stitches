import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AdminUser from './models/AdminUser.js';
import Product from './models/Product.js';

dotenv.config();

// Connect to database
await connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await AdminUser.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        const admin = await AdminUser.create({
            name: 'Admin',
            email: 'abellastitches@gmail.com',
            passwordHash: 'Matthew7:7' // Will be hashed by pre-save hook
        });

        console.log('✓ Admin user created');

        // Create sample products (prices in Naira)
        const sampleProducts = [
            {
                productName: 'Classic Adire Indigo Dress',
                category: 'Adire',
                price: 45000,
                imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600',
                description: 'Handcrafted traditional Adire dress with authentic indigo dye patterns. Features intricate tie-dye designs passed down through generations.'
            },
            {
                productName: 'Ankara Print Maxi Skirt',
                category: 'Ankara',
                price: 32000,
                imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600',
                description: 'Vibrant Ankara print maxi skirt with bold geometric patterns. Perfect for both casual and formal occasions.'
            },
            {
                productName: 'Batik Cotton Blouse',
                category: 'Batik',
                price: 28000,
                imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600',
                description: 'Lightweight batik cotton blouse featuring traditional wax-resist dyeing techniques. Comfortable and stylish.'
            },
            {
                productName: 'Tie-Dye Streetwear Set',
                category: 'Streetwear',
                price: 60000,
                imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
                description: 'Modern streetwear set with contemporary tie-dye patterns. Includes matching top and joggers.'
            },
            {
                productName: 'Traditional Adire Wrapper',
                category: 'Adire',
                price: 38000,
                imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600',
                description: 'Authentic Adire wrapper cloth with deep indigo hues. Can be styled in multiple ways for various occasions.'
            },
            {
                productName: 'Ankara Jumpsuit',
                category: 'Ankara',
                price: 48000,
                imageUrl: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600',
                description: 'Statement Ankara jumpsuit with contemporary cut. Features vibrant prints and comfortable fit.'
            },
            {
                productName: 'Batik Kimono Jacket',
                category: 'Batik',
                price: 40000,
                imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
                description: 'Elegant batik kimono jacket perfect for layering. Showcases intricate traditional patterns.'
            },
            {
                productName: 'Urban Tie-Dye Hoodie',
                category: 'Streetwear',
                price: 35000,
                imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
                description: 'Trendy tie-dye hoodie blending African techniques with urban style. Premium cotton material.'
            }
        ];

        await Product.insertMany(sampleProducts);
        console.log(`✓ ${sampleProducts.length} sample products created`);

        console.log('\n=================================');
        console.log('Seeding complete!');
        console.log('=================================');
        console.log('Admin credentials:');
        console.log('Email: abellastitches@gmail.com');
        console.log('Password: Matthew7:7');
        console.log('=================================');
        console.log(`Products: ${sampleProducts.length} items added`);
        console.log('You can now test the application!');
        console.log('=================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
