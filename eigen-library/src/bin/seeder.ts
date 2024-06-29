import { Authors, Members, Books } from '@/model';
import chalk from 'chalk';

const mockAuthor = [
    { name: "J.K Rowling" },
    { name: "J.R.R. Tolkien" },
    { name: "Arthur Conan Doyle" },
    { name: "Stephenie Meyer" },
    { name: "C.S. Lewis" }
]

const mockBooks = [
    {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 1
    },
    {
        code: "SHR-1",
        title: "A Study in Scarlet",
        author: "Arthur Conan Doyle",
        stock: 1
    },
    {
        code: "TW-11",
        title: "Twilight",
        author: "Stephenie Meyer",
        stock: 1
    },
    {
        code: "HOB-83",
        title: "The Hobbit, or There and Back Again",
        author: "J.R.R. Tolkien",
        stock: 1
    },
    {
        code: "NRN-7",
        title: "The Lion, the Witch and the Wardrobe",
        author: "C.S. Lewis",
        stock: 1
    },
]

const mockMembers = [
    {
        code: "M001",
        name: "Angga",
    },
    {
        code: "M002",
        name: "Ferry",
    },
    {
        code: "M003",
        name: "Putri",
    },
]

async function addingAuthors (): Promise<void> {
    console.info(chalk.green(`Preparing Author Mock Data...`));
    mockAuthor.map(async items => {
        await Authors.add(items);
        console.info(chalk.yellow(`Adding ${items.name} ... ${chalk.green(`done!`)}`))
    })
}
async function addingBooks (): Promise<void> {
    console.info(chalk.green(`\nPreparing Books Mock Data...`));
    mockBooks.map(async items => {
        await Books.add(items)
        console.info(chalk.yellow(`Adding ${items.title} ... ${chalk.green(`done!`)}`))
    })
}
async function addingMember (): Promise<void> {
    console.info(chalk.green(`\nPreparing Member Mock Data...`));
    mockMembers.map(async items => {
        await Members.add(items);
        console.info(chalk.yellow(`Adding ${items.name} ... ${chalk.green(`done!`)}`))
    })
}

(() => {
    setTimeout(() => {
        addingAuthors();
    }, 1500);
    setTimeout(() => {
        addingBooks();
    }, 3000)
    setTimeout(() => {
        addingMember();
    }, 4500)
})();
