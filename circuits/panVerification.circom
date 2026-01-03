pragma circom 2.1.6;

// Comparator templates
template LessThan(n) {
    signal input in[2];
    signal output out;
    
    component n2b = Num2Bits(n+1);
    n2b.in <== in[0] + (1<<n) - in[1];
    out <== 1 - n2b.out[n];
}

template LessEqThan(n) {
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n);
    lt.in[0] <== in[0];
    lt.in[1] <== in[1] + 1;
    out <== lt.out;
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

// PAN Verification Circuit
// Proves tax filing is recent without revealing income details
template PANVerification() {
    // Private inputs
    signal input filingYear;
    signal input taxPaid;
    
    // Public inputs
    signal input currentYear;
    signal input maxYearGap; // e.g., 2 for within last 2 years
    
    // Output
    signal output isCompliant;
    
    // Check filing year is recent
    signal yearDiff;
    yearDiff <== currentYear - filingYear;
    
    component recentFiling = LessEqThan(8);
    recentFiling.in[0] <== yearDiff;
    recentFiling.in[1] <== maxYearGap;
    
    // Check tax paid is non-negative (basic compliance)
    component taxPositive = GreaterEqThan(32);
    taxPositive.in[0] <== taxPaid;
    taxPositive.in[1] <== 0;
    
    isCompliant <== recentFiling.out * taxPositive.out;
}

component main {public [currentYear, maxYearGap]} = PANVerification();
