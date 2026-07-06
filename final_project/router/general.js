const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

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
        message: "New User registered!"
    });
});

// Task 10
public_users.get("/", async (req, res) => {
    try {
        const response = await axios.get("http://127.0.0.1:5000/");
        return res.json(response.data);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// Task 11
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/isbn/${req.params.isbn}`
        );

        return res.json(response.data);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// Task 12
public_users.get("/author/:author", async (req, res) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/author/${encodeURIComponent(req.params.author)}`
        );

        return res.json(response.data);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// Task 13
public_users.get("/title/:title", async (req, res) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/title/${encodeURIComponent(req.params.title)}`
        );

        return res.json(response.data);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// Book reviews
public_users.get("/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];

    if (book) {
        return res.json(book.reviews);
    }

    return res.status(404).json({
        message: "Book not found!"
    });
});

module.exports.general = public_users;
