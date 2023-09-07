// Defining the User Type represeting a user's information  (type User)
// Defining the Book Type representing book details (type Book)
// Defining the Input Type for creating or updating a book (input Bookinput) 
// Defining the Auth type for authentication response (type Auth)
// Define the Query type with a single query field 'me' to retrieve the currently authenticated user (type Quer)
// Defining the Mutation type with varrious mutation field for user and book operations (type Mutation)
const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

input BookInput {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}
type Query {
    me: User
}
type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, password: String!): Auth
    saveBook(input: BookInput): User
    deleteBook(bookId: ID!): User
}
`;

module.exports = typeDefs;