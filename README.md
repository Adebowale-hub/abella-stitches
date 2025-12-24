# Abella Stitches E-Commerce Platform

A modern, full-stack fashion e-commerce website featuring a public storefront and secure admin dashboard for product management.

## Features

### Public Storefront
- **Hero Section**: Beautiful landing page with brand introduction
- **Category Filtering**: Filter products by Ankara, Adire, Streetwear, and Accessories
- **Product Catalog**: Responsive grid showcasing products with images and categories
- **Newsletter Signup**: Email subscription for updates and promotions
- **About Page**: Brand story and mission
- **Contact Page**: Contact form for customer inquiries

### Admin Dashboard (Protected)
- **Secure Authentication**: JWT-based authentication with httpOnly cookies
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Inventory Overview**: Real-time product list with counts
- **User-Friendly Interface**: Clean, card-based design for easy management

## Tech Stack

### Backend
- **Node.js** with **Express** - RESTful API server
- **MongoDB** with **Mongoose** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Vanilla CSS** - Custom styling with CSS modules

## Project Structure

```
adh/
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB models (AdminUser, Product)
│   │   ├── routes/         # API routes (admin, products)
│   │   ├── middleware/     # Auth middleware
│   │   ├── config/         # Database configuration
│   │   ├── server.js       # Express server
│   │   └── seed.js         # Database seeding script
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── utils/          # Utility functions (API)
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Install backend dependencies:**
```bash
cd backend
npm install
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

### Configuration

   - Update `backend/.env` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/abellastitches
   JWT_SECRET=your-secret-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

2. **Seed the database:**
```bash
cd backend
npm run seed
```

This creates:
- An admin user: `admin@abellastitches.com` / `Admin123!`
- **Note:** No sample products are created. Use the admin dashboard to add your products.

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

2. **Start the frontend dev server:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## Usage

### Public Site
1. Visit `http://localhost:5173`
2. Browse products by category
3. View product details
4. Sign up for newsletter
5. Access About and Contact pages

1. Navigate to `http://localhost:5173/admin/login`
2. Login with default credentials:
   - Email: `admin@abellastitches.com`
   - Password: `Admin123!`
3. Manage products (Add, Edit, Delete)
4. View inventory count
5. Logout when finished

## API Endpoints

### Admin Routes
- `POST /api/admin/register` - Register admin user (initial setup)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin (protected)

### Product Routes
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **httpOnly Cookies**: Prevents XSS attacks
- **Protected Routes**: Frontend route guards
- **Middleware Protection**: Backend API endpoint protection
- **CORS Configuration**: Controlled cross-origin access

## Design Highlights

- **Modern Fashion Aesthetic**: Clean, minimal design with generous white space
- **Responsive Design**: Mobile-first approach, works on all devices
- **Premium Typography**: Google Fonts (Playfair Display + Inter)
- **Color Palette**: Professional blue and gold color scheme
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: Semantic HTML and ARIA labels

## Development Scripts

### Backend
```bash
npm run dev    # Start with auto-reload
npm start      # Production start
npm run seed   # Seed database
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment Considerations

1. **Environment Variables**: Set production values for `JWT_SECRET`, `MONGODB_URI`
2. **CORS**: Update allowed origins in `backend/src/server.js`
3. **Database**: Use MongoDB Atlas for cloud hosting
4. **Frontend**: Build and deploy to Vercel, Netlify, or similar
5. **Backend**: Deploy to Railway, Render, or Heroku
6. **Security**: Change default admin password immediately

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please contact: hello@abellastitches.com
