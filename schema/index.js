const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} = require('graphql');

const { GraphQLDate } = require('graphql-iso-date');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const Publisher = require('../models/Publisher');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  })
});

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: { type: GraphQLString }
  })
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    synopsis: { type: GraphQLString },
    published_date: { type: GraphQLDate },
    language: { type: GraphQLString },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args){
        return await Author.find({ _id: parent.author_id });
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      async resolve(parent, args){
        return await Genre.find({ _id: parent.genres_id });
      }
    },
    publisher: {
      type: PublisherType,
      async resolve(parent, args){
        return await Publisher.findById(parent.publisher_id);
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    bio: { type: GraphQLString },
    birth_city: { type: GraphQLString },
    birthdate: { type: GraphQLDate },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args){
        return await Book.find({ author_id: parent.id });
      }
    }
  })
});

const PublisherType = new GraphQLObjectType({
  name: 'Publisher',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args){
        return await Book.find({ publisher_id: parent.id });
      }
    }
  })
});

const GenreType = new GraphQLObjectType({
  name: 'Genre',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args){
        return await Book.find({ genres_id: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    login: {
      type: TokenType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        let account = await User.findOne({ email: args.email });
        if(!account) {
          throw new Error("User doesn't exist.");
        };

        let passwordCorrect = await bcrypt.compare(args.password, account.password);
        if(!passwordCorrect) {
          throw new Error("Password is incorrect.");
        };
        let token = jwt.sign({
          email: account.email
        }, process.env.PRIVATE_KEY, { expiresIn: '1h' });
        return { token };
      }
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args){
        return await Book.find();
      }
    },
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args){
        return await Book.findById(args.id);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args){
        return await Author.find();
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args){
        return await Author.findById(args.id);
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      async resolve(parent, args){
        return await Genre.find();
      }
    },
    genre: {
      type: GenreType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args){
        return await Genre.findById(args.id);
      }
    },
    publishers: {
      type: new GraphQLList(PublisherType),
      async resolve(parent, args){
        return await Publisher.find();
      }
    },
    publisher: {
      type: PublisherType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args){
        return await Publisher.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        let userExistAlready = await User.findOne({ email: args.email });
        if (userExistAlready) {
          throw new Error('User exist already.')
        };
        let hashedPassword = await bcrypt.hash(args.password, 10);
        let user = new User({
          email: args.email,
          password: hashedPassword
        });
        return await user.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        synopsis: { type: new GraphQLNonNull(GraphQLString) },
        published_date: { type: new GraphQLNonNull(GraphQLDate) },
        language: { type: new GraphQLNonNull(GraphQLString) },
        publisher_id: { type: new GraphQLNonNull(GraphQLID) },
        author_id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
        genres_id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
      },
      async resolve(parent, args) {
        let book = new Book({
          title: args.title,
          synopsis: args.synopsis,
          language: args.language,
          published_date: args.published_date,
          publisher_id: args.publisher_id,
          author_id: args.author_id,
          genres_id: args.genres_id
        });
        return await book.save();
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        bio: { type: new GraphQLNonNull(GraphQLString) },
        birth_city: { type: new GraphQLNonNull(GraphQLString) },
        birthdate: { type: new GraphQLNonNull(GraphQLDate) }
      },
      async resolve(parent, args) {
        let author = new Author({
          name: args.name,
          bio: args.bio,
          birth_city: args.birth_city,
          birthdate: args.birthdate
        });
        return await author.save();
      }
    },
    addPublisher: {
      type: PublisherType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        let publisher = new Publisher({
          name: args.name
        });
        return await publisher.save();
      }
    },
    addGenre: {
      type: GenreType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        let genre = new Genre({
          name: args.name
        });
        return await genre.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
