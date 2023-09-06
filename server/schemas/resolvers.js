const { User } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLError } = require("graphql");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")

        return userData;
      }
      throw new GraphQLError("Must be logged in!", {
        extensions: {
          code: "UNAUTHENTICATED",
        }
      });
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      console.log(user);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      const correctPw = await user.isCorrectPassword(password);
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
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
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
    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
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
