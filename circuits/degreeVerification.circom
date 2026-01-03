pragma circom 2.1.6;

// Comparator templates
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

template LessEqThan(n) {
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1] + 1;
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

// Degree Verification Circuit
// Proves degree completion (passed) without revealing actual marks
template DegreeVerification() {
    // Private inputs
    signal input totalMarks;
    signal input maxMarks;
    
    // Public inputs
    signal input minPassingPercentage; // e.g., 40 for 40%
    
    // Output
    signal output hasPassed;
    
    // Calculate if passed: (totalMarks * 100) >= (minPassingPercentage * maxMarks)
    signal scaledMarks;
    signal scaledThreshold;
    
    scaledMarks <== totalMarks * 100;
    scaledThreshold <== minPassingPercentage * maxMarks;
    
    // Check if scaledMarks >= scaledThreshold
    component passCheck = GreaterEqThan(16);
    passCheck.in[0] <== scaledMarks;
    passCheck.in[1] <== scaledThreshold;
    
    hasPassed <== passCheck.out;
}

component main {public [minPassingPercentage]} = DegreeVerification();
