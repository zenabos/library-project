const req = require("express/lib/request");
const res = require("express/lib/response");
const app = require("../app");
const router = require("express").Router();
const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

/* GET home page */
router.get("/", (req, res, next) => {
  let books;

  Book.find()
    .then((booksFromDB) => {
      books = booksFromDB;
      return Author.find();
    })
    .then((authorsFromDB) => {
      const authorsArr = authorsFromDB.map((authorDetails) => {
        const { _id, name, age, country } = authorDetails;
        const booksFromCurrentAuthor = books.filter((book) => {
          return book.author.toString() == _id.toString(); // compare ids as string
        });
        const numberOfBooks = booksFromCurrentAuthor.length;

        return { name, age, country, numberOfBooks };
      });
      res.render("authors/authors-list", { author: authorsArr });
    })
    .catch((err) => {
      console.log("error", err);
    });
});

module.exports = router;
