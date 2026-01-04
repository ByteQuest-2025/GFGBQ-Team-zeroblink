# AkshayaVault - Product Requirements Document

## Self-Sovereign Financial Identity Platform using Zero-Knowledge Proofs

Version 1.0 | January 2026

---

## Table of Contents

1. Executive Summary
2. Problem Statement
3. Solution Overview
4. Core Concept: Zero-Knowledge Proofs
5. System Architecture
6. ZK Circuit Implementation
7. Application Workflow
8. Project Structure
9. Technical Implementation
10. Security Model
11. Differentiation from Existing Systems
12. Future Roadmap

---

## 1. Executive Summary

AkshayaVault is a privacy-preserving identity verification platform that fundamentally reimagines how individuals share sensitive personal information with organizations. The platform enables users to prove claims about their identity documents, such as age, income level, educational qualifications, and tax compliance, without revealing the underlying personal data.

Built on the foundation of Zero-Knowledge Proofs using the Groth16 proving system, AkshayaVault addresses a critical gap in the current digital identity landscape where users are forced to share complete documents containing sensitive information simply to prove a single attribute.

The platform serves two primary user groups: individuals who need to verify their credentials while maintaining privacy, and organizations (verifiers) who need to confirm specific claims without the liability of storing sensitive personal data.

---

## 2. Problem Statement

### The Current Reality

In today's digital ecosystem, identity verification follows a fundamentally flawed model. When a user needs to prove they are above 18 years of age, they must share their entire Aadhaar card containing their full name, address, date of birth, and unique identification number. When applying for a loan, they must submit complete salary slips revealing their exact income, employer details, and financial history.

This approach creates several critical problems:

**Privacy Erosion**: Users have no control over what information they share. A simple age verification request results in the exposure of complete personal profiles. Organizations accumulate vast repositories of sensitive data they never needed in the first place.

**Data Breach Vulnerability**: Every organization that collects identity documents becomes a potential target for data breaches. The 2023 UIDAI data leak and numerous corporate data breaches have demonstrated that centralized storage of identity documents creates systemic risk.

**Trust Asymmetry**: Users must trust every organization with their complete identity information, even for trivial verifications. There is no mechanism to share only what is necessary.

**Compliance Burden**: Organizations collecting identity documents face increasing regulatory requirements under data protection laws. They must implement expensive security measures to protect data they may not even need.


### Real-World Scenarios

Consider these everyday situations where the current system fails:

A 25-year-old professional wants to open a trading account. The broker requires proof of age. The user must share their Aadhaar card, exposing their complete address, photograph, and unique ID number, simply to prove they are above 18.

A job applicant needs to verify they have a bachelor's degree. The employer receives their complete marksheet showing every subject, every grade, and their roll number, when all they needed to know was whether the candidate graduated.

A tenant applying for a rental agreement must prove their income exceeds a threshold. The landlord receives complete salary slips showing exact salary, employer name, PF contributions, and tax deductions, when a simple "income above X" confirmation would suffice.

### The Cost of Inaction

The consequences of this broken model extend beyond individual privacy:

- Identity theft cases in India increased by 28% in 2024
- Organizations spend an average of 15% of their IT budget on data protection compliance
- Users report declining trust in digital services due to privacy concerns
- Regulatory penalties for data breaches have increased significantly under DPDP Act 2023

---

## 3. Solution Overview

AkshayaVault introduces a paradigm shift in identity verification through Zero-Knowledge Proofs. Instead of sharing documents, users generate cryptographic proofs that verify specific claims without revealing the underlying data.

### Core Value Proposition

**For Users**: Share only what is necessary. Prove you are above 18 without revealing your birth date. Prove your income exceeds a threshold without disclosing the exact amount. Maintain complete control over your personal information.

**For Verifiers**: Receive mathematically certain verification without the liability of storing sensitive data. Reduce compliance burden while maintaining verification integrity. Eliminate data breach risk for information you never needed to store.

### How It Works

The platform operates on a simple principle: transform document verification from data sharing to claim verification.

When a user uploads a document, the system extracts relevant data locally in their browser. This data never leaves the user's device. Instead, the extracted information feeds into a Zero-Knowledge circuit that generates a cryptographic proof. This proof mathematically demonstrates that a specific claim is true without revealing any other information.

A verifier receiving this proof can cryptographically confirm the claim's validity. They know with mathematical certainty that the user's age exceeds 18, but they learn nothing else about the user's birth date, address, or any other personal information.


---

## 4. Core Concept: Zero-Knowledge Proofs

### What Are Zero-Knowledge Proofs

Zero-Knowledge Proofs represent one of the most significant advances in cryptography. They allow one party (the prover) to convince another party (the verifier) that a statement is true, without revealing any information beyond the validity of the statement itself.

The concept was introduced by Goldwasser, Micali, and Rackoff in 1985 and has since evolved into practical implementations that power privacy-preserving systems across finance, identity, and blockchain applications.

### The Three Properties

A Zero-Knowledge Proof must satisfy three fundamental properties:

**Completeness**: If the statement is true, an honest prover can convince an honest verifier. When a user genuinely is above 18 years old, the proof system will always generate a valid proof that the verifier will accept.

**Soundness**: If the statement is false, no cheating prover can convince the verifier (except with negligible probability). A user who is 17 years old cannot generate a valid proof claiming to be above 18.

**Zero-Knowledge**: If the statement is true, the verifier learns nothing other than the fact that the statement is true. The verifier confirming "age above 18" learns absolutely nothing about the actual birth date.

### The Groth16 Proving System

AkshayaVault implements the Groth16 proving system, a zk-SNARK (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) protocol published by Jens Groth in 2016.

Groth16 offers several advantages for our use case:

**Succinctness**: Proofs are extremely small (approximately 200 bytes) regardless of the complexity of the statement being proved. This makes them practical for web applications and mobile devices.

**Non-Interactive**: The prover generates the proof independently without back-and-forth communication with the verifier. Users can generate proofs offline and share them later.

**Fast Verification**: Verifying a Groth16 proof takes only milliseconds, enabling real-time verification in web applications.

**Trusted Setup**: Groth16 requires a one-time trusted setup ceremony. AkshayaVault uses the Hermez Network's Powers of Tau ceremony, a widely trusted setup with thousands of participants.

### The BN128 Elliptic Curve

The cryptographic operations in our ZK circuits operate on the BN128 (also known as alt_bn128) elliptic curve. This curve provides 128-bit security level and is optimized for pairing-based cryptography required by Groth16.

The curve is defined over a prime field and supports efficient bilinear pairings, which are essential for the verification equation in Groth16 proofs.


---

## 5. System Architecture

### High-Level Architecture

The AkshayaVault system comprises several interconnected layers, each serving a specific purpose in the verification pipeline.

**Presentation Layer**: A Next.js 15 application with React 19 provides the user interface. The application is fully responsive and optimized for both desktop and mobile experiences. Tailwind CSS handles styling with a custom dark green theme, while Framer Motion provides smooth animations.

**Document Processing Layer**: This layer handles document upload, AI validation, and OCR extraction. Gemini 2.5 Flash validates that uploaded documents match the expected type. Tesseract.js performs optical character recognition to extract relevant data fields.

**Cryptographic Layer**: The core of the system, this layer generates and verifies Zero-Knowledge proofs. Circom circuits define the verification logic, while snarkjs handles proof generation and verification using the Groth16 protocol.

**Data Layer**: Supabase provides authentication services and PostgreSQL database storage. The database stores user profiles, generated proofs (not the source documents), and verification requests. Row-Level Security policies ensure users can only access their own data.

### Data Flow

The system processes data through a carefully designed pipeline that ensures privacy at every step:

Document images enter the system through the browser. They are immediately processed by the AI validation layer to confirm document type. Valid documents proceed to OCR extraction, which runs entirely in the browser using WebAssembly.

Extracted data feeds into the ZK circuit as private inputs. The circuit performs the verification logic and outputs a proof along with public signals. The proof is stored in the database, but the original document and extracted data are discarded.

When verification is requested, the stored proof is retrieved and verified against the circuit's verification key. The verifier receives only the verification result and public signals, never the private inputs.

### Security Boundaries

The architecture establishes clear security boundaries:

