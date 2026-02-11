# Local Eats Hub - Project-ChineesRestaurant Website

A modern, full-featured restaurant website with online ordering, reservations, and customer engagement features.

## Features

- 🛒 **Shopping Cart & Checkout** - Complete ordering system with cart management
- 📅 **Table Reservations** - Easy booking system with date and time selection
- 🤖 **AI ChatBot** - Intelligent customer support assistant
- ⭐ **Customer Reviews** - Display testimonials and ratings
- 🌙 **Dark/Light Theme** - User-preferred theme with persistence
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🍕 **Menu Management** - Dynamic menu with categories and daily deals
- 👨‍💼 **Admin Dashboard** - Manage orders, menu items, reviews, and settings
- 🔐 **Authentication** - Secure admin login with Supabase

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Supabase** - Backend as a service (PostgreSQL database, authentication)
- **React Router** - Client-side routing
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account for backend services

### Installation

```sh
# Clone the repository
git clone https://github.com/ehsanmohajer/Project-restaurantchinees.git

# Navigate to the project directory
cd Project-restaurantchinees

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Environment Variables

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── admin/        # Admin dashboard components
│   ├── home/         # Homepage sections
│   ├── layout/       # Header, Footer
│   ├── shared/       # Shared components (ChatBot, Modals)
│   └── ui/           # shadcn/ui components
├── contexts/         # React Context providers
├── hooks/            # Custom React hooks
├── integrations/     # Third-party integrations (Supabase)
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── lib/              # Utility functions
```

## Deployment

This project can be deployed to various platforms:

### Vercel (Recommended)

```sh
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```sh
# Build the project
npm run build

# Deploy the dist/ folder to Netlify
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own restaurant website.
