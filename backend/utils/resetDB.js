require("dotenv").config();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

let authors = [
  {
    name: "Robert Martin",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
  },
  {
    name: "Sandi Metz", // birthyear not known
  },
];
let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
];

const saveBook = async ({ title, author, published, genres }) => {
  let savedAuthor = await Author.findOne({ name: author });

  if (!savedAuthor) savedAuthor = new Author({ name: author }).save();

  const book = new Book({
    title,
    published,
    author: savedAuthor.id,
    genres,
  });

  return book.save();
};

const reset = async () => {
  await Author.deleteMany({});
  await Book.deleteMany({});

  await Author.create(authors);
  for (const book of books) {
    await saveBook(book);
  }
  console.log("DB reset!");
  mongoose.connection.close();
};

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
    reset();
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });
