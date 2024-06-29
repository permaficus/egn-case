const searchTheLongest = (sentence: string): string => {
    const words = sentence.split(' ');
    let longestWord = '';

    for (const word of words) {
        if (word.length > longestWord.length) {
            longestWord = word;
        }
    }

    return longestWord;
}

console.log(searchTheLongest('Saya sangat senang mengerjakan soal algoritma'))