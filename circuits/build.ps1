# ZK Circuit Build Script for Windows
# Prerequisites: circom, snarkjs (npm install -g snarkjs)

param(
    [Parameter(Mandatory=$true)]
    [string]$CircuitName
)

$PTAU_FILE = "powersOfTau28_hez_final_14.ptau"

Write-Host "Building circuit: $CircuitName" -ForegroundColor Green

# Create output directory
New-Item -ItemType Directory -Force -Path "build/$CircuitName" | Out-Null

# Download Powers of Tau if not exists
if (-not (Test-Path $PTAU_FILE)) {
    Write-Host "Downloading Powers of Tau (this may take a while)..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_14.ptau" -OutFile $PTAU_FILE
}

# Compile the circuit
Write-Host "Compiling circuit..." -ForegroundColor Cyan
circom "$CircuitName.circom" --r1cs --wasm --sym -o "build/$CircuitName"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Circuit compilation failed!" -ForegroundColor Red
    exit 1
}

# Generate zkey (trusted setup)
Write-Host "Generating zkey (trusted setup)..." -ForegroundColor Cyan
snarkjs groth16 setup "build/$CircuitName/$CircuitName.r1cs" $PTAU_FILE "build/$CircuitName/${CircuitName}_0000.zkey"

# Contribute to ceremony
Write-Host "Contributing to ceremony..." -ForegroundColor Cyan
snarkjs zkey contribute "build/$CircuitName/${CircuitName}_0000.zkey" "build/$CircuitName/${CircuitName}_final.zkey" --name="AkshayaVault" -v -e="random entropy for akshayavault"

# Export verification key
Write-Host "Exporting verification key..." -ForegroundColor Cyan
snarkjs zkey export verificationkey "build/$CircuitName/${CircuitName}_final.zkey" "build/$CircuitName/verification_key.json"

# Copy files to public folder for browser use
Write-Host "Copying files for browser..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "../public/circuits/$CircuitName" | Out-Null
Copy-Item "build/$CircuitName/${CircuitName}_js/${CircuitName}.wasm" "../public/circuits/$CircuitName/"
Copy-Item "build/$CircuitName/${CircuitName}_final.zkey" "../public/circuits/$CircuitName/"
Copy-Item "build/$CircuitName/verification_key.json" "../public/circuits/$CircuitName/"

Write-Host "`nBuild complete for $CircuitName!" -ForegroundColor Green
Write-Host "Files available in: public/circuits/$CircuitName/" -ForegroundColor Green
