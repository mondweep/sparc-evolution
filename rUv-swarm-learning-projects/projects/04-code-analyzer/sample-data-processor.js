
// data-processor.js - Data processing with performance issues
class DataProcessor {
    constructor() {
        this.cache = new Map();
    }

    // PERFORMANCE ISSUE: O(n²) algorithm
    findDuplicates(arr) {
        const duplicates = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    duplicates.push(arr[i]);
                }
            }
        }
        return duplicates;
    }

    // PERFORMANCE ISSUE: Synchronous file operations in loop
    processFiles(filePaths) {
        const results = [];
        filePaths.forEach(filePath => {
            const content = fs.readFileSync(filePath, 'utf8'); // Blocking I/O
            results.push(this.processContent(content));
        });
        return results;
    }

    // PERFORMANCE ISSUE: No caching, expensive computation repeated
    calculateExpensiveValue(input) {
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += Math.sqrt(input * i);
        }
        return result;
    }

    // PERFORMANCE ISSUE: Memory leak potential
    storeInCache(key, value) {
        this.cache.set(key, value); // Never cleared
    }
}

module.exports = DataProcessor;