**Browser Boundary**: Document images and extracted personal data never cross this boundary. All sensitive processing occurs client-side.

**API Boundary**: Only proofs, public signals, and metadata cross to the server. The server never receives or processes raw document data.

**Database Boundary**: Stored data includes only proofs and verification metadata. Even if the database were compromised, no personal document data would be exposed.


---

## 6. ZK Circuit Implementation

### Circuit Design Philosophy

The ZK circuits in AkshayaVault are designed with three principles: simplicity, security, and efficiency. Each circuit performs a single, well-defined verification task. The circuits are written in Circom 2.1.6, a domain-specific language for defining arithmetic circuits.

### Age Verification Circuit

The age verification circuit proves that a person's age exceeds a specified threshold without revealing their actual birth year.

```circom
pragma circom 2.1.6;

template AgeVerification() {
    // Private inputs - known only to the prover
    signal input birthYear;
    
    // Public inputs - visible to the verifier
    signal input currentYear;
    signal input ageThreshold;
    
    // Output signal
    signal output isValid;
    
    // Calculate age from birth year
    signal age;
    age <== currentYear - birthYear;
    
    // Verify age meets threshold using comparison circuit
    component ageCheck = GreaterEqThan(8);
    ageCheck.in[0] <== age;
    ageCheck.in[1] <== ageThreshold;
    
    isValid <== ageCheck.out;
}

component main {public [currentYear, ageThreshold]} = AgeVerification();
```

The circuit takes the birth year as a private input. The prover knows this value, but it remains hidden from the verifier. The current year and age threshold are public inputs, visible to both parties.

The circuit computes the age by subtracting birth year from current year, then uses a comparison component to check if the age meets or exceeds the threshold. The output is a binary signal: 1 if the age requirement is met, 0 otherwise.

The verifier sees only the public inputs (current year and threshold) and the output (valid or invalid). They learn nothing about the actual birth year.

### Income Range Circuit

The income verification circuit proves that a person's income falls within a specified range without revealing the exact amount.

```circom
pragma circom 2.1.6;

template IncomeRange() {
    // Private input - actual income known only to prover
    signal input actualIncome;
    
    // Public inputs - the acceptable range
    signal input minIncome;
    signal input maxIncome;
    
    // Output
    signal output isInRange;
    
    // Check income >= minimum threshold
    component minCheck = GreaterEqThan(32);
    minCheck.in[0] <== actualIncome;
    minCheck.in[1] <== minIncome;
    
    // Check income <= maximum threshold
    component maxCheck = LessEqThan(32);
    maxCheck.in[0] <== actualIncome;
    maxCheck.in[1] <== maxIncome;
    
    // Both conditions must be satisfied
    isInRange <== minCheck.out * maxCheck.out;
}

component main {public [minIncome, maxIncome]} = IncomeRange();
```

This circuit uses 32-bit comparators to handle income values up to approximately 4 billion, sufficient for any practical salary verification. The multiplication of the two comparison outputs ensures both conditions must be true for the final output to be valid.


### Degree Verification Circuit

The education verification circuit proves that a student has passed their examinations without revealing their actual marks or grades.

```circom
pragma circom 2.1.6;

template DegreeVerification() {
    // Private inputs - actual academic performance
    signal input totalMarks;
    signal input maxMarks;
    
    // Public input - minimum passing percentage
    signal input minPassingPercentage;
    
    // Output
    signal output hasPassed;
    
    // Calculate scaled values to avoid division
    // (totalMarks * 100) >= (minPassingPercentage * maxMarks)
    signal scaledMarks;
    signal scaledThreshold;
    
    scaledMarks <== totalMarks * 100;
    scaledThreshold <== minPassingPercentage * maxMarks;
    
    // Compare scaled values
    component passCheck = GreaterEqThan(16);
    passCheck.in[0] <== scaledMarks;
    passCheck.in[1] <== scaledThreshold;
    
    hasPassed <== passCheck.out;
}

component main {public [minPassingPercentage]} = DegreeVerification();
```

The circuit avoids division operations (which are expensive in ZK circuits) by scaling both sides of the percentage comparison. This mathematical transformation preserves the comparison result while using only multiplication.

