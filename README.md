# AkshayaVault

Self-Sovereign Financial Identity (SSFI) Platform using Zero-Knowledge Proofs

Team: zeroblink

**Live Demo:** [akshayavault.vercel.app](https://akshayavault.vercel.app/)

**Project Resources:** [Google Drive](https://drive.google.com/drive/folders/1kueQyNmRsJY3rx_jWIMz4su86T2Lr5Tv?usp=sharing) (Contains PPT & Video Demo)

---

## Overview

AkshayaVault is a privacy-preserving identity verification platform that enables users to prove claims about their documents (age, income, education, tax compliance) without revealing the underlying personal data. Built with real ZK circuits using Groth16 proving system.

<p align="center">
  <img src="public/ZKP.png" alt="Zero-Knowledge Proof Concept" width="600"/>
</p>

## Live Demo

The platform demonstrates a complete DigiLocker-style verification flow:
1. User uploads document and AI validates document type
2. OCR extracts relevant data locally
3. ZK proof is generated using Groth16 circuits
4. Verifier (bank, government) creates verification request
5. User approves sharing their proof
6. Verifier cryptographically verifies the claim

---

## What are Zero-Knowledge Proofs?

Zero-Knowledge Proofs (ZKPs) allow one party (the prover) to prove to another party (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself.

**Example:** Prove you are over 18 years old without revealing your actual date of birth.

> **Learn More:** [RareSkills ZK Book](https://rareskills.io/zk-book) - Comprehensive guide to understanding Zero-Knowledge Proofs

---

## Features

- **AI Document Validation**: Gemini AI verifies document type before processing
- **Zero-Knowledge Proofs**: Real Groth16 proofs using snarkjs and Circom circuits
- **Document Types**: Aadhaar (age), Salary Slip (income), Marksheet (education), PAN Card (tax)
- **Privacy-First**: All document processing happens locally in the browser
- **Verifier Portal**: Organizations can request and verify proofs
- **User Vault**: Manage and share your generated proofs
- **Email Authentication**: Secure signup with email confirmation

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| ZK Proofs | snarkjs, Circom (Groth16/BN128) |
| OCR | Tesseract.js |
| AI Validation | Google Gemini 2.5 Flash |

---

## Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- Git
- Supabase account ([Sign up free](https://supabase.com/))
- Google AI API key ([Get free key](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/ByteQuest-2025/GFGBQ-Team-zeroblink.git

# Navigate to project directory
cd GFGBQ-Team-zeroblink

# Install dependencies
npm install

# Install circuit dependencies (for ZK proof generation)
cd circuits
npm install
cd ..
```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API (Required for document validation)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

#### Getting Your API Keys:

**Supabase:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (or create one)
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

**Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the generated key

### Database Setup

Run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):

```sql
-- 1. Users table (for profile data)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Proofs table (stores ZK proofs)
CREATE TABLE IF NOT EXISTS proofs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  attribute TEXT NOT NULL,
  proof_data JSONB NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own proofs" ON proofs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own proofs" ON proofs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can read proofs by id" ON proofs FOR SELECT USING (true);

-- 3. Verification requests table (for verifier flow)
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  verifier_name TEXT NOT NULL,
  verifier_id TEXT NOT NULL,
  required_proof_type TEXT NOT NULL,
  required_attribute TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  user_id UUID,
  proof_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_select" ON verification_requests FOR SELECT USING (true);
CREATE POLICY "allow_all_insert" ON verification_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_all_update" ON verification_requests FOR UPDATE USING (true);
```

### Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── circuits/                 # Circom ZK circuits
│   ├── ageVerification.circom
│   ├── incomeRange.circom
│   ├── degreeVerification.circom
│   └── panVerification.circom
├── public/circuits/          # Compiled circuit files (wasm, zkey)
├── src/
│   ├── app/                  # Next.js pages
│   │   ├── generate/         # Proof generation
│   │   ├── vault/            # User's proof vault
│   │   ├── verify/           # Public verification
│   │   ├── verifier/         # Verifier portal
│   │   └── request/          # Verification request handling
│   ├── components/           # React components
│   ├── context/              # Auth context
│   └── lib/                  # Utilities
│       ├── auth.ts           # Authentication functions
│       ├── supabase.ts       # Supabase client
│       ├── zk-proof.ts       # ZK proof generation
│       ├── ocr.ts            # OCR processing
│       └── document-validator.ts  # AI document validation
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AKSHAYAVAULT WORKFLOW                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │    USER      │
                              └──────┬───────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   1. SIGN UP    │       │  2. UPLOAD DOC  │       │  3. AI VALIDATE │
│                 │       │                 │       │                 │
│  Email + Pass   │──────▶│  Aadhaar/PAN/   │──────▶│  Gemini 2.5     │
│  Confirmation   │       │  Salary/Marks   │       │  Flash API      │
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
                                     ┌───────────────────────┘
                                     ▼
                          ┌─────────────────┐
                          │  4. OCR + ZK    │
                          │                 │
                          │  Tesseract.js   │
                          │  + Groth16      │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   USER VAULT    │
                          │                 │
                          │  Stores proofs  │
                          │  (7 day expiry) │
                          └────────┬────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         │                                                   │
         ▼                                                   ▼
┌─────────────────┐                               ┌─────────────────┐
│  DIRECT SHARE   │                               │ VERIFIER FLOW   │
│                 │                               │                 │
│  Copy Proof ID  │                               │  (DigiLocker    │
│  Share Link     │                               │   Style)        │
└────────┬────────┘                               └────────┬────────┘
         │                                                 │
         │                                                 ▼
         │                                      ┌─────────────────┐
         │                                      │    VERIFIER     │
         │                                      │    PORTAL       │
         │                                      │                 │
         │                                      │ Election Comm.  │
         │                                      │ SBI / HDFC      │
         │                                      │ Passport Seva   │
         │                                      └────────┬────────┘
         │                                               │
         │                                               ▼
         │                                    ┌─────────────────┐
         │                                    │ CREATE REQUEST  │
         │                                    │                 │
         │                                    │ - Proof Type    │
         │                                    │ - Purpose       │
         │                                    │ - 24hr Expiry   │
         │                                    └────────┬────────┘
         │                                             │
         │                              ┌──────────────┘
         │                              ▼
         │                   ┌─────────────────┐
         │                   │  SHARE LINK     │
         │                   │  WITH USER      │
         │                   └────────┬────────┘
         │                            │
         │                            ▼
         │                 ┌─────────────────┐
         │                 │  USER REVIEWS   │
         │                 │  & APPROVES     │
         │                 │                 │
         │                 │ Select proof    │
         │                 │ from vault      │
         │                 └────────┬────────┘
         │                          │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌─────────────────┐
         │    VERIFIER     │
         │    VERIFIES     │
         │                 │
         │ Cryptographic   │
         │ ZK Verification │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │    RESULT       │
         │                 │
         │ ✓ "Age > 18"    │
         │   VERIFIED      │
         │                 │
         │ (No personal    │
         │  data exposed)  │
         └─────────────────┘
```



## ZK Proof Generation Flow

```
  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Document │───▶│  Gemini  │───▶│   OCR    │───▶│  Circom  │───▶│  Groth16 │
  │  Upload  │    │ Validate │    │ Extract  │    │  Circuit │    │   Proof  │
  │ (PNG/JPG)│    │   Type   │    │   Data   │    │          │    │          │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## Supported Documents

| Document | Proof Generated | Accepted Formats |
|----------|-----------------|------------------|
| Aadhaar Card | Age > 18 | PNG, JPG, JPEG |
| Salary Slip | Income > 50,000/mo | PNG, JPG, JPEG |
| Marksheet | Degree Verified | PNG, JPG, JPEG |
| PAN Card | Tax Compliant | PNG, JPG, JPEG |

---

## Security & Privacy

- **AI Validation**: Gemini verifies document type before processing
- **Local Processing**: Documents never leave the user's browser
- **Zero-Knowledge**: Verifiers only see the claim result, not the data
- **Groth16 Proofs**: Mathematically sound cryptographic proofs
- **No Data Storage**: Raw documents are not stored anywhere
- **Time-Limited**: Proofs expire after 7 days

---

## Estimated Project Cost

| Component | Service | Cost (INR) |
|-----------|---------|------------|
| Hosting | Vercel (Free Tier) | ₹0 |
| Database | Supabase (Free Tier - 500MB) | ₹0 |
| Authentication | Supabase Auth (Free - 50K MAU) | ₹0 |
| AI Validation | Gemini API (Free Tier - 60 RPM) | ₹0 |
| Domain | Optional (.in domain) | ₹500-800/year |
| **Total MVP** | | **₹0 - ₹800** |

### Production Scale Estimates

| Scale | Users/Month | Estimated Cost |
|-------|-------------|----------------|
| Startup | 1,000 | ₹0 (Free tiers) |
| Growth | 10,000 | ₹2,000-5,000/mo |
| Enterprise | 100,000+ | ₹15,000-50,000/mo |

---

## Future Scope: AkshayaVault SDK

### Vision

Transform AkshayaVault into an SDK that organizations can integrate into their existing systems for seamless ZK-based verification.

### SDK Features (Planned)

```javascript
// Example SDK Usage
import { AkshayaVault } from '@akshayavault/sdk';

const vault = new AkshayaVault({
  apiKey: 'your-api-key',
  organizationId: 'org-123'
});

// Request verification from user
const request = await vault.createVerificationRequest({
  proofType: 'age',
  attribute: 'Age > 18',
  purpose: 'Account verification',
  callbackUrl: 'https://yourapp.com/verify-callback'
});

// Verify a proof
const result = await vault.verifyProof(proofId);
// { valid: true, attribute: 'Age > 18', timestamp: '...' }
```

### Integration Benefits

- **Plug & Play**: Simple npm install and configure
- **No ZK Expertise Required**: SDK handles all cryptographic operations
- **Compliance Ready**: Built-in audit trails and logging
- **Multi-Platform**: Web, mobile, and backend support
- **Cost Effective**: Pay-per-verification pricing model

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## Team zeroblink

Built by [@Sanath0106](https://github.com/Sanath0106) (Sanath R) and [@jetsu03](https://github.com/jetsu03) (Neha Honniganur)

GFG ByteQuest Hackathon 2025
