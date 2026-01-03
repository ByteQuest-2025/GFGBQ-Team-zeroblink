pragma circom 2.1.6;

// Simple comparator templates (inline to avoid circomlib dependency)
template LessThan(n) {
    signal input in[2];
    signal output out;
    
    component n2b = Num2Bits(n+1);
    n2b.in <== in[0] + (1<<n) - in[1];
    out <== 1 - n2b.out[n];
}

template GreaterEqThan(n) {
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n);
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    out <== lt.out;
}

template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1 = 0;
    var e2 = 1;
    for (var i = 0; i < n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] - 1) === 0;
        lc1 += out[i] * e2;
        e2 = e2 + e2;
    }
    lc1 === in;
}

// Age Verification Circuit
// Proves that a person's age is >= threshold without revealing actual birth year
template AgeVerification() {
    // Private inputs
    signal input birthYear;
    
    // Public inputs
    signal input currentYear;
    signal input ageThreshold;
    
    // Output
    signal output isValid;
    
    // Calculate age
    signal age;
    age <== currentYear - birthYear;
    
    // Check if age >= threshold
    component ageCheck = GreaterEqThan(8);
    ageCheck.in[0] <== age;
    ageCheck.in[1] <== ageThreshold;
    
    isValid <== ageCheck.out;
}

component main {public [currentYear, ageThreshold]} = AgeVerification();
