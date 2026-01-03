# ZK Circuits for AkshayaVault

## Prerequisites

1. Install Circom:
```bash
# Using cargo (Rust)
cargo install circom

# Or download from https://docs.circom.io/getting-started/installation/
```

2. Install snarkjs:
```bash
npm install -g snarkjs
```

3. Install circomlib (in circuits folder):
```bash
cd circuits
npm init -y
npm install circomlib
```

## Circuits

### 1. Age Verification (`ageVerification.circom`)
Proves age >= threshold without revealing date of birth.
- Private: birthYear, birthMonth, birthDay, aadhaarNumber
- Public: currentDate, ageThreshold, aadhaarCommitment

### 2. Income Range (`incomeRange.circom`)
Proves income is within a range without revealing exact amount.
- Private: actualIncome, panNumber, employerId
- Public: minIncome, maxIncome, incomeCommitment

### 3. Degree Verification (`degreeVerification.circom`)
Proves degree completion without revealing grades.
- Private: rollNumber, totalMarks, maxMarks, graduationYear
- Public: institutionId, degreeType, minPassingPercentage, credentialCommitment

### 4. PAN Verification (`panVerification.circom`)
Proves tax compliance without revealing income details.
- Private: panNumber, taxableIncome, taxPaid, filingYear
- Public: currentYear, panCommitment

## Building Circuits

```bash
cd circuits

# Build a specific circuit
./build.sh ageVerification

# Or build all
./build.sh ageVerification
./build.sh incomeRange
./build.sh degreeVerification
./build.sh panVerification
```

## Output Files

After building, each circuit produces:
- `*.wasm` - Circuit compiled to WebAssembly
- `*_final.zkey` - Proving key
- `verification_key.json` - Verification key

These are copied to `public/circuits/<circuit_name>/` for browser use.

## Security Notes

- The trusted setup uses a single contributor for demo purposes
- For production, use a multi-party computation ceremony
- Never expose private inputs in logs or error messages
