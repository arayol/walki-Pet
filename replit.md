# DogWalker Platform

## Overview

The DogWalker platform is a full-stack web application built for connecting dog walkers with pet owners. It features a hybrid architecture using React with TypeScript for the frontend, Express.js for the backend, and Supabase as the primary database with Drizzle ORM for PostgreSQL operations. The application supports multiple user roles (walkers and clients) with distinct interfaces and workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

### Development Rules - Object Calisthenics (MANDATORY)
**These 9 rules must be applied to ALL code generation, review, and suggestions:**

1. **Only one level of indentation per method**
   - Keep methods simple, short, and with direct logic

2. **Do not use the ELSE keyword**
   - Use early return, guard clauses, or polymorphism instead

3. **Encapsulate all primitive types and Strings**
   - Replace types like int, float, String with Value Objects

4. **Use collections as first-class objects**
   - Always create a class to represent collections (Orders, ItemsList, etc.)

5. **Only one dot per line (dot rule)**
   - Do not use method chaining like a.getB().getC()

6. **Do not use abbreviations**
   - Variable, method, and class names must be complete, clear, and descriptive

7. **Keep all entities small**
   - Methods with maximum 5-10 lines. Classes with single, focused responsibilities

8. **Maximum two instance variables per class**
   - Encourages cohesion and reduces coupling

9. **No getters, setters, or direct properties (Law of Demeter)**
   - An object should interact only with its own direct attributes
   - Never directly access internal attributes of other objects or returned objects

**Core Principle: Law of Demeter - Talk only to your immediate friends.**

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **Styling**: TailwindCSS with shadcn/ui component library using the "new-york" theme
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: React Router with protected routes based on user roles
- **Code Splitting**: Lazy loading implementation with preloading strategies for better performance

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL via Supabase with Drizzle ORM
- **Authentication**: Supabase Auth with role-based access control
- **Payment Processing**: Stripe integration for payment handling
- **File Structure**: Separation between client, server, and shared code

### Hybrid App Structure
The application uses a unique hybrid architecture with app-specific organization:
- `client/src/apps/walker/` - Dog walker specific features
- `client/src/apps/client/` - Pet owner specific features
- `client/src/apps/public/` - Public-facing pages
- `client/src/apps/auth/` - Authentication flows
- `client/src/shared/` - Shared components and utilities

## Key Components

### Database Schema (Drizzle)
- **Profiles**: Base user information with role-based differentiation
- **Walkers**: Extended profile data for dog walker users
- **Clients**: Extended profile data for pet owner users
- **Service Plans**: Walker service offerings with pricing and configurations
- **Service Regions**: Geographic service areas with CEP (Brazilian postal code) support
- **Service Schedules**: Time-based availability for service plans
- **Walks**: Individual walk bookings and history
- **Payments**: Financial transactions and payment tracking

### Authentication System
- Supabase-based authentication with email/password
- Role-based access control (walker/client roles)
- Protected routes with automatic redirection
- Session management with automatic token refresh

### Payment Integration
- Stripe Connect for marketplace payments
- Support for both direct and marketplace payment flows
- Real-time payment status polling
- Webhook handling for payment confirmations

### Location Services
- Brazilian CEP (postal code) validation and formatting
- Integration with ViaCEP API for address lookup
- Geographic service area management
- Location-based service filtering

## Data Flow

### User Registration Flow
1. User selects role (walker or client) during signup
2. Profile created in `profiles` table with role
3. Extended profile created in role-specific table (walkers/clients)
4. Role-based redirect to appropriate dashboard

### Service Booking Flow
1. Client discovers walker through public profile or direct link
2. Client selects service plan and available time slots
3. Real-time availability validation
4. Payment processing through Stripe
5. Walk record created upon successful payment
6. Notifications sent to both parties

### Walker Service Management
1. Walkers create service plans with pricing
2. Define service regions with CEP and radius
3. Set schedules with time slots and capacity
4. System calculates real-time availability
5. Analytics and performance tracking

## External Dependencies

### Core Infrastructure
- **Supabase**: Database, authentication, and serverless functions
- **Stripe**: Payment processing and marketplace functionality
- **ViaCEP**: Brazilian postal code validation and address lookup

### Frontend Libraries
- **React Router**: Client-side routing
- **TanStack Query**: Server state management and caching
- **Radix UI**: Headless UI components via shadcn/ui
- **Date-fns**: Date manipulation and formatting
- **Zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Server-side bundling for production

## Deployment Strategy

### Development Environment
- Vite development server for frontend with HMR
- Express server with TypeScript compilation via tsx
- Real-time database connections to Supabase
- Environment-based configuration

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with ESBuild for Node.js deployment
- Database migrations managed through Drizzle Kit
- Environment variables for service configuration

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Supabase configuration
- `STRIPE_SECRET_KEY`: Stripe API authentication
- Various feature flags and service configurations

The architecture emphasizes modularity, type safety, and role-based user experiences while maintaining a cohesive development workflow across the full stack.