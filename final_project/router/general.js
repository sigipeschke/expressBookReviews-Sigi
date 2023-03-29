const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Both username and password are required"});
  }
  if (!isValid(username)) {
    return res.status(400).json({message: "Username is already taken"});
  }

  users.push({"username":username, "password":password});
  return res.status(200).json({message: "User successfully registered. You may login"});
});

// Function to get all books
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 100);
  });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getAllBooks()
    .then((books) => {
      res.status(200).send(books);
    })
    .catch((err) => {
      res.status(404).json({message: err});
    });
});


// Function to serach books by ISBN
const searchByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    }, 100);
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  searchByISBN(isbn)
    .then((book) => {
      res.status(200).send(book);
    })
    .catch((err) => {
      res.status(404).json({message: err});
    });
 });


// Function to search books by Author
const searchByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchedBooks = Object.values(books).filter((book) => book.author === author);
      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found by this author");
      }
    }, 100);
  });
}
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  searchByAuthor(author)
    .then((matchedBooks) => {
      res.status(200).send(matchedBooks);
    })
    .catch((err) => {
      res.status(404).json({message: err});
    });
});


// Function to search books by Title
const searchByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchedBooks = Object.values(books).filter((book) => book.title === title);
      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject("No books found with this title");
      }
    }, 100);
  });
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  searchByTitle(title)
    .then((matchedBooks) => {
      res.status(200).send(matchedBooks);
    })
    .catch((err) => {
      res.status(404).json({message: err});
    });
});


// Function to get a book review
const getBookReview = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn]
      if (book && book.reviews) {
        resolve(book.reviews);
      } else {
        reject("No reviews found for this book");
      }
    }, 100);
  });
}

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookReview(isbn)
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch((err) => {
      res.status(404).json({message: err});
    });
});

module.exports.general = public_users;