### PAN Verification Circuit

The tax compliance circuit proves that a person has filed taxes recently without revealing their income or tax details.

```circom
pragma circom 2.1.6;

template PANVerification() {
    // Private inputs - tax filing details
    signal input filingYear;
    signal input taxPaid;
    
    // Public inputs - compliance requirements
    signal input currentYear;
    signal input maxYearGap;
    
    // Output
    signal output isCompliant;
    
    // Check filing is recent (within maxYearGap years)
    signal yearDiff;
    yearDiff <== currentYear - filingYear;
    
    component recentFiling = LessEqThan(8);
    recentFiling.in[0] <== yearDiff;
    recentFiling.in[1] <== maxYearGap;
    
    // Check tax paid is non-negative (basic compliance)
    component taxPositive = GreaterEqThan(32);
    taxPositive.in[0] <== taxPaid;
    taxPositive.in[1] <== 0;
    
    // Both conditions required for compliance
    isCompliant <== recentFiling.out * taxPositive.out;
}

component main {public [currentYear, maxYearGap]} = PANVerification();
```

### Circuit Compilation and Setup

Each circuit undergoes a compilation and setup process before deployment:

**Compilation**: The Circom compiler transforms the circuit definition into an R1CS (Rank-1 Constraint System) representation. This mathematical representation defines the constraints that valid proofs must satisfy.

**Trusted Setup**: Using the Powers of Tau ceremony output, a circuit-specific proving key and verification key are generated. The proving key enables proof generation, while the verification key enables proof verification.

**WASM Generation**: A WebAssembly module is generated for efficient witness computation in the browser. This module calculates the intermediate values needed for proof generation.

The compiled artifacts (WASM file, proving key, verification key) are stored in the public directory and loaded by the browser when generating or verifying proofs.


---

## 7. Application Workflow

### User Journey: Proof Generation

The proof generation workflow guides users through a streamlined process that handles complex cryptographic operations transparently.

**Step 1: Authentication**

Users begin by creating an account or signing in. The authentication system uses Supabase Auth with email and password. New users receive a confirmation email to verify their address. Password requirements enforce security: minimum 8 characters with uppercase, lowercase, and special characters.

**Step 2: Document Selection**

Users select the type of document they wish to verify. The platform supports four document types: Aadhaar Card for age verification, Salary Slip for income verification, Marksheet for education verification, and PAN Card for tax compliance verification.

**Step 3: Document Upload**

Users upload their document as an image file. The system accepts PNG, JPG, and JPEG formats. The upload interface provides clear guidance on acceptable formats and file size limits.

**Step 4: AI Validation**

Before processing, the Gemini 2.5 Flash AI model validates that the uploaded document matches the selected type. This prevents users from accidentally uploading incorrect documents and ensures the OCR extraction will work correctly.

The AI examines the document image and confirms the presence of expected elements. For an Aadhaar card, it looks for the UIDAI logo, 12-digit number format, and standard layout. For a salary slip, it identifies earnings breakdowns, deductions, and employer information.

If the document does not match the expected type, the user receives a clear message explaining the mismatch and guidance on uploading the correct document.

**Step 5: OCR Extraction**

Valid documents proceed to OCR extraction using Tesseract.js. The OCR engine runs entirely in the browser, ensuring document images never leave the user's device.

The extraction process identifies and captures relevant data fields based on document type. For Aadhaar cards, it extracts the date of birth. For salary slips, it captures gross and net salary figures. For marksheets, it identifies percentage or CGPA values.

**Step 6: ZK Proof Generation**

Extracted data feeds into the appropriate ZK circuit as private inputs. The snarkjs library loads the circuit's WASM module and proving key, then generates a Groth16 proof.

The proof generation process involves several computationally intensive steps: witness calculation, proof computation, and proof serialization. Progress indicators keep users informed throughout this process, which typically takes 5-15 seconds depending on device capabilities.

**Step 7: Proof Storage**

The generated proof, along with public signals and metadata, is stored in the user's vault. The original document and extracted data are discarded. Proofs are assigned a 7-day expiration period, after which they become invalid.

Users can view their proofs in the vault, see expiration dates, and share proofs with verifiers.


### Verifier Journey: DigiLocker-Style Flow

The verifier workflow mirrors the familiar DigiLocker consent flow, providing organizations with a standardized process for requesting and receiving verified claims.

**Step 1: Verifier Portal Access**

Organizations access the verifier portal, which simulates various institutional verifiers: Election Commission of India, State Bank of India, HDFC Bank, and Passport Seva Kendra. In a production deployment, verifiers would authenticate with organizational credentials.

**Step 2: Create Verification Request**

Verifiers create a new verification request by specifying:
- Required proof type (age, income, education, tax compliance)
- Specific attribute to verify (e.g., "Age above 18", "Income above 50,000")
- Purpose of verification (e.g., "Account opening", "Loan application")

The system generates a unique request ID and shareable link. Requests expire after 24 hours if not fulfilled.

**Step 3: Share Request with User**

Verifiers share the request link with the user through their preferred channel (email, SMS, in-person). The link directs users to a consent page showing the verifier's identity, requested proof type, and stated purpose.

**Step 4: User Consent and Proof Selection**

Users review the verification request and decide whether to approve or reject. If approving, they select an appropriate proof from their vault. The system validates that the selected proof matches the requested type.

**Step 5: Cryptographic Verification**

Upon approval, the verifier's status page updates to show the verification result. The system performs cryptographic verification of the ZK proof using the circuit's verification key.

Verification confirms:
- The proof is mathematically valid
- The public signals match the claimed attribute
- The proof has not expired
- The proof was generated by a valid circuit

**Step 6: Verification Result**

Verifiers receive a clear result: the claim is either verified or not verified. For verified claims, they see the specific attribute confirmed (e.g., "Age above 18: VERIFIED") without any additional personal information.

The verification record is logged for audit purposes, including timestamp, verifier identity, and result. This creates an accountability trail without exposing user data.

### Direct Verification Flow

For simpler use cases, users can share proofs directly without the request-response flow. Users copy their proof ID or share link, which verifiers can use to perform instant verification on the public verification page.

This flow suits scenarios where users proactively share credentials, such as including a verification link in a job application or rental inquiry.


---

## 8. Project Structure

### Directory Organization

The project follows a modular structure that separates concerns and facilitates maintenance.

```
akshayavault/
├── circuits/                    # ZK Circuit Definitions
│   ├── ageVerification.circom   # Age threshold verification
│   ├── incomeRange.circom       # Income range verification
│   ├── degreeVerification.circom # Education verification
│   ├── panVerification.circom   # Tax compliance verification
│   ├── build.sh                 # Unix build script
│   ├── build.ps1                # Windows build script
│   └── powersOfTau28_hez_final_14.ptau  # Trusted setup file
│
├── public/
│   └── circuits/                # Compiled circuit artifacts
│       ├── ageVerification/
│       │   ├── ageVerification.wasm
│       │   ├── ageVerification_final.zkey
│       │   └── verification_key.json
│       ├── incomeRange/
│       ├── degreeVerification/
│       └── panVerification/
│
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── globals.css          # Global styles and theme
│   │   ├── login/               # Authentication pages
│   │   ├── signup/
│   │   ├── generate/            # Proof generation interface
│   │   ├── vault/               # User's proof management
│   │   ├── verify/              # Public verification page
│   │   ├── verifier/            # Verifier portal
│   │   └── request/             # Verification request handling
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Reusable UI components
│   │   ├── layout/              # Layout components (navbar)
│   │   ├── sections/            # Landing page sections
│   │   └── auth/                # Authentication components
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # Authentication state management
│   │
│   ├── lib/                     # Core utilities
│   │   ├── auth.ts              # Authentication functions
│   │   ├── supabase.ts          # Database client
│   │   ├── zk-proof.ts          # ZK proof generation/verification
│   │   ├── ocr.ts               # Document OCR processing
│   │   ├── document-validator.ts # AI document validation
│   │   └── utils.ts             # Helper utilities
│   │
│   └── types/
│       └── snarkjs.d.ts         # TypeScript declarations
│
├── .env.local                   # Environment variables
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── next.config.ts               # Next.js configuration
```


### Key Files Explained

