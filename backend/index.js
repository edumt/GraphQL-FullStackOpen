require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      const filter = {};
      if (genre) filter.genres = { $in: [genre] };

      let books = await Book.find(filter).populate("author");

      if (author) books = books.filter((book) => book.author.name === author); // to do: check if theres a built-in method

      return books;
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id });
      return books.length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const { title, author, published, genres } = args;
      let savedAuthor = await Author.findOne({ name: author });

      if (!savedAuthor) savedAuthor = Author.create({ name: author });

      return Book.create({
        title,
        published,
        author: savedAuthor.id,
        genres,
      });
    },
    editAuthor: async (root, args) => {
      const { name, setBornTo } = args;
      const author = await Author.findOne({ name });

      if (!author) return null;

      author.born = setBornTo;
      return author.save();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
