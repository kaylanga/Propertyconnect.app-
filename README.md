# Real Estate Platform

A modern real estate platform built with React, TypeScript, and Supabase.

## Features

- **Property Listings**: Browse and search for properties with advanced filtering
- **User Authentication**: Secure login and registration system
- **Payment Integration**: Multiple payment methods including Stripe, PayPal, and Mobile Money
- **Admin Dashboard**: Comprehensive admin panel for managing properties, users, and payments
- **User Profiles**: Different user types (client, landlord, broker) with role-based access
- **Verification System**: Process for verifying landlords and brokers
- **Messaging System**: In-app messaging between users
- **Wallet System**: Manage payments and transactions

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Payment Processing**: Stripe, PayPal, Mobile Money
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel, Netlify

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/real-estate-platform.git
   cd real-estate-platform
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Project Structure

- `src/components`: React components
- `src/pages`: Page components
- `src/services`: Service classes for API calls and business logic
- `src/contexts`: React context providers
- `src/lib`: Utility libraries and configurations
- `src/types`: TypeScript type definitions
- `supabase/migrations`: Database migration files

## License

This project is licensed under the MIT License - see the LICENSE file for details. 