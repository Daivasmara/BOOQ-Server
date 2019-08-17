const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
} = require('graphql');

const { GraphQLDate } = require ('graphql-iso-date');

const Book = require('../models/Book');
const Author = require('../models/Author');
const Genre = require('../models/Genre');
const Publisher = require('../models/Publisher');

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
      resolve(parent, args){
        return Author.find({ _id: parent.author_id });
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      resolve(parent, args){
        return Genre.find({ _id: parent.genres_id });
      }
    },
    publisher: {
      type: PublisherType,
      resolve(parent, args){
        return Publisher.findById(parent.publisher_id);
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
      resolve(parent, args){
        return Book.find({ author_id: parent.id });
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
      resolve(parent, args){
        return Book.find({ publisher_id: parent.id });
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
      resolve(parent, args){
        return Book.find({ genres_id: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args){
        return Book.find();
      }
    },
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args){
        return Book.findById(args.id);
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args){
        return Author.find();
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args){
        return Author.findById(args.id);
      }
    },
    genres: {
      type: new GraphQLList(GenreType),
      resolve(parent, args){
        return Genre.find();
      }
    },
    genre: {
      type: GenreType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args){
        return Genre.findById(args.id);
      }
    },
    publishers: {
      type: new GraphQLList(PublisherType),
      resolve(parent, args){
        return Publisher.find();
      }
    },
    publisher: {
      type: PublisherType,
      args: {
        id: { type: GraphQLID }
      },
      resolve(parent, args){
        return Publisher.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLString },
        synopsis: { type: GraphQLString },
        published_date: { type: GraphQLDate },
        language: { type: GraphQLString },
        publisher_id: { type: GraphQLID },
        author_id: { type: new GraphQLList(GraphQLID) },
        genres_id: { type: new GraphQLList(GraphQLID) }
      },
      resolve(parent, args){
        let book = new Book({
          title: args.title,
          synopsis: args.synopsis,
          language: args.language,
          published_date: args.published_date,
          publisher_id: args.publisher_id,
          author_id: args.author_id,
          genres_id: args.genres_id
        });
        return book.save();
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        bio: { type: GraphQLString },
        birth_city: { type: GraphQLString },
        birthdate: { type: GraphQLDate }
      },
      resolve(parent, args){
        let author = new Author({
          name: args.name,
          bio: args.bio,
          birth_city: args.birth_city,
          birthdate: args.birthdate
        });
        return author.save();
      }
    },
    addPublisher: {
      type: PublisherType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args){
        let publisher = new Publisher({
          name: args.name
        });
        return publisher.save();
      }
    },
    addGenre: {
      type: GenreType,
      args: {
        name: { type: GraphQLString }
      },
      resolve(parent, args){
        let genre = new Genre({
          name: args.name
        });
        return genre.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
