# DDL Retailer App

**Direct Demand-to-Logistics (DDL) Platform — Retailer Mobile Application**

A native mobile app for shopkeepers in Bugolobi, Kampala to signal demand to suppliers. Built with Capacitor for Android & iOS. Part of the [DDL System](https://github.com/danmahande/DDL-System) platform.

## Features

- **Inventory Browsing** — Browse available products by category with a minimalist grid interface
- **Demand Signal Generation** — Signal product needs with urgency levels (Urgent/Normal/Low) and quantities
- **Signal History** — Track all demand signals with status updates (Pending → Synced → Assigned → In Transit → Delivered)
- **Offline-First** — Signals are saved locally and synced when connectivity is available
- **Native App** — Runs as a real Android (.apk) and iOS app via Capacitor
- **Also works as a PWA** — Can be installed from the browser on any device

## Tech Stack

- **Next.js 16** with App Router + Static Export
- **TypeScript**
- **Tailwind CSS 4** with minimalist black/white design
- **Prisma ORM** with SQLite (for web mode)
- **Capacitor 8** for native Android & iOS
- **Lucide React** icons + **Framer Motion** animations
- **Dual data layer** — API routes (web) + localStorage (native)

## Quick Start (Web Mode)

```bash
# Clone the repository
git clone https://github.com/danmahande/DDL-RETAILER.git
cd DDL-RETAILER

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Push database schema
npx prisma db push

# Seed demo data (after starting the server)
npm run dev
# In another terminal:
npm run seed
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building the Native App (Android/iOS)

### Prerequisites

- **Android Studio** (for Android builds) — [Download](https://developer.android.com/studio)
- **Xcode** (for iOS builds, Mac only) — [Download](https://developer.apple.com/xcode/)
- **Java JDK 17+** (for Android)

### Setup

```bash
# 1. Build the static export
npm run build:static

# 2. Add platforms (first time only)
npx cap add android
npx cap add ios

# 3. Sync web code to native projects
npx cap sync
```

### Run on Android

```bash
# Option A: Run on connected device/emulator
npx cap run android

# Option B: Open in Android Studio
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Connect your Android phone (with USB debugging enabled) or start an emulator
3. Click ▶️ Run

**To generate an APK:**
1. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`
3. Transfer this `.apk` to any Android phone and install it

### Run on iOS (Mac only)

```bash
npx cap open ios
```

In Xcode:
1. Select your development team in Signing & Capabilities
2. Connect your iPhone or select a simulator
3. Click ▶️ Run

### Live Development on Device

```bash
# Start the dev server accessible from your network
npm run dev:network

# Find your computer's IP (e.g., 192.168.1.105)
# Then update capacitor.config.ts:
# server: { url: 'http://192.168.1.105:3000', cleartext: true }

# Run on device with live reload
npx cap run android --livereload --external
```

## Demo Data

The app comes pre-loaded with:
- **24 household provisions** across 7 categories (Beverages, Groceries, Dairy, Bakery, Snacks, Cleaning, Personal Care)
- **6 demo demand signals** showing various statuses
- **Retailer profile** for "Daniel's General Shop" at Bugolobi Market

Demo data is automatically seeded on first launch (using localStorage for native, API for web).

## Data Architecture

The app uses a **dual data layer**:

| Mode | Storage | Use Case |
|------|---------|----------|
| **Web** | Prisma/SQLite via API routes | Full-stack development, supplier dashboard integration |
| **Native** | localStorage (client-side) | Standalone mobile app, offline-first |

When running as a native app (Capacitor), the app automatically detects the environment and uses localStorage. When running as a web app, it uses the API routes with Prisma.

## API Endpoints (Web Mode Only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | Fetch all active products |
| `/api/signals` | GET | Fetch all demand signals |
| `/api/signals` | POST | Create a new demand signal |
| `/api/profile` | GET | Fetch retailer profile |
| `/api/profile` | PUT | Update retailer profile |
| `/api/sync` | POST | Sync unsynced signals |
| `/api/seed` | POST | Seed demo data |

## Project Structure

```
├── android/                    # Capacitor Android project
├── ios/                        # Capacitor iOS project
├── src/
│   ├── app/
│   │   ├── api/               # API routes (web mode)
│   │   │   ├── products/
│   │   │   ├── signals/
│   │   │   ├── profile/
│   │   │   ├── sync/
│   │   │   └── seed/
│   │   ├── globals.css        # Global styles with PWA support
│   │   ├── layout.tsx         # Root layout with PWA meta
│   │   └── page.tsx           # Main app (4 screens + modal)
│   ├── components/ui/         # shadcn/ui components
│   ├── hooks/                 # React hooks
│   └── lib/
│       ├── db.ts              # Prisma client
│       ├── local-db.ts        # Client-side data layer (native mode)
│       └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── icon-192.png           # PWA icon
│   └── icon-512.png           # PWA icon
├── capacitor.config.ts        # Capacitor configuration
└── next.config.ts             # Next.js with static export
```

## Data Models

### Product
Matches the supplier dashboard's Product model: `productId`, `productLabel`, `brand`, `category`, `priceTier`, `packageSize`, `unitCost`, `unitPrice`, `currentStock`

### DemandSignal
Compatible with the supplier dashboard's DemandSignal model: `signalId`, `shopkeeperId`, `neighborhood`, `productCategory`, `urgency`, `status`, `isSynced`, `privacyApplied`

### RetailerProfile
Shop keeper profile: `shopkeeperId`, `businessName`, `contact`, `neighborhood`

## Related

- [DDL System — Supplier Dashboard](https://github.com/danmahande/DDL-System)

## Author

Daniel Mahande — ISBAT University, Kampala
