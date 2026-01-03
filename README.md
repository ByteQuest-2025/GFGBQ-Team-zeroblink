# AkshayaVault

Self-Sovereign Financial Identity (SSFI) Platform using Zero-Knowledge Proofs

Team: zeroblink

---

## Overview

AkshayaVault is a privacy-preserving identity verification platform that enables users to prove claims about their documents (age, income, education, tax compliance) without revealing the underlying personal data. Built with real ZK circuits using Groth16 proving system.

<p align="center">
  <img src="public/ZKP.png" alt="Zero-Knowledge Proof Concept" width="600"/>
</p>

## Live Demo

The platform demonstrates a complete DigiLocker-style verification flow:
1. User uploads document and generates ZK proof
2. Verifier (bank, government) creates verification request
3. User approves sharing their proof
4. Verifier cryptographically verifies the claim

---

## What are Zero-Knowledge Proofs?

Zero-Knowledge Proofs (ZKPs) allow one party (the prover) to prove to another party (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself.

**Example:** Prove you are over 18 years old without revealing your actual date of birth.

> **Learn More:** [RareSkills ZK Book](https://rareskills.io/zk-book) - Comprehensive guide to understanding Zero-Knowledge Proofs

---

## Features

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

---

## Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- Git
- Supabase account ([Sign up free](https://supabase.com/))

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

1. Create a `.env.local` file in the root directory:

```bash
# Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

2. Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Finding your Supabase credentials:**
> 1. Go to [Supabase Dashboard](https://app.supabase.com/)
> 2. Select your project (or create one)
> 3. Go to Settings → API
> 4. Copy "Project URL" and "anon public" key

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

### Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Ensure **Email** provider is enabled
3. (Optional) Configure email templates in **Authentication → Email Templates**

### Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verify Installation

1. Visit `http://localhost:3000` - You should see the landing page
2. Click "Get Started" to create an account
3. Check your email for confirmation link
4. After confirming, login and try generating a proof

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
│   └── lib/                  # Utilities (auth, supabase, zk-proof, ocr)
```

---

## ZK Circuits

The platform uses four Circom circuits:

| Circuit | Purpose | Public Inputs |
|---------|---------|---------------|
| ageVerification | Prove age > threshold | currentYear, ageThreshold |
| incomeRange | Prove income in range | minIncome, maxIncome |
| degreeVerification | Prove degree completion | minPassingPercentage |
| panVerification | Prove tax compliance | currentYear, maxYearGap |

### Building Circuits

```bash
cd circuits
./build.sh  # Linux/Mac
./build.ps1 # Windows PowerShell
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
│   1. SIGN UP    │       │  2. UPLOAD DOC  │       │  3. GENERATE    │
│                 │       │                 │       │     ZK PROOF    │
│  Email + Pass   │──────▶│  Aadhaar/PAN/   │──────▶│                 │
│  Confirmation   │       │  Salary/Marks   │       │  Groth16/BN128  │
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
                                     ┌───────────────────────┘
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


┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ZK PROOF GENERATION                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Document │───▶│   OCR    │───▶│  Extract │───▶│  Circom  │───▶│  Groth16 │
  │  Upload  │    │ Process  │    │   Data   │    │  Circuit │    │   Proof  │
  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                       ┌───────────────────────────────┴───────────────────┐
                       │                                                   │
              ┌────────┴────────┐                              ┌───────────┴───────┐
              │  Private Input  │                              │   Public Input    │
              │                 │                              │                   │
              │  - Birth Year   │                              │  - Current Year   │
              │  - Actual Income│                              │  - Age Threshold  │
              │  - Total Marks  │                              │  - Min Income     │
              └─────────────────┘                              └───────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SUPPORTED DOCUMENTS                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
  │   AADHAAR   │   │ SALARY SLIP │   │  MARKSHEET  │   │  PAN CARD   │
  │             │   │             │   │             │   │             │
  │  Proves:    │   │  Proves:    │   │  Proves:    │   │  Proves:    │
  │  Age > 18   │   │  Income >   │   │  Degree     │   │  Tax        │
  │             │   │  50,000/mo  │   │  Verified   │   │  Compliant  │
  └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

## User Flow

### For Users
1. Sign up with email (confirmation required)
2. Upload document (Aadhaar, Salary Slip, etc.)
3. ZK proof is generated locally
4. Proof stored in vault (expires in 7 days)
5. Share proof with verifiers when requested

### For Verifiers
1. Go to Verifier Portal
2. Select organization (demo mode)
3. Create verification request
4. Share link with user
5. User approves, verifier sees result
6. Cryptographically verify the proof

---

## Security & Privacy

- **Local Processing**: Documents never leave the user's browser
- **Zero-Knowledge**: Verifiers only see the claim result, not the data
- **Groth16 Proofs**: Mathematically sound cryptographic proofs
- **No Data Storage**: Raw documents are not stored anywhere
- **Time-Limited**: Proofs expire after 7 days

---

## API Reference

### Authentication
- `signUp(email, password, name)` - Create account
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `getCurrentUser()` - Get current user

### ZK Proofs
- `generateZKProof(input, onProgress)` - Generate proof
- `verifyZKProof(proof, documentType)` - Verify proof

### OCR
- `performOCR(file, documentType, onProgress)` - Extract text from document

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## License

MIT License - see LICENSE file for details

---

## Team zeroblink

Built by [@Sanath0106](https://github.com/Sanath0106) and [@jetsu03](https://github.com/jetsu03)

GFG ByteQuest Hackathon 2025
