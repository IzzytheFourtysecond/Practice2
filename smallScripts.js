/* Function declarations... */

// This funciton is to streamline testing a lot of "equivalent" functions.
let testFunctions;

// These functions find the index of the largest number in the array.
const indexOfMax = [];



(function() {
"use strict";

testFunctions = function(function_List, 
                            input, 
                            ExpectedOutcome = function_List[0](input)) {            
    console.log(`Input: ${input}`);
    console.log(`Expected Outcome: ${ExpectedOutcome}`);
    if (function_List.every(func => func(input) === ExpectedOutcome))
        console.log("All functions are working correctly...");
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//This implementation uses the most obvious approach
indexOfMax.push(function(arr) {
    let largestNumber = -Infinity;
    let indexOfLargest = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > largestNumber) {
            largestNumber = arr[i];
            indexOfLargest = i;
        }
    }

    return indexOfLargest;
})

//This implementation uses reduce...
indexOfMax.push(function(arr) {
    return arr.reduce((largestIndex, num, i) => (
        num > arr[largestIndex] ? i : largestIndex
    ), 0);
})
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


})();



// tests
const testNums = [12, 13, -1, 3.59, 14.1, -2, 4]; //highestIndex = 4
testFunctions(indexOfMax, testNums);