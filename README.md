# Ecofy Frontend

## Overview

Ecofy Frontend is a Next.js 16 application for discovering, creating, moderating, and monetizing sustainability ideas. It works with the sibling backend project in `C:\projects\Ecofy_server` and includes member dashboards, admin moderation tools, premium idea purchase flows, AI-assisted drafting, semantic search, and personalized recommendations.

## Current Feature Set

### Public Experience

- Browse approved sustainability ideas
- Filter by category, paid/free, votes, and sort order
- Search ideas with semantic ranking support from the backend
- View idea details, comments, voting, and premium locks
- Complete Stripe-powered premium idea purchases

### Member Experience

- Create and edit draft or rejected ideas
- Use the AI Idea Assistant inside the idea form
- View dashboard activity and creator analytics
- See personalized idea recommendations
- Manage profile and account details
- Receive in-app notifications for moderation, comments, replies, and purchases

### Admin Experience

- Review and moderate submitted ideas
- Filter and paginate moderation queues
- Manage users and categories
- View audit logs for moderation actions
- View platform overview metrics

## AI Features

- AI Idea Assistant in the create/edit flow
- Gemini is used for text generation
- OpenAI is used for embeddings
- Semantic search and recommendations depend on backend-generated embeddings

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Base UI / shadcn-style component patterns
- React Hook Form + Zod
- Stripe.js
- Lucide React

## Project Structure

```txt
app/
  (public)/                public pages
  auth/                    login/signup
  dashboard/
    member/                member dashboard, analytics, idea tools
    admin/                 moderation, users, categories, audit logs
  payment/                 payment success and cancel pages
components/
  comments/                comment UI
  ideas/                   idea cards, forms, filters, voting
  layout/                  navbar, sidebar, footer
  notifications/           in-app notifications UI
  payment/                 premium purchase UI
  ui/                      shared primitives
lib/
  api/                     typed API client
  auth/                    auth helpers
types/                     shared frontend types
```

## Environment Variables

Create `C:\projects\Ecofy_client\.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Local Development

### Prerequisites

- Node.js 20+
- Backend running from `C:\projects\Ecofy_server`

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Backend Dependency

This app expects the backend API to be available at `http://localhost:5000` during local development.

Recommended local pairing:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Backend API base: `http://localhost:5000/api/v1`

## Important Notes

- Authentication is cookie-based, so frontend and backend URLs must stay aligned.
- AI drafting, semantic search, and recommendations depend on backend AI provider configuration.
- Premium content visibility is enforced by the backend, not only by the frontend UI.
- Admin and member dashboards now use improved empty, error, and loading states.

## Scripts

- `npm run dev` starts the Next.js development server
- `npm run build` creates the production build
- `npm run start` starts the production server
