const countingOccurences = (input: string[], query: string[]): number[] => {
    return query.map(q => input.filter(word => word === q).length);
}

// Contoh penggunaan
const INPUT = ['xc', 'dz', 'bbb', 'dz']  
const QUERY = ['bbb', 'ac', 'dz']  

const occurrences = countingOccurences(INPUT, QUERY);
console.log(occurrences); // Output: [3, 2, 0]