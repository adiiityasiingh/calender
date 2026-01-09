# Date Dictionary Transformation Solution

## Problem Description

Transform a dictionary where keys are dates (format: YYYY-MM-DD) and values are integers into a dictionary where:
1. Keys are day names (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
2. Values are the sum of all integer values for dates falling on that day
3. Missing days are filled using linear interpolation between previous and next days

## Solution Approach

### Algorithm Steps

1. **Parse Input Dictionary**
   - Convert each date string to its corresponding day of the week
   - Sum values for dates that fall on the same day of the week

2. **Linear Interpolation for Missing Days**
   - Identify gaps (consecutive missing days)
   - For each gap between two filled days, interpolate linearly
   - Formula: `value = startValue + (endValue - startValue) / (gapSize + 1) * position`

### Time Complexity
- **O(n + k)** where:
  - n = number of entries in input dictionary
  - k = constant (7 days in a week)
  
### Space Complexity
- **O(1)** - Fixed size dictionary for 7 days

## Key Design Decisions

### 1. Linear Interpolation
When there are consecutive missing days, we interpolate linearly between the nearest filled days on either side. This ensures smooth transitions and handles edge cases like:
- Single missing day: average of neighbors
- Multiple consecutive missing days: evenly distributed values
- Gaps wrapping around week boundaries

### 2. Handling Multiple Dates on Same Day
If multiple dates in the input fall on the same day of the week, their values are summed together.

### 3. Circular Week Structure
The week is treated as circular, so Sunday connects to Monday. This handles gaps that wrap around the week boundary.

## Example Walkthrough

### Input:
```javascript
{
  '2020-01-01': 6,   // Wed
  '2020-01-04': 12,  // Sat
  '2020-01-05': 14,  // Sun
  '2020-01-06': 2,   // Mon
  '2020-01-07': 4    // Tue
}
```

### Missing Days: Thu & Fri

### Interpolation Process:
- Wed = 6, Sat = 12
- Gap size = 2 (Thu, Fri)
- Step = (12 - 6) / 3 = 2
- Thu = 6 + 2*1 = 8
- Fri = 6 + 2*2 = 10

### Output:
```javascript
{
  'Mon': 2,
  'Tue': 4,
  'Wed': 6,
  'Thu': 8,   // interpolated
  'Fri': 10,  // interpolated
  'Sat': 12,
  'Sun': 14
}
```

## Running the Tests

```bash
node solution.js
```

The solution includes comprehensive unit tests covering:
- Basic functionality
- Missing consecutive days
- Multiple dates on same day
- Large gaps
- Negative values
- All days present

## Assumptions

As per problem statement:
- Input dictionary has at least Mon & Sun
- Date keys are in range [1970-01-01..2100-01-01]
- Values are integers in range [-1,000,000..1,000,000]

## Notes

- The solution does not use any external libraries
- The `Date` object's `getDay()` method is used for day-of-week conversion
- All test cases pass successfully
- The code follows clean code principles with clear comments
