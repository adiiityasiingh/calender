function solution(D) {
    // Helper function to get day name from date string
    const getDayName = (dateString) => {
        const date = new Date(dateString);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    // Initialize result dictionary with null values for all days
    const result = {
        'Mon': null,
        'Tue': null,
        'Wed': null,
        'Thu': null,
        'Fri': null,
        'Sat': null,
        'Sun': null
    };

    // Process input dictionary - sum values for dates that fall on the same day
    for (const [dateStr, value] of Object.entries(D)) {
        const dayName = getDayName(dateStr);
        if (result[dayName] === null) {
            result[dayName] = value;
        } else {
            result[dayName] += value;
        }
    }

    // Fill missing days using linear interpolation
    // For consecutive missing days, we interpolate between the nearest filled days
    const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Iterate through all days to find gaps and fill them
    for (let start = 0; start < 7; start++) {
        if (result[daysOrder[start]] !== null) {
            // Find the next filled day after current position
            let end = (start + 1) % 7;
            let gapSize = 0;
            
            // Count consecutive missing days
            while (result[daysOrder[end]] === null && gapSize < 6) {
                end = (end + 1) % 7;
                gapSize++;
            }
            
            // If we found a gap between two filled days, interpolate linearly
            if (gapSize > 0 && result[daysOrder[end]] !== null) {
                const startValue = result[daysOrder[start]];
                const endValue = result[daysOrder[end]];
                
                // Calculate the step size for linear interpolation
                const step = (endValue - startValue) / (gapSize + 1);
                
                // Fill each missing day in the gap
                let current = (start + 1) % 7;
                for (let i = 1; i <= gapSize; i++) {
                    result[daysOrder[current]] = startValue + (step * i);
                    current = (current + 1) % 7;
                }
            }
        }
    }

    return result;
}

// Unit Tests
function runTests() {
    console.log("=".repeat(70));
    console.log("RUNNING UNIT TESTS");
    console.log("=".repeat(70));
    console.log();

    let passCount = 0;
    let totalTests = 0;

    // Test 1: Basic example from problem statement
    totalTests++;
    console.log(`Test ${totalTests}: Basic example from problem statement`);
    console.log("-".repeat(70));
    const input1 = {
        '2020-01-01': 4,   // Wed
        '2020-01-02': 4,   // Thu
        '2020-01-03': 6,   // Fri
        '2020-01-04': 8,   // Sat
        '2020-01-05': 2,   // Sun
        '2020-01-06': -6,  // Mon
        '2020-01-07': 2,   // Tue
        '2020-01-08': -2   // Wed (adds to first Wed)
    };
    const expected1 = {
        'Mon': -6,
        'Tue': 2,
        'Wed': 2,   // 4 + (-2) = 2
        'Thu': 4,
        'Fri': 6,
        'Sat': 8,
        'Sun': 2
    };
    const result1 = solution(input1);
    const pass1 = JSON.stringify(result1) === JSON.stringify(expected1);
    if (pass1) passCount++;
    
    console.log("Expected:", expected1);
    console.log("Got:     ", result1);
    console.log("Status:  ", pass1 ? "✓ PASS" : "✗ FAIL");
    console.log();

    // Test 2: Missing consecutive days
    totalTests++;
    console.log(`Test ${totalTests}: Missing consecutive days (Thu & Fri)`);
    console.log("-".repeat(70));
    const input2 = {
        '2020-01-01': 6,   // Wed
        '2020-01-04': 12,  // Sat
        '2020-01-05': 14,  // Sun
        '2020-01-06': 2,   // Mon
        '2020-01-07': 4    // Tue
    };
    const expected2 = {
        'Mon': 2,
        'Tue': 4,
        'Wed': 6,
        'Thu': 8,   // Interpolated: (6 + 10) / 2 = 8
        'Fri': 10,  // Interpolated: (8 + 12) / 2 = 10
        'Sat': 12,
        'Sun': 14
    };
    const result2 = solution(input2);
    const pass2 = JSON.stringify(result2) === JSON.stringify(expected2);
    if (pass2) passCount++;
    
    console.log("Expected:", expected2);
    console.log("Got:     ", result2);
    console.log("Status:  ", pass2 ? "✓ PASS" : "✗ FAIL");
    console.log();

    // Test 3: Multiple dates on same day
    totalTests++;
    console.log(`Test ${totalTests}: Multiple dates falling on same day of week`);
    console.log("-".repeat(70));
    const input3 = {
        '2020-01-06': 5,   // Mon
        '2020-01-13': 10,  // Mon (different week)
        '2020-01-07': 3,   // Tue
        '2020-01-14': 7    // Tue (different week)
    };
    const result3 = solution(input3);
    const pass3 = result3['Mon'] === 15 && result3['Tue'] === 10;
    if (pass3) passCount++;
    
    console.log("Input dates: 2 Mondays and 2 Tuesdays");
    console.log("Expected: Mon=15 (5+10), Tue=10 (3+7)");
    console.log("Got:      Mon=" + result3['Mon'] + ", Tue=" + result3['Tue']);
    console.log("Status:  ", pass3 ? "✓ PASS" : "✗ FAIL");
    console.log();

    // Test 4: Large gap (Mon to Sun)
    totalTests++;
    console.log(`Test ${totalTests}: Large gap with linear interpolation`);
    console.log("-".repeat(70));
    const input4 = {
        '2020-01-06': 10,  // Mon
        '2020-01-12': 20   // Sun
    };
    const result4 = solution(input4);
    // Should interpolate linearly from 10 to 20 over 6 steps
    const pass4 = Math.abs(result4['Thu'] - 15) < 0.01; // Middle value should be 15
    if (pass4) passCount++;
    
    console.log("Mon=10, Sun=20, all others should be interpolated");
    console.log("Got:", result4);
    console.log("Thursday (middle) should be ~15:", result4['Thu']);
    console.log("Status:  ", pass4 ? "✓ PASS" : "✗ FAIL");
    console.log();

    // Test 5: Negative values
    totalTests++;
    console.log(`Test ${totalTests}: Handling negative values`);
    console.log("-".repeat(70));
    const input5 = {
        '2020-01-06': -100,  // Mon
        '2020-01-07': 50,    // Tue
        '2020-01-08': -50,   // Wed
        '2020-01-12': 100    // Sun
    };
    const result5 = solution(input5);
    const pass5 = result5['Mon'] === -100 && result5['Tue'] === 50 && result5['Wed'] === -50;
    if (pass5) passCount++;
    
    console.log("Got:", result5);
    console.log("Status:  ", pass5 ? "✓ PASS" : "✗ FAIL");
    console.log();

    // Test 6: All days present
    totalTests++;
    console.log(`Test ${totalTests}: All days present (no interpolation needed)`);
    console.log("-".repeat(70));
    const input6 = {
        '2020-01-06': 1,  // Mon
        '2020-01-07': 2,  // Tue
        '2020-01-08': 3,  // Wed
        '2020-01-09': 4,  // Thu
        '2020-01-10': 5,  // Fri
        '2020-01-11': 6,  // Sat
        '2020-01-12': 7   // Sun
    };
    const result6 = solution(input6);
    const pass6 = result6['Mon'] === 1 && result6['Sun'] === 7;
    if (pass6) passCount++;
    
    console.log("Got:", result6);
    console.log("Status:  ", pass6 ? "✓ PASS" : "✗ FAIL");
    console.log();

    // Summary
    console.log("=".repeat(70));
    console.log(`TEST SUMMARY: ${passCount}/${totalTests} tests passed`);
    console.log("=".repeat(70));
    
    if (passCount === totalTests) {
        console.log("✓ All tests passed!");
    } else {
        console.log("✗ Some tests failed. Please review the output above.");
    }
}

// Run tests
runTests();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = solution;
}