**circuits/**: Contains the Circom source files defining the ZK verification logic. Each circuit is self-contained with inline comparator templates to avoid external dependencies. The build scripts compile circuits and generate proving/verification keys.

**public/circuits/**: Stores the compiled circuit artifacts that the browser loads at runtime. The WASM files enable efficient witness computation, the zkey files contain the proving key, and the verification_key.json files enable proof verification.

**src/app/**: Implements the Next.js 15 App Router pages. Each subdirectory represents a route in the application. The layout.tsx file wraps all pages with the authentication provider and global styles.

**src/components/ui/**: Contains reusable UI components built with Tailwind CSS. Components include buttons, cards, badges, input fields, and animated elements. The glowing-card component creates the signature glass-morphism effect.

**src/lib/zk-proof.ts**: The core ZK implementation file. It handles circuit configuration, input preparation, proof generation using snarkjs, and proof verification. The file exports functions for generating proofs from document data and verifying existing proofs.

**src/lib/ocr.ts**: Implements document OCR using Tesseract.js. It defines extraction patterns for each document type, processes uploaded images, and returns structured data suitable for ZK circuit inputs.

**src/lib/document-validator.ts**: Integrates with Google's Gemini 2.5 Flash API for AI-powered document validation. It sends document images to the API and parses responses to determine if documents match expected types.

**src/lib/supabase.ts**: Configures the Supabase client with lazy initialization to prevent build-time errors. It includes a mock client for server-side rendering and proper client initialization for browser environments.

**src/context/AuthContext.tsx**: Provides authentication state management using React Context. It handles user session persistence, login/logout state changes, and exposes authentication functions to components.

### Configuration Files

**tsconfig.json**: TypeScript configuration with strict mode enabled. Includes path aliases for clean imports and custom type roots for the snarkjs declarations.

**tailwind.config.ts**: Extends Tailwind with custom colors (dark-950, dark-900, dark-800 for the dark theme), the Poppins font family, and animation utilities.

**next.config.ts**: Next.js configuration with optimizations for production builds. Handles environment variable exposure and build-time settings.


---

## 9. Technical Implementation

### Frontend Architecture

The frontend is built with Next.js 15 using the App Router architecture. React 19 provides the component foundation with its improved rendering performance and concurrent features.

**Styling System**: Tailwind CSS provides utility-first styling with a custom configuration. The dark green theme uses #030806 as the primary background and #22c55e as the accent color. Glass-morphism effects are achieved through backdrop-blur and semi-transparent backgrounds.

**Animation**: Framer Motion handles all animations, from page transitions to micro-interactions. The landing page features a plasma orb animation in the hero section, created with CSS gradients and Framer Motion's animate prop.

**State Management**: React Context handles global state for authentication. Local component state manages form inputs and UI interactions. No external state management library is required due to the application's focused scope.

**Responsive Design**: The application is fully responsive with mobile-first breakpoints. The navbar transforms into a slide-out menu on mobile devices with auto-hide on scroll functionality.

### Backend Services

**Supabase Authentication**: Handles user registration, login, and session management. Email confirmation is required for new accounts. Password hashing uses bcrypt through Supabase's built-in auth system.

**Supabase Database**: PostgreSQL database stores user profiles, proofs, and verification requests. Row-Level Security policies ensure data isolation between users. The database schema includes three main tables: users, proofs, and verification_requests.

**Gemini AI Integration**: The document validator sends base64-encoded images to Google's Gemini 2.5 Flash API. The API analyzes images and returns structured JSON indicating document type validity and confidence scores.

### ZK Proof Implementation

**snarkjs Integration**: The snarkjs library is loaded dynamically in the browser to avoid server-side rendering issues. It provides the fullProve function for proof generation and the verify function for proof verification.

**Circuit Loading**: Circuit artifacts (WASM and zkey files) are fetched from the public directory when needed. The files are loaded as ArrayBuffers and passed to snarkjs functions.

**Proof Structure**: Generated proofs follow the Groth16 format with pi_a, pi_b, and pi_c components. Public signals accompany the proof, containing the values visible to verifiers. A proof hash is generated for identification purposes.

### OCR Processing

**Tesseract.js**: The OCR engine runs entirely in the browser using WebAssembly. It loads language data on first use and caches it for subsequent operations.

**Pattern Matching**: Document-specific regex patterns extract relevant fields from OCR text. Patterns are designed to be lenient to handle OCR imperfections while still capturing essential data.

**Fallback Handling**: If OCR fails or produces insufficient text, the system falls back to accepting the document with default values. This ensures users are not blocked by OCR limitations.


---

## 10. Security Model

### Privacy Guarantees

**Document Privacy**: Uploaded documents are processed entirely in the browser. Images are converted to base64 for AI validation, processed by OCR, and then discarded. No document images are transmitted to or stored on servers.

**Data Minimization**: Only the minimum necessary data is extracted from documents. For age verification, only the birth year is used. For income verification, only the salary figure is extracted. All other document content is ignored.

**Zero-Knowledge Property**: The ZK proofs mathematically guarantee that verifiers learn nothing beyond the verified claim. The Groth16 proving system's zero-knowledge property ensures that even with unlimited computational resources, a verifier cannot extract private inputs from a proof.

### Cryptographic Security

**Groth16 Soundness**: The soundness property of Groth16 ensures that invalid proofs cannot be generated (except with negligible probability). A user cannot create a valid proof for a false claim.

**Trusted Setup Security**: The Powers of Tau ceremony used for the trusted setup involved thousands of participants. As long as at least one participant was honest and destroyed their toxic waste, the setup is secure.

**Proof Non-Malleability**: Groth16 proofs cannot be modified without invalidating them. A proof for one claim cannot be transformed into a proof for a different claim.

### Application Security

**Authentication Security**: Passwords are hashed using bcrypt with appropriate work factors. Email confirmation prevents account enumeration. Session tokens are managed securely by Supabase.

**Database Security**: Row-Level Security policies enforce data isolation. Users can only read and write their own data. Verification requests have controlled access policies.

**API Security**: Environment variables protect API keys. The Gemini API key is exposed to the client (required for browser-side calls) but rate-limited by Google's API policies.

### Threat Model

**Malicious Verifier**: A verifier attempting to extract private information from proofs cannot succeed due to the zero-knowledge property. They receive only the verification result.

**Compromised Database**: If the database were breached, attackers would find only proofs and metadata. No personal documents or extracted data are stored.

**Man-in-the-Middle**: HTTPS encryption protects all communications. Proof verification is deterministic, so intercepted proofs cannot be modified.

**Malicious User**: Users cannot generate valid proofs for false claims due to the soundness property. The AI validation prevents document type manipulation.


---

## 11. Differentiation from Existing Systems

### Comparison with DigiLocker

DigiLocker, India's official document storage platform, provides convenient access to government-issued documents. However, it operates on a fundamentally different model.

**DigiLocker Approach**: Users share complete documents with verifiers. When a bank requests Aadhaar verification through DigiLocker, they receive the entire Aadhaar card with all personal information.

**AkshayaVault Approach**: Users share only verified claims. When a bank needs age verification, they receive a cryptographic proof that the user is above 18, with no access to the actual birth date, address, or Aadhaar number.

**Key Difference**: DigiLocker digitizes document sharing. AkshayaVault eliminates the need to share documents entirely.

### Comparison with Traditional KYC

Traditional Know Your Customer processes require users to submit identity documents that organizations store and process.

**Traditional KYC**: Documents are uploaded to organization servers, processed by staff or automated systems, and stored for compliance. This creates data silos across every organization a user interacts with.

**AkshayaVault KYC**: Documents never leave the user's device. Organizations receive only the verification they need. No document storage means no data breach risk for that data.

**Key Difference**: Traditional KYC accumulates risk. AkshayaVault eliminates it.

### Comparison with Blockchain Identity Solutions

Several blockchain-based identity solutions exist, including uPort, Civic, and SelfKey. These typically store identity attestations on-chain.

**Blockchain Identity**: Attestations are stored on public blockchains, creating permanent records. While pseudonymous, these records can potentially be linked to real identities through transaction analysis.

**AkshayaVault**: Proofs are generated on-demand and stored temporarily. No blockchain is required, eliminating gas fees and scalability concerns. Proofs expire, leaving no permanent record.

**Key Difference**: Blockchain solutions create permanent records. AkshayaVault creates ephemeral proofs.

### Comparison with Anon Aadhaar

Anon Aadhaar is a ZK-based solution specifically for Aadhaar verification using the QR code data.

**Anon Aadhaar**: Requires scanning the Aadhaar QR code, which contains digitally signed data. Limited to Aadhaar cards with valid QR codes.

**AkshayaVault**: Works with document images, supporting multiple document types. Does not require QR codes or digital signatures on source documents.

**Key Difference**: Anon Aadhaar is Aadhaar-specific with QR dependency. AkshayaVault is document-agnostic with image-based processing.

### Unique Value Proposition

AkshayaVault combines several innovations that together create a unique solution:

1. **Multi-Document Support**: Single platform for various document types
2. **AI-Powered Validation**: Prevents incorrect document uploads
3. **Browser-Based Processing**: Maximum privacy through local computation
4. **DigiLocker-Style UX**: Familiar consent flow for users and verifiers
5. **No Blockchain Dependency**: Simpler deployment and lower costs
6. **Temporary Proofs**: No permanent records, enhanced privacy


---

## 12. Future Roadmap

### Phase 1: SDK Development

The immediate roadmap focuses on transforming AkshayaVault from a standalone application into an embeddable SDK that organizations can integrate into their existing systems.

**SDK Architecture**: A JavaScript/TypeScript package that handles ZK proof generation and verification. Organizations install the package, configure their API credentials, and integrate verification flows into their applications.

**Integration Patterns**: Support for multiple integration approaches including redirect flow (similar to OAuth), embedded widget, and API-only mode for backend integrations.

**Developer Experience**: Comprehensive documentation, code examples, and a sandbox environment for testing integrations before production deployment.

### Phase 2: Extended Document Support

Expanding the range of supported documents to cover more verification scenarios.

**Additional Documents**: Driving license for address verification, passport for citizenship verification, voter ID for electoral verification, and professional certificates for qualification verification.

**Custom Circuits**: A framework for organizations to define custom verification circuits for their specific needs. This enables domain-specific verifications beyond the standard set.

**International Documents**: Support for documents from other countries, enabling cross-border verification scenarios.

### Phase 3: Enterprise Features

Features designed for large-scale organizational deployment.

**Audit Logging**: Comprehensive logging of all verification activities for compliance and audit purposes. Logs capture verification requests, approvals, and results without storing personal data.

**Analytics Dashboard**: Insights into verification patterns, success rates, and usage metrics. Helps organizations optimize their verification flows.

**Role-Based Access**: Granular permissions for different organizational roles. Administrators can manage verifier accounts and access policies.

**SLA Guarantees**: Service level agreements for enterprise customers with guaranteed uptime and support response times.

### Phase 4: Advanced Cryptography

Incorporating advances in ZK proof technology.

**Recursive Proofs**: Combining multiple proofs into a single proof, enabling complex verification scenarios with a single verification step.

**PLONK Migration**: Evaluating migration to PLONK proving system for universal trusted setup, eliminating circuit-specific setup ceremonies.

**Hardware Acceleration**: Leveraging GPU and specialized hardware for faster proof generation, improving user experience on capable devices.

### Vision Statement

AkshayaVault aims to become the standard infrastructure for privacy-preserving identity verification in India and beyond. By making Zero-Knowledge Proofs accessible and practical, we envision a future where individuals maintain complete control over their personal information while still participating fully in the digital economy.

The platform represents a fundamental shift from "share everything to prove anything" to "prove exactly what is needed, nothing more." This shift protects individual privacy, reduces organizational liability, and creates a more trustworthy digital ecosystem for everyone.

---

## Appendix: Technology References

- Circom Documentation: https://docs.circom.io/
- snarkjs Repository: https://github.com/iden3/snarkjs
- Groth16 Paper: https://eprint.iacr.org/2016/260
- RareSkills ZK Book: https://rareskills.io/zk-book
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Tesseract.js: https://tesseract.projectnaptha.com/

---

Document prepared for GFG ByteQuest Hackathon 2025

Team zeroblink: Sanath R and Neha Honniganur
