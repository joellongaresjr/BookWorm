const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLError } = require("graphql");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // If authenticated, find the user in the database by their user ID
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password") // Exclude unnecessary fields from the response

        return userData; // Return the user data
      }
      // If not authenticated, throw a GraphQl error with code UNAUTHENTICATED
      throw new GraphQLError("Must be logged in!", {
        extensions: {
          code: "UNAUTHENTICATED",
        }
      });
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      // Create a new user in the database using the provided arguments
      const user = await User.create(args);
      console.log(user);
      // Generate a JWT token for the newly created user
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Find a user with the provided email in the database
      const user = await User.findOne({ email });

      // Check if the provided password is correct using a method from the User model
      const correctPw = await user.isCorrectPassword(password);
      // If the password is incorrect, throw a GraphQL error with code UNAUTHENTICATED
      if (!correctPw) {
        throw new GraphQLError("invalid password", {
          extensions: {
            code: "UNAUTHENTICATED"
          }
        });
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        // Update the user's savedBooks array by adding the new (input)
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } }, // Use $addToSet to prevent duplicate books 
          { new: true } // Return the updated user
        );
        return updatedUser;
      }
      // If not authenicated, throw a GraphQl error with code UNAUTHENICATED
      throw new GraphQLError("invalid password", {
        extensions: {
          code: "UNAUTHENTICATED"
        }
      });
    },
    deleteBook: async (parent, { bookId }, context) => {
      // Check if the user is authenicated (context.user exists)
      if (context.user) {
      // Update the user's savedBooks array by removing the book with the specified bookId
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } }, // Use $pull to remove the specified book by it's id
          { new: true } 
        );
        return updatedUser;
      }
      throw new GraphQLError("invalid password", {
        extensions: {
          code: "UNAUTHENTICATED"
        }
      });
    },
  },
};

module.exports = resolvers;
