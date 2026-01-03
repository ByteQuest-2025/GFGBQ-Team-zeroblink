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

// Income Range Verification Circuit
// Proves income is within a range without revealing exact amount
template IncomeRange() {
    // Private inputs
    signal input actualIncome;
    
    // Public inputs
    signal input minIncome;
    signal input maxIncome;
    
    // Output
    signal output isInRange;
    
    // Check income >= minIncome
    component minCheck = GreaterEqThan(32);
    minCheck.in[0] <== actualIncome;
    minCheck.in[1] <== minIncome;
    
    // Check income <= maxIncome
    component maxCheck = LessEqThan(32);
    maxCheck.in[0] <== actualIncome;
    maxCheck.in[1] <== maxIncome;
    
    // Both conditions must be true
    isInRange <== minCheck.out * maxCheck.out;
}

component main {public [minIncome, maxIncome]} = IncomeRange();
