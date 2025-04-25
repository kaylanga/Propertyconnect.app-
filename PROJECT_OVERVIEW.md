# Real Estate Platform Project Overview

## Project Structure
```typescript
project/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── analytics/        # Analytics and reporting
│   │   ├── auth/            # Authentication components
│   │   ├── booking/         # Property booking system
│   │   ├── chat/            # Messaging system
│   │   ├── common/          # Shared/reusable components
│   │   ├── comparison/      # Property comparison
│   │   ├── layout/          # Layout components
│   │   ├── property/        # Property-related components
│   │   ├── reviews/         # Review system
│   │   └── user/            # User-related components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── styles/              # Global styles
│   └── types/               # TypeScript type definitions
├── public/                  # Static files
├── prisma/                  # Database schema and migrations
└── tests/                   # Test files
```

## Core Features
1. User Authentication & Authorization
2. Property Management
3. Booking System
4. Messaging System
5. Analytics Dashboard
6. Review & Rating System
7. Property Alerts
8. Property Comparison

## Tech Stack
- Frontend: React with TypeScript
- Styling: Tailwind CSS
- State Management: React Context + Hooks
- Database: Prisma with PostgreSQL
- Authentication: Firebase Auth
- Real-time Features: WebSocket
- Payment Processing: Stripe
- File Storage: Firebase Storage 