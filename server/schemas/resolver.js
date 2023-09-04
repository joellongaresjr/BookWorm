const { User } = require('../models/User');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({_id: context.user._id})
              .select("-__v, password")
              .populate("savedBooks")

              return userData;
            }
            throw new AuthenticationError('Must be logged in!');
          },
        },
    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({ username, email, password });
            const token = singleToken(User);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("homie that's the wrong credentials")
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("invalid password homie");
            }
            const token = signToken(user);
            return { token, user };
        } 
    }
    }


