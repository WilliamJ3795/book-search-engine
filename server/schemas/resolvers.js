// importing Authentication error to show the error messages
const { AuthenticationError } = require("apollo-server-errors");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id}).select(
                    "-__v -password"
                );
                return userData;
            }
            throw new AuthenticationError("You are not logged in");

        },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("invaild email or password");
            }

            const correctPassword = await user.isCorrectPassword({ password });
            if (!correctPassword) {
                throw new AuthenticationError("Invaild email or password");
            }

        }
    }
}