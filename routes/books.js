const req = require("express/lib/request");
const res = require("express/lib/response");
const app = require("../app");
const router = require("express").Router();
const Book = require("../models/Book.model");
const Author = require("../models/Author.model");
const { populate } = require("../models/Book.model");

/* GET home page */
router.get("/", (req, res, next) => {
  Book.find()
    .populate("author")
    .then((booksFromDB) => {
      "spres.render("books/books-list", { books: booksFromDB });
    })
    .catch((err) => {
      console.log("error", err);
    });
});

router.get("/create", (req, res, next) => {
  Author.find().then((authorsFromDB) => {
    res.render("books/book-create", { authors: authorsFromDB });
  });
});

router.post("/create", (req, res, next) => {
  const book = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    rating: req.body.rating,
  };
  Book.create(book)
    .then((book) => {
      res.redirect("/books");
    })
    .catch((err) => {
      console.log("error", err);
    });
});

router.get("/:bookId", (req, res, next) => {
  Book.findById(req.params.bookId)
    .populate("author")
    .then((book) => {
      res.render("books/book-details", book);
    })
    .catch((err) => {
      console.log("error", err);
    });
});

router.get("/:bookId/edit", (req, res, next) => {
  Book.findById(req.params.bookId)
    .populate("author")
    .then((bookToEdit) => {
      res.render("books/book-edit", bookToEdit);
    })
    .catch((err) => {
      console.log("error", err);
    });
});

router.post("/:bookId/edit", (req, res, next) => {
  const { bookId } = req.params;
  const book = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    rating: req.body.rating,
  };
  Book.findByIdAndUpdate(req.params.bookId, book)
    .then(() => res.redirect(`/books/${bookId}`))
    .catch((err) => {
      console.log("error", err);
    });
});

router.post("/:bookId/delete", (req, res, next) => {
  Book.findByIdAndDelete(req.params.bookId)
    .then(() => {
      res.redirect("/books");
    })
    .catch((err) => {
      console.log("error", err);
    });
});

module.exports = router;
