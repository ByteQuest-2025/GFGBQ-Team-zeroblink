#!/bin/bash

# ZK Circuit Build Script
# Prerequisites: circom, snarkjs, node.js

set -e

CIRCUIT_NAME=$1
PTAU_FILE="powersOfTau28_hez_final_14.ptau"

if [ -z "$CIRCUIT_NAME" ]; then
    echo "Usage: ./build.sh <circuit_name>"
    echo "Available circuits: ageVerification, incomeRange, degreeVerification, panVerification"
    exit 1
fi

echo "Building circuit: $CIRCUIT_NAME"

# Create output directory
mkdir -p build/$CIRCUIT_NAME

# Download Powers of Tau if not exists
if [ ! -f "$PTAU_FILE" ]; then
    echo "Downloading Powers of Tau..."
    curl -L -o $PTAU_FILE https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_14.ptau
fi

# Compile the circuit
echo "Compiling circuit..."
circom $CIRCUIT_NAME.circom --r1cs --wasm --sym -o build/$CIRCUIT_NAME

# Generate zkey (trusted setup)
echo "Generating zkey..."
snarkjs groth16 setup build/$CIRCUIT_NAME/$CIRCUIT_NAME.r1cs $PTAU_FILE build/$CIRCUIT_NAME/${CIRCUIT_NAME}_0000.zkey

# Contribute to ceremony (for production, use multiple contributors)
echo "Contributing to ceremony..."
snarkjs zkey contribute build/$CIRCUIT_NAME/${CIRCUIT_NAME}_0000.zkey build/$CIRCUIT_NAME/${CIRCUIT_NAME}_final.zkey --name="AkshayaVault" -v -e="random entropy"

# Export verification key
echo "Exporting verification key..."
snarkjs zkey export verificationkey build/$CIRCUIT_NAME/${CIRCUIT_NAME}_final.zkey build/$CIRCUIT_NAME/verification_key.json

# Copy WASM to public folder for browser use
echo "Copying files for browser..."
mkdir -p ../public/circuits/$CIRCUIT_NAME
cp build/$CIRCUIT_NAME/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm ../public/circuits/$CIRCUIT_NAME/
cp build/$CIRCUIT_NAME/${CIRCUIT_NAME}_final.zkey ../public/circuits/$CIRCUIT_NAME/
cp build/$CIRCUIT_NAME/verification_key.json ../public/circuits/$CIRCUIT_NAME/

echo "Build complete for $CIRCUIT_NAME!"
echo "Files available in: public/circuits/$CIRCUIT_NAME/"
