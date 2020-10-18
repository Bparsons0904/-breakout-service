import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin, isAuthenticated } from './authorization';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign({ id, email, username, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.find();
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password, role },
      { models, secret },
    ) => {
      const successfulRooms = 0;
      const failedRooms = 0;
      const user = await models.User.create({
        username,
        email,
        password,
        successfulRooms,
        failedRooms,
        role,
      });

      return { token: createToken(user, secret, '30 days') };
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30 days') };
    },

    updateWishlist: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        const user = await models.User.findById(me.id);
        console.log('Update wishlist', args.id);
        if (args.add) {
          if (user.wishlist.indexOf(args.id) === -1) {
            user.wishlist.push(args.id);
          }
        } else {
          const index = user.wishlist.indexOf(args.id);
          user.wishlist.splice(index, 1);
        }
        user.save();
        console.log(user);
        return user;
      },
    ),

    updateFavorite: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        const user = await models.User.findById(me.id);
        console.log('Update favorite', args.id);
        if (args.add) {
          if (user.favorites.indexOf(args.id) === -1) {
            user.favorites.push(args.id);
          }
        } else {
          const index = user.favorites.indexOf(args.id);
          user.favorites.splice(index, 1);
        }
        user.save();
        console.log(user);
        return user;
      },
    ),
    updateCompletedRooms: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        const user = await models.User.findById(me.id);
        console.log('Update completedRooms', args.id);
        if (args.add) {
          if (user.completedRooms.indexOf(args.id) === -1) {
            user.completedRooms.push(args.id);
          }
        } else {
          const index = user.completedRooms.indexOf(args.id);
          user.completedRooms.splice(index, 1);
        }
        user.save();
        console.log(user);
        return user;
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const user = await models.User.findById(id);

        if (user) {
          await user.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },
};
