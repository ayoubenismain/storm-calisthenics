# STORM BARZ - E-Commerce Platform

A premium, cinematic, highly creative e-commerce website for the calisthenics brand STORM / Storm Barz.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4) & shadcn/ui
- Framer Motion & GSAP
- Lenis (Smooth Scrolling)
- Three.js & React Three Fiber (3D integration)
- MongoDB & Mongoose
- Custom JWT Authentication (jose)
- Zustand (State management)
- Cloudflare R2 (Asset storage)

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your actual credentials.
   ```bash
   cp .env.example .env.local
   ```
   *Make sure you have a local or remote MongoDB instance running.*

3. **Seed Database**
   To create the default admin account:
   ```bash
   npm run seed:admin
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Public Website: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin` (Login with seeded admin credentials)

## Architecture Details

- `src/app/(public)`: All public-facing pages (Home, Products, Drops)
- `src/app/admin`: Secure admin dashboard "Storm Control Room"
- `src/components`: Contains public, admin, shared UI, and 3D components.
- `src/models`: Mongoose database schemas.
- `src/lib`: Utilities for MongoDB connection, authentication, and Cloudflare R2.
- `src/store`: Zustand cart and state management.

*Built for power. Designed for control. Become the Storm.*
