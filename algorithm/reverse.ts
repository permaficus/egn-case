const reverseAlphabets = (input: string): string => {
    const alphabets = input.replace(/[0-9]/g, '');
    const numbers = input.replace(/[^0-9]/g, '');
    const reversedAlphabets = alphabets.split('').reverse().join('');

    return reversedAlphabets + numbers;
}

console.log(reverseAlphabets('NEGIE1')); // Output: "EIGEN1"
console.log(reverseAlphabets('golif641')) // Outpu: ???