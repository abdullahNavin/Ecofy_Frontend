# Ecofy — Frontend PRD
**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Stripe.js

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Design System](#3-design-system)
4. [Folder Structure](#4-folder-structure)
5. [Routing Map](#5-routing-map)
6. [Layout & Navigation](#6-layout--navigation)
7. [Pages & Components](#7-pages--components)
8. [State Management & Data Fetching](#8-state-management--data-fetching)
9. [Authentication Flow (BetterAuth Client)](#9-authentication-flow-betterauth-client)
10. [Stripe Payment Flow](#10-stripe-payment-flow)
11. [shadcn/ui Component Usage](#11-shadcnui-component-usage)
12. [API Client Layer](#12-api-client-layer)
13. [Type Definitions](#13-type-definitions)
14. [Environment Variables](#14-environment-variables)

---

## 1. Project Overview

The Ecofy frontend is a **Next.js 16 App Router** application styled with **Tailwind CSS** and **shadcn/ui**. It consumes the Ecofy REST API (`http://localhost:4000/api/v1`) and handles:

- Public idea browsing and full-text search
- Member registration, login, and role-based dashboards
- Idea creation (draft → review → approved/rejected) workflow
- Paid-idea purchase via Stripe Checkout
- Admin moderation (approve / reject with feedback)
- Nested threaded comments and Reddit-style voting
- Sticky responsive navbar with mobile drawer

**Base API URL:** `http://localhost:4000/api/v1`
**Auth mechanism:** Cookie-based sessions managed by BetterAuth (`better-auth.session_token` cookie, sent via `credentials: "include"`)

---

## 2. Architecture Overview

```
app/                        <- Next.js 16 App Router
  (public)/                 <- Public layout group (Navbar + Footer)
  (auth)/                   <- Auth layout group (centered card layout)
  (member)/                 <- Protected member layout group
  (admin)/                  <- Protected admin layout group

components/
  layout/                   <- Navbar, Footer, DashboardSidebar
  ui/                       <- shadcn/ui re-exports + custom primitives
  ideas/                    <- IdeaCard, IdeaGrid, IdeaForm, VoteBar
  comments/                 <- CommentThread, CommentItem, CommentForm
  dashboard/                <- StatsCard, IdeaTable, UserTable, RejectModal
  payment/                  <- PaidBadge, PurchaseButton

lib/
  api/                      <- Typed API client (one object, all endpoints)
  auth/                     <- BetterAuth client instance

hooks/                      <- useAuth, useVote, useComments, usePurchase
types/                      <- Shared TypeScript interfaces
```

**Data fetching strategy:**

| Scenario | Approach |
|----------|----------|
| Public list pages (ideas, categories) | Next.js Server Components with `fetch` + `cache: "no-store"` |
| Auth-gated pages (dashboard) | Client Components with custom hooks |
| Mutations (vote, comment, submit) | Client Components with optimistic updates |
| Forms | `react-hook-form` + Zod resolver |

---

## 3. Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#16a34a` (green-600) | CTA buttons, links, active states |
| `primary-dark` | `#15803d` (green-700) | Hover states |
| `primary-light` | `#dcfce7` (green-100) | Backgrounds, badges |
| `surface` | `#ffffff` | Card backgrounds |
| `muted` | `#f9fafb` (gray-50) | Page backgrounds |
| `border` | `#e5e7eb` (gray-200) | Dividers, card borders |
| `foreground` | `#111827` (gray-900) | Primary text |
| `muted-foreground` | `#6b7280` (gray-500) | Secondary text, metadata |
| `amber` | `#f59e0b` | Warning badges (UNDER_REVIEW) |
| `red` | `#dc2626` | Error states, REJECTED badge |

### Typography

- **Font:** Inter (via `next/font/google`)
- **Scale:** shadcn/ui default Tailwind scale
- **Headings:** `font-semibold` or `font-bold`
- **Body:** `text-base` (16px), `leading-relaxed`

### Spacing & Radius

- **Border radius:** `rounded-xl` for cards, `rounded-lg` for buttons/inputs, `rounded-full` for badges/avatars
- **Card shadows:** `shadow-sm` default, `shadow-md` on hover transition
- **Page padding:** `px-4 md:px-6 lg:px-8`, max content width `max-w-7xl mx-auto`

### IdeaStatus Badge Colors

| Status | Tailwind Classes |
|--------|-----------------|
| DRAFT | `bg-gray-100 text-gray-600 border-gray-300` |
| UNDER_REVIEW | `bg-amber-100 text-amber-700 border-amber-200` |
| APPROVED | `bg-green-100 text-green-700 border-green-200` |
| REJECTED | `bg-red-100 text-red-700 border-red-200` |

---

## 4. Folder Structure

```
ecofy-frontend/
├── app/
│   ├── layout.tsx                          <- Root layout: Inter font, Providers, Toaster
│   ├── globals.css                         <- Tailwind base + shadcn/ui CSS variables
│   ├── page.tsx                            <- Home page
│   ├── about/page.tsx
│   ├── blog/page.tsx
│   ├── ideas/
│   │   ├── page.tsx                        <- All Ideas (paginated + filtered)
│   │   └── [id]/page.tsx                   <- Idea Detail (id-based, matches API)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx                      <- Dashboard shell: sidebar + topbar
│   │   ├── page.tsx                        <- Role-based redirect
│   │   ├── member/
│   │   │   ├── page.tsx                    <- Member overview + stats
│   │   │   ├── ideas/
│   │   │   │   ├── page.tsx                <- My ideas table
│   │   │   │   ├── new/page.tsx            <- Create idea form
│   │   │   │   └── [id]/edit/page.tsx      <- Edit idea form
│   │   │   └── purchases/page.tsx          <- My purchased ideas
│   │   └── admin/
│   │       ├── page.tsx                    <- Admin stats overview
│   │       ├── ideas/page.tsx              <- Moderation queue (tabs)
│   │       ├── users/page.tsx              <- User management table
│   │       └── categories/page.tsx         <- Category CRUD
│   ├── payment/
│   │   ├── success/page.tsx                <- Stripe success redirect handler
│   │   └── cancel/page.tsx                 <- Stripe cancel redirect
│   └── not-found.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                      <- Sticky top navbar
│   │   ├── NavbarMobile.tsx                <- Sheet-based mobile drawer
│   │   ├── Footer.tsx
│   │   └── DashboardSidebar.tsx            <- Collapsible sidebar
│   ├── ui/                                 <- shadcn/ui generated components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── use-toast.ts
│   │   ├── dropdown-menu.tsx
│   │   ├── popover.tsx
│   │   ├── slider.tsx
│   │   ├── switch.tsx
│   │   ├── label.tsx
│   │   ├── alert.tsx
│   │   ├── navigation-menu.tsx
│   │   └── pagination.tsx
│   ├── ideas/
│   │   ├── IdeaCard.tsx
│   │   ├── IdeaCardSkeleton.tsx
│   │   ├── IdeaGrid.tsx
│   │   ├── IdeaForm.tsx
│   │   ├── IdeaFilters.tsx
│   │   ├── IdeaStatusBadge.tsx
│   │   └── VoteBar.tsx
│   ├── comments/
│   │   ├── CommentThread.tsx
│   │   ├── CommentItem.tsx
│   │   └── CommentForm.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── IdeaTable.tsx
│   │   ├── UserTable.tsx
│   │   └── RejectModal.tsx
│   └── payment/
│       ├── PaidBadge.tsx
│       └── PurchaseButton.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useIdeas.ts
│   ├── useVote.ts
│   ├── useComments.ts
│   └── usePurchase.ts
│
├── lib/
│   ├── api/
│   │   └── client.ts                       <- Single typed API client
│   ├── auth/
│   │   └── betterAuthClient.ts
│   └── utils.ts                            <- shadcn cn() utility
│
├── types/
│   └── index.ts
│
├── proxy.ts                            <- Route protection
├── public/logo.svg
├── .env.local
├── components.json                         <- shadcn/ui config
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## 5. Routing Map

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page |
| `/ideas` | Public | All approved ideas |
| `/ideas/[id]` | Public* | Idea detail (*paid = auth + purchase required) |
| `/about` | Public | About the platform |
| `/blog` | Public | Blog listing |
| `/auth/login` | Guest only | Login form |
| `/auth/signup` | Guest only | Registration form |
| `/dashboard` | Auth | Auto-redirect by role |
| `/dashboard/member` | Member | Member overview |
| `/dashboard/member/ideas` | Member | My ideas list |
| `/dashboard/member/ideas/new` | Member | Create idea |
| `/dashboard/member/ideas/[id]/edit` | Member (owner) | Edit idea |
| `/dashboard/member/purchases` | Member | Purchased ideas |
| `/dashboard/admin` | Admin | Admin stats overview |
| `/dashboard/admin/ideas` | Admin | Moderate all ideas |
| `/dashboard/admin/users` | Admin | User management |
| `/dashboard/admin/categories` | Admin | Category management |
| `/payment/success` | Member | Stripe success landing |
| `/payment/cancel` | Member | Stripe cancel landing |

> **Note:** Idea detail uses `[id]` (not `[slug]`) to match the backend route `GET /api/v1/ideas/:id` from the Postman collection.

---

## 6. Layout & Navigation

### 6.1 Sticky Navbar

The Navbar is a **sticky top bar** that stays fixed as users scroll, with a frosted-glass backdrop blur effect.

```
Desktop:
+---------------------------------------------------------------------------+
|  🌿 Ecofy    Home   Ideas   About   Blog            [Search]  Login  Join |
+---------------------------------------------------------------------------+

Mobile:
+---------------------------------------------------------------------------+
|  🌿 Ecofy                                                             ☰  |
+---------------------------------------------------------------------------+
```

**CSS classes (sticky + blur):**
```
sticky top-0 z-50 w-full border-b border-border/40
bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
```

**Navbar structure:**
- Logo (left): SVG icon + "Ecofy" wordmark in green
- Nav links (center, desktop only): Home, Ideas, About, Blog — active link uses `text-primary font-medium`
- Right section (desktop):
  - **Unauthenticated:** `Ghost` "Log In" button + `Primary` "Get Started" button
  - **Member logged in:** Avatar `DropdownMenu` → Dashboard, Profile, Log Out
  - **Admin logged in:** Avatar `DropdownMenu` → Admin Dashboard, Log Out
- Mobile: Hamburger (`Menu` icon from lucide-react) opens a `Sheet` (right side) with all nav links stacked + auth buttons

**`components/layout/Navbar.tsx` skeleton:**
```typescript
<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
    <Logo />
    <nav className="hidden md:flex items-center gap-6">
      <NavLinks />
    </nav>
    <div className="flex items-center gap-3">
      <AuthSection />               {/* Desktop auth buttons or avatar menu */}
      <MobileMenuTrigger />         {/* Mobile only */}
    </div>
  </div>
</header>
```

### 6.2 Dashboard Sidebar

Persistent left sidebar on `>= lg` screens, `Sheet` drawer (from shadcn) triggered by a Menu icon on smaller screens.

**Width:** `w-64` on desktop, full-width `Sheet` on mobile

**Member sidebar links** (with lucide-react icons):
- 🏠 Overview → `/dashboard/member`
- 💡 My Ideas → `/dashboard/member/ideas`
- ✏️ Create Idea → `/dashboard/member/ideas/new`
- 💳 Purchases → `/dashboard/member/purchases`
- 👤 Profile → `/dashboard/member/profile`

**Admin sidebar links:**
- 📊 Overview → `/dashboard/admin`
- 📋 Moderation → `/dashboard/admin/ideas`
- 👥 Users → `/dashboard/admin/users`
- 🏷️ Categories → `/dashboard/admin/categories`

Active link: `bg-primary/10 text-primary font-medium rounded-lg`

### 6.3 Footer

4-column grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`):
- Column 1: Logo + tagline + social icon links (Twitter, LinkedIn, GitHub)
- Column 2: Explore (Home, Ideas, About, Blog)
- Column 3: Support (Privacy Policy, Terms of Use, FAQ, Contact)
- Column 4: Newsletter — inline `Input` + "Subscribe" `Button` → `POST /api/v1/newsletter/subscribe`

Bottom bar: `© 2025 Ecofy. All rights reserved.`

---

## 7. Pages & Components

### 7.1 Home Page (`/`)

**Hero Section:**
- Full-viewport-height gradient: `from-green-50 via-emerald-50 to-teal-50`
- Optional full-bleed background image with overlay
- `text-5xl md:text-7xl font-bold` headline
- Subheading paragraph (`text-xl text-muted-foreground`)
- Two CTA buttons side by side:
  - `<Button size="lg" className="gap-2"><Leaf /> Explore Ideas</Button>` → `/ideas`
  - `<Button size="lg" variant="outline">Share Your Idea</Button>` → `/dashboard/member/ideas/new`
- Scroll-down chevron animation

**Inline Search Bar (below hero):**
- Centered floating card: `max-w-2xl shadow-lg rounded-2xl p-4`
- `Input` placeholder "Search ideas by keyword..."
- `Select` for category (populated from `GET /api/v1/categories`)
- `Button` "Search" → routes to `/ideas?q=...&category=...`

**Featured Ideas Grid:**
- Section: "Featured Ideas" heading + "See All →" link to `/ideas`
- Fetches: `GET /api/v1/ideas?sort=top_voted&limit=6`
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Renders `IdeaCard` × 6, shows `IdeaCardSkeleton` while loading

**Top 3 Spotlight:**
- "Community Favorites" section heading
- Fetches: `GET /api/v1/ideas?sort=top_voted&limit=3`
- Horizontal cards with green left-border accent, vote count prominent
- Offset layout for visual interest (`grid-cols-1 md:grid-cols-3`, middle card slightly larger)

**How It Works:**
- 3-step section with numbered icons:
  1. Share an Idea — submit your sustainability proposal
  2. Community Votes — the community upvotes the best ideas
  3. Ideas Come to Life — top ideas get highlighted and actioned
- Clean icon + heading + description card layout

**Newsletter CTA:**
- Dark green section (`bg-green-900 text-white`)
- Headline + subtitle
- Inline `Input` (email) + `Button` ("Subscribe")
- Calls: `POST /api/v1/newsletter/subscribe` `{ email }`
- On success → `useToast()` success toast; on error → destructive toast

---

### 7.2 All Ideas Page (`/ideas`)

**API:** `GET /api/v1/ideas?page=1&limit=10&sort=recent`

**Full query params supported:**

| Param | Values | Notes |
|-------|--------|-------|
| `page` | number | Default 1 |
| `limit` | number | Default 10 |
| `sort` | `recent` \| `top_voted` \| `most_commented` | Default `recent` |
| `category` | category id/slug | — |
| `paid` | `true` \| `false` | — |
| `minVotes` | number | Min upvote threshold |
| `author` | user id | — |
| `q` | string | Full-text search |

**Page layout (desktop):**
```
+------------------+------------------------------------------+
|  Filters sidebar |   Ideas grid (3 cols)                    |
|  (w-64, sticky)  |   [Card] [Card] [Card]                   |
|                  |   [Card] [Card] [Card]                   |
|  [ Search ]      |   [Card] [Card] [Card]                   |
|  [ Category  v]  |                                          |
|  [ Sort      v]  |   Pagination                             |
|  [ Free/Paid v]  |                                          |
|  [ Min Votes  ]  |                                          |
|  [Clear All]     |                                          |
+------------------+------------------------------------------+
```

**IdeaFilters (`components/ideas/IdeaFilters.tsx`):**
- `Input` — keyword (`q`)
- `Select` — Category (options from `GET /api/v1/categories`)
- `Select` — Sort by: Recent / Top Voted / Most Commented
- `Select` — Type: All / Free / Paid
- `Slider` — Min Upvotes (0–100, step 5)
- `Button variant="ghost" size="sm"` — "Clear All"
- On mobile: all filters in a `Sheet` triggered by a "Filters" button with `SlidersHorizontal` icon

**IdeaGrid:**
- Renders `IdeaCardSkeleton` (6 items) during loading
- Empty state: shadcn `Alert` with lightbulb icon + "No ideas found. Try adjusting your filters."
- Responsive grid: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6`

**IdeaCard (`components/ideas/IdeaCard.tsx`):**
```
+----------------------------------+
|  [Image]               [PAID $X] |  <- aspect-video, PaidBadge overlay (top-right)
+----------------------------------+
|  [Energy Badge]                  |  <- Category Badge (green outline)
|  Community Solar Panels          |  <- Title (font-semibold, line-clamp-2)
|  Brief description of the        |  <- text-sm text-muted-foreground, line-clamp-3
|  idea goes here...               |
+----------------------------------+
|  [Avatar] Jane Doe  · Jun 2025   |  <- Author + date (text-xs)
|  ▲ 42  ▼ 3  💬 14               |  <- Vote counts + comment count (text-sm)
+----------------------------------+
|  [View Idea →]                   |  <- Full-width Button variant="outline"
+----------------------------------+
```

**IdeaCard props:**
```typescript
interface IdeaCardProps {
  id: string;
  title: string;
  category: { id: string; name: string };
  description: string;         // Truncated to ~120 chars (line-clamp-3)
  imageUrl?: string;
  isPaid: boolean;
  price?: number;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  author: { id: string; name: string; avatarUrl?: string };
  createdAt: string;
}
```

**Pagination (URL-driven):**
- shadcn `Pagination` component
- Reads `?page=N` from `useSearchParams()`
- Updates via `router.push` (preserves other query params)
- "Showing 1–10 of 85 results" text above grid

---

### 7.3 Idea Detail Page (`/ideas/[id]`)

**API:** `GET /api/v1/ideas/:id`

**Paid idea access gate (evaluated in component):**
```
isPaid = false                      → render full content
isPaid = true, not authenticated    → show LoginWall card
isPaid = true, authenticated,
  isPurchased = false               → show BlurredPreview + PurchaseOverlay
isPaid = true, isPurchased = true   → render full content
```

**Layout (two-column `lg:grid-cols-[1fr_320px]`):**

**Main column (left):**

1. **Breadcrumb nav:** Home / Ideas / [Title]

2. **Header card:**
   - `IdeaStatusBadge` (owner or admin only)
   - `PaidBadge` (if paid)
   - Category `Badge`
   - Title (`text-3xl font-bold tracking-tight`)
   - Author row: `Avatar` + name + "·" + formatted date
   - Metadata row: `MessageCircle` icon + comment count, `Eye` icon + view count (optional)

3. **Image gallery:**
   - First image full-width (`aspect-video rounded-xl object-cover`)
   - Additional images in `grid-cols-3 gap-2`
   - Click to open lightbox (use `Dialog` + full-size image)

4. **Content sections** (each in a `Card` with `Separator`):
   - **Problem Statement** — `h3` + prose text
   - **Proposed Solution** — `h3` + prose text
   - **Full Description** — `h3` + rich text / markdown rendered

5. **VoteBar** (member only, optimistic):
   ```
   [ ▲ Upvote (42) ]    [ ▼ Downvote (3) ]
   ```
   - Non-authenticated: buttons show `Tooltip` "Log in to vote"
   - Active vote → `bg-primary text-white` (upvote) or `bg-red-500 text-white` (downvote)
   - Voting: `POST /api/v1/ideas/:id/votes` `{ type: "UPVOTE" | "DOWNVOTE" }`
   - Remove: `DELETE /api/v1/ideas/:id/votes`

6. **Comments section:**
   - "Discussion (N)" heading
   - `CommentForm` (member only) — `POST /api/v1/ideas/:id/comments`
   - `CommentThread` — renders nested tree from `GET /api/v1/ideas/:id/comments`
   - Each `CommentItem`: Avatar, name, time-ago, content, "Reply" button (member), "Delete" button (owner/admin)
   - Reply → inline `CommentForm` below parent → `POST /api/v1/ideas/:id/comments/:parentId/replies`

**Sidebar (right, `sticky top-20`):**

- **Idea Info Card:**
  - Status, Category, Author, Date submitted
  - "View Author Profile" link

- **PurchaseButton** (if `isPaid && !isPurchased`):
  - `Lock` icon + "Unlock for $X.XX"
  - Calls `POST /api/v1/payments/checkout` `{ ideaId }`
  - Redirect to Stripe

- **Admin Action Card** (admin role only):
  - `Button` "Approve" (green) → `PATCH /api/v1/admin/ideas/:id/approve`
  - `Button` variant="destructive" "Reject" → opens `RejectModal`
  - `Button` variant="outline" "Delete" → `AlertDialog` confirm → `DELETE /api/v1/admin/ideas/:id`

---

### 7.4 Auth Pages

**Shared auth layout:** Centered split screen — left panel with Ecofy branding/quote, right panel with the form card.

#### Login (`/auth/login`)

- Ecofy logo + "Welcome back" heading
- `Label` + `Input` for Email
- `Label` + `Input type="password"` with eye toggle (`Eye` / `EyeOff` icons)
- `Switch` "Remember me"
- `Button` "Sign In" — full-width, shows `Loader2` spinner when loading
- Errors as `Alert variant="destructive"` below form
- Link: "Don't have an account? Sign up"

**API:** `POST /api/v1/auth/better-auth/sign-in/email` `{ email, password }`
On success → redirect to `/dashboard`

#### Signup (`/auth/signup`)

- "Create your account" heading
- Name, Email, Password, Confirm Password fields
- Password strength bar (4 segments, color-coded)
- `Button` "Create Account"
- Link: "Already have an account? Log in"

**API:** `POST /api/v1/auth/signup` `{ name, email, password }`
On success → redirect to `/auth/login` with success toast

---

### 7.5 Member Dashboard

#### Overview (`/dashboard/member`)

**APIs:**
- `GET /api/v1/auth/me`
- `GET /api/v1/ideas` (filtered by author = current user)

- Greeting: "Welcome back, [Name] 👋" + current date
- 4 `StatsCard` row: Total Ideas | Approved | Under Review | Rejected
- Quick action: "Create New Idea" `Button` → `/dashboard/member/ideas/new`
- "Recent Ideas" — last 5 in a compact `Table` with status badges and action links

#### My Ideas (`/dashboard/member/ideas`)

**API:** `GET /api/v1/ideas?author=:currentUserId`

shadcn `Table` with columns: Title | Category | Status | Votes | Submitted | Actions

Action buttons per row (based on status):

| Status | Available Actions |
|--------|------------------|
| DRAFT | Edit, Submit for Review, Delete |
| UNDER_REVIEW | View |
| APPROVED | View |
| REJECTED | Edit (shows feedback), Delete |

- **Submit for Review:** `PATCH /api/v1/ideas/:id/submit`
- **Delete:** `AlertDialog` confirm → `DELETE /api/v1/ideas/:id`
- **Rejection feedback:** Shown as expandable `Alert variant="warning"` on the row

#### Create Idea (`/dashboard/member/ideas/new`)

**`IdeaForm`** (also used for edit):

| Field | Component | Validation |
|-------|-----------|------------|
| Title | `Input` | Required, 10–150 chars |
| Category | `Select` | Required |
| Problem Statement | `Textarea` (min-h-[120px]) | Required, min 50 chars |
| Proposed Solution | `Textarea` (min-h-[120px]) | Required, min 50 chars |
| Description | `Textarea` (min-h-[200px]) | Required, min 100 chars |
| Images | Multi-file dropzone | Max 5 files, 5MB each |
| Is Paid | `Switch` | — |
| Price ($) | `Input type="number"` | Required if Is Paid, min 0.99 |

Bottom action bar (sticky on mobile):
- `Button variant="outline"` "Save as Draft" → `POST /api/v1/ideas`
- `Button` "Submit for Review" → `POST /api/v1/ideas` then `PATCH /api/v1/ideas/:id/submit`

**Create API:** `POST /api/v1/ideas`
```json
{
  "title": "Community Solar Project",
  "categoryId": "TARGET_CATEGORY_ID",
  "problemStatement": "...",
  "proposedSolution": "...",
  "description": "...",
  "isPaid": false,
  "images": []
}
```

#### Edit Idea (`/dashboard/member/ideas/[id]/edit`)

- Pre-fills `IdeaForm` from `GET /api/v1/ideas/:id`
- If REJECTED: amber `Alert` at top with `rejectionFeedback` text
- Only editable if status is DRAFT or REJECTED (enforced in UI + API)
- **Update API:** `PATCH /api/v1/ideas/:id` `{ title, ... }`

#### Purchases (`/dashboard/member/purchases`)

**API:** `GET /api/v1/payments/purchases`

`Table`: Idea Title | Amount | Currency | Status | Date | Action ("View Idea" link)

---

### 7.6 Admin Dashboard

#### Overview (`/dashboard/admin`)

**APIs:** `GET /api/v1/admin/ideas`, `GET /api/v1/admin/users`

- 4 `StatsCard`: Total Members | Total Ideas | Pending Review | Approved
- "Pending Review" shortlist — top 5 UNDER_REVIEW ideas with quick Approve/Reject buttons

#### Idea Moderation (`/dashboard/admin/ideas`)

**API:** `GET /api/v1/admin/ideas`

shadcn `Tabs`: All | Under Review | Approved | Rejected

Each tab: `Table` with columns: Title | Author | Category | Status | Votes | Date | Actions

Actions:
- **Approve** `Button` (green) → `PATCH /api/v1/admin/ideas/:id/approve`
- **Reject** `Button` (red) → opens `RejectModal`
- **Delete** `Button` (outline) → `AlertDialog` → `DELETE /api/v1/admin/ideas/:id`

**RejectModal (`components/dashboard/RejectModal.tsx`):**
```typescript
// shadcn Dialog
// - Title: "Reject Idea"
// - Description: "Provide feedback for the submitter."
// - Textarea (required, min 20 chars, placeholder "e.g. Lacks feasibility study...")
// - Button "Reject Idea" variant="destructive"
// - Button "Cancel" variant="outline"
// API: PATCH /api/v1/admin/ideas/:id/reject { feedback }
```

#### User Management (`/dashboard/admin/users`)

**API:** `GET /api/v1/admin/users`

`Table`: Avatar | Name | Email | Role | Status | Joined | Actions

Actions per row:
- `Switch` (Activate/Deactivate) → `PATCH /api/v1/admin/users/:id/activate` or `/deactivate`
- `Select` for role change → `PATCH /api/v1/admin/users/:id/role` `{ role: "ADMIN" | "MEMBER" }`

#### Category Management (`/dashboard/admin/categories`)

**APIs:** `GET /api/v1/categories`, `POST /api/v1/categories`, `PATCH /api/v1/categories/:id`, `DELETE /api/v1/categories/:id`

- Add category form (top): `Input` + "Add" `Button`
- List: each category row has inline edit mode (`Input` replaces text on "Edit" click) + "Delete" button
- Delete: `AlertDialog` confirm; warns if ideas use the category

---

### 7.7 Payment Pages

#### Success (`/payment/success?session_id=cs_...`)

```typescript
// On mount: GET /api/v1/payments/verify/:sessionId
```
- Loading: `Skeleton` placeholders
- Success: large green checkmark (`CheckCircle2` icon from lucide), "Payment Successful!", "Your idea is now unlocked." message, `Button` "View Idea" (links back to the idea)
- Error: `Alert variant="destructive"` + "Contact support" link

#### Cancel (`/payment/cancel`)

- Amber warning icon (`AlertTriangle`)
- "Payment Cancelled" heading
- "Your purchase was not completed." message
- Two buttons: "Go Back" (`router.back()`) and "Browse Ideas" (`/ideas`)

---

## 8. State Management & Data Fetching

| Concern | Tool |
|---------|------|
| Server data | Next.js Server Components + `fetch` |
| Client mutations | Custom hooks + native `fetch` |
| Auth state | BetterAuth `useSession()` |
| Forms | `react-hook-form` + `zod` |
| Toasts | shadcn `useToast()` |
| Skeletons | shadcn `Skeleton` |
| Optimistic updates | Local `useState` with revert on error |

**useVote hook (with optimistic updates):**
```typescript
// hooks/useVote.ts
export function useVote(
  ideaId: string,
  initial: { upvoteCount: number; downvoteCount: number; userVote: VoteType | null }
) {
  const [upvoteCount, setUp]     = useState(initial.upvoteCount);
  const [downvoteCount, setDown] = useState(initial.downvoteCount);
  const [userVote, setUserVote]  = useState<VoteType | null>(initial.userVote);
  const [pending, setPending]    = useState(false);
  const { toast } = useToast();

  const cast = async (type: VoteType) => {
    if (pending) return;
    const removing = userVote === type;
    const snapshot = { upvoteCount, downvoteCount, userVote };

    // Optimistic update
    if (type === "UPVOTE") {
      setUp(c => c + (removing ? -1 : userVote === "DOWNVOTE" ? 1 : 1));
      if (!removing && userVote === "DOWNVOTE") setDown(c => c - 1);
    } else {
      setDown(c => c + (removing ? -1 : userVote === "UPVOTE" ? 1 : 1));
      if (!removing && userVote === "UPVOTE") setUp(c => c - 1);
    }
    setUserVote(removing ? null : type);
    setPending(true);

    try {
      removing
        ? await api.votes.remove(ideaId)           // DELETE /api/v1/ideas/:id/votes
        : await api.votes.cast(ideaId, type);      // POST   /api/v1/ideas/:id/votes
    } catch {
      setUp(snapshot.upvoteCount);
      setDown(snapshot.downvoteCount);
      setUserVote(snapshot.userVote);
      toast({ title: "Vote failed. Please try again.", variant: "destructive" });
    } finally {
      setPending(false);
    }
  };

  return { upvoteCount, downvoteCount, userVote, pending, cast };
}
```

---

## 9. Authentication Flow (BetterAuth Client)

```typescript
// lib/auth/betterAuthClient.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
});

export const { useSession, signIn, signUp, signOut } = authClient;
```

**Login** → BetterAuth handles: `POST /api/v1/auth/better-auth/sign-in/email`
```typescript
await signIn.email({ email, password, callbackURL: "/dashboard" });
```

**Signup** → Custom endpoint: `POST /api/v1/auth/signup`
```typescript
await api.auth.signup({ name, email, password });
```

**Get current user:** `GET /api/v1/auth/me`

**Update profile:** `PATCH /api/v1/auth/me` `{ name }` or `{ avatarUrl }`

**Change password:** `PATCH /api/v1/auth/me/password` `{ currentPassword, newPassword }`

### Route Protection (`proxy.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";

const MEMBER_PATHS = ["/dashboard/member", "/payment"];
const ADMIN_PATHS  = ["/dashboard/admin"];
const GUEST_ONLY   = ["/auth/login", "/auth/signup"];

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("better-auth.session_token")?.value;
  const role         = req.cookies.get("ecofy.role")?.value;
  const { pathname } = req.nextUrl;

  const needsMember = MEMBER_PATHS.some(p => pathname.startsWith(p));
  const needsAdmin  = ADMIN_PATHS.some(p => pathname.startsWith(p));
  const isGuestOnly = GUEST_ONLY.some(p => pathname.startsWith(p));

  if (!sessionToken && (needsMember || needsAdmin))
    return NextResponse.redirect(new URL(`/auth/login?from=${encodeURIComponent(pathname)}`, req.url));

  if (needsAdmin && role !== "ADMIN")
    return NextResponse.redirect(new URL("/dashboard/member", req.url));

  if (sessionToken && isGuestOnly)
    return NextResponse.redirect(new URL("/dashboard", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/payment/:path*"],
};
```

---

## 10. Stripe Payment Flow

```
1. User views /ideas/[id], idea.isPaid=true, idea.isPurchased=false
2. Blurred content overlay + PurchaseButton visible
3. Click PurchaseButton
   → POST /api/v1/payments/checkout { ideaId }
   → Returns { checkoutUrl }
   → window.location.href = checkoutUrl
4. Stripe-hosted checkout page (user enters card details)
5a. SUCCESS
    → Stripe redirects to /payment/success?session_id=cs_...
    → GET /api/v1/payments/verify/:sessionId
    → Show success UI + "View Idea" CTA
5b. CANCEL
    → Stripe redirects to /payment/cancel
    → Show cancel UI + back button
6. Background: Stripe webhook (handled by backend)
   checkout.session.completed → Purchase.status = "completed"
```

**PurchaseButton component:**
```typescript
// components/payment/PurchaseButton.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";

export function PurchaseButton({ ideaId, price }: { ideaId: string; price: number }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { checkoutUrl } = await api.payments.createCheckout(ideaId);
      window.location.href = checkoutUrl;
    } catch {
      toast({ title: "Could not initiate payment. Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePurchase} disabled={loading} size="lg" className="w-full gap-2">
      {loading
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : <Lock className="h-4 w-4" />
      }
      Unlock Idea — ${price.toFixed(2)}
    </Button>
  );
}
```

---

## 11. shadcn/ui Component Usage

**Setup:**
```bash
npx shadcn@latest init
# Choose: Next.js, TypeScript, Tailwind, app dir, green base color, CSS variables
```

**Install all required components:**
```bash
npx shadcn@latest add button input textarea label select badge card separator
npx shadcn@latest add dialog alert-dialog sheet avatar skeleton
npx shadcn@latest add table tabs toast dropdown-menu popover
npx shadcn@latest add slider switch alert navigation-menu pagination
```

**`components.json`:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "green",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**`globals.css` (primary color override to Ecofy green):**
```css
:root {
  --primary: 142 71% 45%;           /* green-600 */
  --primary-foreground: 0 0% 100%;
  --ring: 142 71% 45%;
}
```

### Key component patterns

**IdeaCardSkeleton:**
```typescript
export function IdeaCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}
```

**IdeaStatusBadge:**
```typescript
const STATUS_CONFIG = {
  DRAFT:        { label: "Draft",        className: "bg-gray-100 text-gray-600 border-gray-200" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-100 text-amber-700 border-amber-200" },
  APPROVED:     { label: "Approved",     className: "bg-green-100 text-green-700 border-green-200" },
  REJECTED:     { label: "Rejected",     className: "bg-red-100 text-red-700 border-red-200" },
} as const;

export function IdeaStatusBadge({ status }: { status: IdeaStatus }) {
  const { label, className } = STATUS_CONFIG[status];
  return <Badge variant="outline" className={className}>{label}</Badge>;
}
```

---

## 12. API Client Layer

All endpoints exactly match the Postman collection (`baseUrl = http://localhost:4000/api/v1`).

```typescript
// lib/api/client.ts

const BASE = process.env.NEXT_PUBLIC_API_URL + "/api/v1";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",       // BetterAuth cookie sent automatically
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Request failed");
  return json.data as T;
}

function qs(params: Record<string, unknown>): string {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString();
}

export const api = {

  // ── Health ─────────────────────────────────────────────────────────────
  // GET /health
  health: {
    check: () => req<{ status: string }>("/health"),
  },

  // ── Auth ───────────────────────────────────────────────────────────────
  // POST /auth/signup
  // POST /auth/better-auth/sign-in/email  (handled by BetterAuth client)
  // GET  /auth/me
  // PATCH /auth/me
  // PATCH /auth/me/password
  auth: {
    signup: (body: { name: string; email: string; password: string }) =>
      req<User>("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
    me: () =>
      req<User>("/auth/me"),
    updateProfile: (body: { name?: string; avatarUrl?: string }) =>
      req<User>("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),
    changePassword: (body: { currentPassword: string; newPassword: string }) =>
      req<void>("/auth/me/password", { method: "PATCH", body: JSON.stringify(body) }),
  },

  // ── Categories ─────────────────────────────────────────────────────────
  // GET    /categories
  // POST   /categories           (Admin)
  // PATCH  /categories/:id       (Admin)
  // DELETE /categories/:id       (Admin)
  categories: {
    list:   () =>
      req<Category[]>("/categories"),
    create: (name: string) =>
      req<Category>("/categories", { method: "POST", body: JSON.stringify({ name }) }),
    update: (id: string, name: string) =>
      req<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
    delete: (id: string) =>
      req<void>(`/categories/${id}`, { method: "DELETE" }),
  },

  // ── Ideas ──────────────────────────────────────────────────────────────
  // GET    /ideas
  // GET    /ideas/:id
  // POST   /ideas
  // PATCH  /ideas/:id
  // PATCH  /ideas/:id/submit
  // DELETE /ideas/:id
  ideas: {
    list:   (params: IdeaQueryParams) =>
      req<PaginatedIdeas>(`/ideas?${qs(params as Record<string, unknown>)}`),
    get:    (id: string) =>
      req<Idea>(`/ideas/${id}`),
    create: (body: CreateIdeaDto) =>
      req<Idea>("/ideas", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<CreateIdeaDto>) =>
      req<Idea>(`/ideas/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    submit: (id: string) =>
      req<Idea>(`/ideas/${id}/submit`, { method: "PATCH" }),
    delete: (id: string) =>
      req<void>(`/ideas/${id}`, { method: "DELETE" }),
  },

  // ── Votes ──────────────────────────────────────────────────────────────
  // POST   /ideas/:id/votes   { type }
  // DELETE /ideas/:id/votes
  votes: {
    cast:   (ideaId: string, type: VoteType) =>
      req<void>(`/ideas/${ideaId}/votes`, { method: "POST", body: JSON.stringify({ type }) }),
    remove: (ideaId: string) =>
      req<void>(`/ideas/${ideaId}/votes`, { method: "DELETE" }),
  },

  // ── Comments ───────────────────────────────────────────────────────────
  // GET    /ideas/:id/comments
  // POST   /ideas/:id/comments                  { content }
  // POST   /ideas/:id/comments/:parentId/replies { content }
  // DELETE /ideas/:id/comments/:commentId
  comments: {
    list:   (ideaId: string) =>
      req<Comment[]>(`/ideas/${ideaId}/comments`),
    post:   (ideaId: string, content: string) =>
      req<Comment>(`/ideas/${ideaId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
    reply:  (ideaId: string, parentId: string, content: string) =>
      req<Comment>(`/ideas/${ideaId}/comments/${parentId}/replies`, { method: "POST", body: JSON.stringify({ content }) }),
    delete: (ideaId: string, commentId: string) =>
      req<void>(`/ideas/${ideaId}/comments/${commentId}`, { method: "DELETE" }),
  },

  // ── Payments ───────────────────────────────────────────────────────────
  // POST /payments/checkout          { ideaId }
  // GET  /payments/verify/:sessionId
  // GET  /payments/purchases
  payments: {
    createCheckout: (ideaId: string) =>
      req<{ checkoutUrl: string }>("/payments/checkout", { method: "POST", body: JSON.stringify({ ideaId }) }),
    verify: (sessionId: string) =>
      req<Purchase>(`/payments/verify/${sessionId}`),
    myPurchases: () =>
      req<Purchase[]>("/payments/purchases"),
  },

  // ── Search ─────────────────────────────────────────────────────────────
  // GET /search?q=solar&category=...
  search: {
    ideas: (q: string, params?: Pick<IdeaQueryParams, "category" | "page" | "limit">) =>
      req<PaginatedIdeas>(`/search?q=${encodeURIComponent(q)}&${qs((params ?? {}) as Record<string, unknown>)}`),
  },

  // ── Newsletter ─────────────────────────────────────────────────────────
  // POST   /newsletter/subscribe   { email }
  // DELETE /newsletter/unsubscribe { email }
  newsletter: {
    subscribe:   (email: string) =>
      req<void>("/newsletter/subscribe", { method: "POST", body: JSON.stringify({ email }) }),
    unsubscribe: (email: string) =>
      req<void>("/newsletter/unsubscribe", { method: "DELETE", body: JSON.stringify({ email }) }),
  },

  // ── Admin ──────────────────────────────────────────────────────────────
  // GET    /admin/ideas
  // PATCH  /admin/ideas/:id/approve
  // PATCH  /admin/ideas/:id/reject      { feedback }
  // DELETE /admin/ideas/:id
  // GET    /admin/users
  // PATCH  /admin/users/:id/activate
  // PATCH  /admin/users/:id/deactivate
  // PATCH  /admin/users/:id/role        { role }
  admin: {
    ideas: {
      list:    () =>
        req<Idea[]>("/admin/ideas"),
      approve: (id: string) =>
        req<Idea>(`/admin/ideas/${id}/approve`, { method: "PATCH" }),
      reject:  (id: string, feedback: string) =>
        req<Idea>(`/admin/ideas/${id}/reject`, { method: "PATCH", body: JSON.stringify({ feedback }) }),
      delete:  (id: string) =>
        req<void>(`/admin/ideas/${id}`, { method: "DELETE" }),
    },
    users: {
      list:       () =>
        req<User[]>("/admin/users"),
      activate:   (id: string) =>
        req<User>(`/admin/users/${id}/activate`, { method: "PATCH" }),
      deactivate: (id: string) =>
        req<User>(`/admin/users/${id}/deactivate`, { method: "PATCH" }),
      setRole:    (id: string, role: Role) =>
        req<User>(`/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
    },
  },
};
```

---

## 13. Type Definitions

```typescript
// types/index.ts

export type Role           = "MEMBER" | "ADMIN";
export type IdeaStatus     = "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type VoteType       = "UPVOTE" | "DOWNVOTE";
export type PurchaseStatus = "pending" | "completed" | "refunded";

export interface User {
  id:         string;
  email:      string;
  name:       string;
  role:       Role;
  isActive:   boolean;
  avatarUrl?: string;
  createdAt:  string;
}

export interface Category {
  id:   string;
  name: string;
  slug: string;
}

export interface Idea {
  id:                 string;
  title:              string;
  slug:               string;
  problemStatement:   string;
  proposedSolution:   string;
  description:        string;
  images:             string[];
  isPaid:             boolean;
  price?:             number;
  status:             IdeaStatus;
  rejectionFeedback?: string;
  upvoteCount:        number;
  downvoteCount:      number;
  commentCount:       number;
  author:             Pick<User, "id" | "name" | "avatarUrl">;
  category:           Category;
  userVote?:          VoteType | null;   // Present when authenticated
  isPurchased?:       boolean;           // Present when authenticated
  createdAt:          string;
  updatedAt:          string;
}

export interface Comment {
  id:        string;
  content:   string;
  isDeleted: boolean;
  author:    Pick<User, "id" | "name" | "avatarUrl">;
  createdAt: string;
  replies:   Comment[];
}

export interface Purchase {
  id:        string;
  amount:    number;
  currency:  string;
  status:    PurchaseStatus;
  ideaId:    string;
  idea?:     Pick<Idea, "id" | "title" | "slug">;
  createdAt: string;
}

export interface PaginatedIdeas {
  data: Idea[];
  meta: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

export interface IdeaQueryParams {
  page?:     number;
  limit?:    number;
  sort?:     "recent" | "top_voted" | "most_commented";
  category?: string;
  paid?:     boolean;
  minVotes?: number;
  author?:   string;
  q?:        string;
}

export interface CreateIdeaDto {
  title:            string;
  categoryId:       string;
  problemStatement: string;
  proposedSolution: string;
  description:      string;
  images:           string[];
  isPaid:           boolean;
  price?:           number;
}
```

---

## 14. Environment Variables

```env
# .env.local

# Public (safe to expose in browser)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Server-only (not exposed to browser, used in Server Components / Route Handlers)
STRIPE_SECRET_KEY=sk_test_...
```

---

## UI/UX Notes

**Sticky Navbar:**
- `sticky top-0 z-50` — always visible on scroll, sits above all page content
- `backdrop-blur` + semi-transparent background for frosted glass effect
- Height is `h-16` (64px); page content does not need padding-top as the sticky header sits above the flow

**shadcn/ui integration:**
- All interactive elements (buttons, inputs, modals, toasts, tables, tabs) use shadcn components
- Custom styling is additive via `className` prop using `cn()` utility — never overrides base shadcn styles destructively
- Dark mode supported by default via shadcn CSS variables; toggle is optional

**Responsiveness:**
- Mobile-first. Filters sidebar → `Sheet` on `< lg`. Grid → 1 col → 2 col → 3 col
- Dashboard sidebar → `Sheet` drawer on `< lg`
- Navbar → hamburger `Sheet` on `< md`

**Loading & Skeletons:**
- `Skeleton` components match exact card dimensions to prevent cumulative layout shift (CLS)
- Mutations (vote, comment) show `Loader2` spinner inline on the triggering button

**Paid idea paywall:**
- Content rendered server-side but wrapped in a `blur-sm` + `pointer-events-none` div
- Glassmorphism overlay card with `PurchaseButton` — not a redirect wall

**Error handling:**
- API errors → `useToast()` with `variant="destructive"`
- Form errors → inline below each field via `react-hook-form` `formState.errors`
- 404 ideas → `not-found.tsx` with "Idea not found" message and "Browse Ideas" CTA

**Form persistence:**
- Draft idea form auto-saves to `localStorage` every 30 seconds via `useEffect` + debounce
- On returning to `/dashboard/member/ideas/new`, restore from `localStorage` with a banner

**Accessibility:**
- Icon-only buttons always have `aria-label`
- `Dialog` and `Sheet` from shadcn trap focus by default
- Color contrast meets WCAG AA for all text/background pairs
- Form fields paired with `Label` components (htmlFor / id linkage)