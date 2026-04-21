# Ecofy Frontend

## Project Overview

Ecofy is a comprehensive sustainability idea-sharing platform designed to foster community-driven innovation in environmental and social sustainability. The frontend application, built with Next.js 16 and modern web technologies, serves as the user interface for a platform where individuals can discover, share, and monetize sustainable ideas.

The platform enables users to:
- Browse and search through a curated collection of sustainability ideas
- Contribute their own ideas through a structured submission workflow
- Engage with the community via comments and voting systems
- Access premium content through a Stripe-powered payment system
- Manage personal profiles and track idea performance
- Participate in moderation as administrators

This frontend application communicates with the Ecofy backend API to handle authentication, data management, and payment processing, providing a seamless user experience across desktop and mobile devices.

## Live URLs
- **Frontend**: https://ecofy-pro.vercel.app/
- **Backend API**: https://ecofy-backend-ij77.onrender.com

## Core Features

### Public Features
- **Idea Discovery**: Browse sustainability ideas with advanced filtering by category, status, and search terms
- **Idea Detail Pages**: View comprehensive idea information, including descriptions, voting, and comments
- **Premium Content**: Unlock exclusive ideas through secure Stripe payments
- **Community Engagement**: Participate in threaded discussions and vote on ideas
- **Responsive Design**: Optimized experience across all device sizes

### Member Features
- **Personal Dashboard**: Overview of user statistics, ideas, and purchases
- **Idea Management**: Create, edit, and track the status of submitted ideas
- **Profile Management**: Update personal information and view activity
- **Purchase History**: Access previously purchased premium ideas

### Admin Features
- **Content Moderation**: Review and approve/reject submitted ideas with feedback
- **User Management**: Monitor and manage platform users
- **Category Management**: Create and organize idea categories
- **Platform Analytics**: View comprehensive statistics and metrics

### Technical Features
- **Authentication**: Secure login/signup with role-based access control
- **Payment Integration**: Stripe-powered checkout for premium content
- **Real-time Updates**: Optimistic UI updates for votes and comments
- **SEO Optimization**: Server-side rendering for improved search visibility
- **Progressive Web App**: Fast loading and offline capabilities

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4 with custom design system
- **UI Components**: shadcn/ui component library
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe.js for secure transactions
- **Icons**: Lucide React icon set
- **Authentication**: BetterAuth for session management
- **State Management**: React hooks and context
- **API Communication**: Custom typed API client

## Architecture Overview

The application follows a modern Next.js architecture with clear separation of concerns:

### App Router Structure
```
app/
  (public)/                # Public pages with shared layout
  auth/                    # Authentication routes
  dashboard/               # Protected dashboard routes
    member/                # Member-specific pages
    admin/                 # Admin-specific pages
  payment/                 # Payment flow pages
```

### Component Organization
```
components/
  layout/                  # Navigation and layout components
  ui/                      # Reusable UI primitives
  ideas/                   # Idea-related components
  comments/                # Comment system components
  dashboard/               # Dashboard-specific components
  payment/                 # Payment flow components
```

### Data Layer
```
lib/
  api/                     # Centralized API client
  auth/                    # Authentication utilities
hooks/                     # Custom React hooks
types/                     # TypeScript type definitions
```

## Design System

Ecofy uses a consistent design system built on Tailwind CSS:

- **Primary Color**: Green (#16a34a) for CTAs and active states
- **Typography**: Inter font family with semantic sizing
- **Spacing**: Consistent padding and margins using Tailwind scale
- **Components**: shadcn/ui for accessible, customizable UI elements
- **Status Indicators**: Color-coded badges for idea statuses (Draft, Under Review, Approved, Rejected)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Ecofy backend API running (default: http://localhost:4000)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ecofy_client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for client-side payments | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key for server-side operations | Yes |

## API Integration

The frontend communicates with the Ecofy backend API using a typed client located in `lib/api/client.ts`. Key endpoints include:

- Authentication: Login, signup, session management
- Ideas: CRUD operations, search, filtering
- Comments: Threaded discussion management
- Payments: Stripe checkout session creation
- Admin: Moderation and management functions

## Deployment

The application is configured for deployment on Vercel with the following optimizations:

- Static asset optimization
- API route handling
- Environment variable management
- Automatic scaling and CDN

Update `vercel.json` for custom deployment configurations.

## Contributing

1. Follow the established code style and component patterns
2. Use TypeScript for all new code
3. Test components and hooks thoroughly
4. Update documentation for new features
5. Follow the PRD specifications for UI/UX consistency

## License

[Add license information here]

### 4. Start the development server
```bash
npm run dev
```

### 5. Open the app
Visit `http://localhost:3000` in your browser.

## Available Scripts
- `npm run dev`  
  Starts the Next.js development server.

- `npm run build`  
  Creates the production build.

- `npm run start`  
  Starts the production server after a successful build.

## Backend Dependency
This frontend depends on the Ecofy backend API being available.

Recommended local pairing:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Backend API base: `http://localhost:5000/api/v1`

Authentication, dashboard data, moderation tools, and payments will not work correctly unless the backend is running.

## Setup Checklist
- Start the backend server first
- Confirm `NEXT_PUBLIC_API_URL` points to the backend
- Configure Stripe keys for premium idea purchases
- Seed or create an admin account if you need to test admin routes
- Run both applications together during development

## Notes
- The app uses cookie-based authentication, so backend and frontend URLs need to stay aligned with the configured environment.
- Production builds may log `session null` during static generation for client components that read session state in the browser later. That does not necessarily indicate a runtime auth failure.
- Premium idea access is unlocked after successful purchase verification through the backend.
