# AkshayaVault

Self-Sovereign Financial Identity platform for India using Zero-Knowledge Proofs.

## Overview

AkshayaVault empowers users with complete ownership over their financial identity. Prove credentials like age, income, or tax compliance without revealing raw data using ZKP technology.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **ZKP**: Circom 2 + SnarkJS (browser-side proof generation)
- **Identity**: Anon Aadhaar for UIDAI signature verification
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Blockchain**: Polygon Amoy Testnet for audit trail
- **Styling**: Tailwind CSS

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  app/
    page.tsx          # Landing page
    vault/page.tsx    # User vault dashboard
    generate/page.tsx # Proof generation flow
  components/
    ui/               # Reusable UI components
    layout/           # Navbar, Footer
    sections/         # Landing page sections
  lib/
    utils.ts          # Utility functions
```

## Key Features

- Local proof generation (data never leaves device)
- Selective disclosure (prove attributes without revealing values)
- Self-destructing proofs (7-day auto-expiry)
- India Stack integration (Anon Aadhaar)
- Blockchain audit trail (Polygon)

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## License

MIT
