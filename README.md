# DDL Retailer App

**Direct Demand-to-Logistics (DDL) Platform — Retailer Mobile Application**

A mobile-first Progressive Web App for shopkeepers in Bugolobi, Kampala to signal demand to suppliers. Part of the [DDL System](https://github.com/danmahande/DDL-System) platform.

## Features

- **Inventory Browsing** — Browse available products by category with a minimalist grid interface
- **Demand Signal Generation** — Signal product needs with urgency levels (Urgent/Normal/Low) and quantities
- **Signal History** — Track all demand signals with status updates (Pending → Synced → Assigned → In Transit → Delivered)
- **Offline-First** — Signals are saved locally and synced when connectivity is available
- **PWA Installable** — Works as a native app on Android and iOS via "Add to Home Screen"

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS 4** with minimalist black/white design
- **Prisma ORM** with SQLite
- **Lucide React** icons
- **Framer Motion** animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

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

# Seed demo data
curl -X POST http://localhost:3000/api/seed

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
```

## Demo Data

The app comes pre-loaded with:
- **24 household provisions** across 7 categories (Beverages, Groceries, Dairy, Bakery, Snacks, Cleaning, Personal Care)
- **6 demo demand signals** showing various statuses
- **Retailer profile** for "Daniel's General Shop" at Bugolobi Market

To seed fresh demo data:

```bash
curl -X POST http://localhost:3000/api/seed
```

## API Endpoints

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
src/
├── app/
│   ├── api/
│   │   ├── products/route.ts    # Product listing API
│   │   ├── signals/route.ts     # Demand signal CRUD API
│   │   ├── profile/route.ts     # Retailer profile API
│   │   ├── sync/route.ts        # Signal sync API
│   │   └── seed/route.ts        # Demo data seeder
│   ├── globals.css              # Global styles with PWA support
│   ├── layout.tsx               # Root layout with PWA meta
│   └── page.tsx                 # Main app (4 screens + modal)
├── components/ui/               # shadcn/ui components
├── hooks/                       # React hooks
└── lib/
    ├── db.ts                    # Prisma client
    └── utils.ts                 # Utility functions
prisma/
└── schema.prisma                # Database schema
public/
├── manifest.json                # PWA manifest
├── icon-192.png                 # PWA icon
└── icon-512.png                 # PWA icon
```

## Data Models

### Product
Matches the supplier dashboard's Product model with fields: `productId`, `productLabel`, `brand`, `category`, `priceTier`, `packageSize`, `unitCost`, `unitPrice`, `currentStock`

### DemandSignal
Compatible with the supplier dashboard's DemandSignal model: `signalId`, `shopkeeperId`, `neighborhood`, `productCategory`, `urgency`, `status`, `isSynced`, `privacyApplied`

### RetailerProfile
Shop keeper profile: `shopkeeperId`, `businessName`, `contact`, `neighborhood`

## Related

- [DDL System — Supplier Dashboard](https://github.com/danmahande/DDL-System)

## Author

Daniel Mahande — ISBAT University, Kampala
