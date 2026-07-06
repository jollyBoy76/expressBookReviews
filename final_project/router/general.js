const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Please provide both username and password."
        });
    }

    if (users.find(user => user.name === username)) {
        return res.status(400).json({
            message: "User already exists!"
        });
    }

    users.push({
        name: username,
        pass: password
    });

    return res.status(201).json({
        message: "New user registered!"
    });
});

function getBooks() {
    return new Promise((resolve) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
    let books = await getBooks();
    return res.json(books);
});


function getBooksDetails(isbn) {
    return new Promise((resolve) => {
        resolve(books[isbn]);
    });
}


// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;

    const book = await getBooksDetails(isbn);

    if (book) {
        return res.json(book);
    }

    return res.status(404).json({
        message: "Book not found!"
    });
});

// Get book details based on author
public_users.get("/author/:author", (req, res) => {
    const author = req.params.author;

    const authorBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (authorBooks.length > 0) {
        return res.json(authorBooks);
    }

    return res.status(404).json({
        message: "No books found for this author!"
    });
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
    const title = req.params.title;

    const book = Object.values(books).find(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (book) {
        return res.json(book);
    }

    return res.status(404).json({
        message: "No books found for this title!"
    });
});

//  Get book review
public_users.get("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.json(book.reviews);
    }

    return res.status(404).json({
        message: "Book not found!"
    });
});

module.exports.general = public_users;
