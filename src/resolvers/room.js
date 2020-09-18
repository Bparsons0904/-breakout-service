import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    rooms: async (parent, args, { models }) => {
      const rooms = await models.Room.find();

      return { rooms };
    },
    room: async (parent, { id }, { models }) => {
      return await models.Room.findById(id);
    },
  },

  Mutation: {
    createRoom: combineResolvers(
      isAuthenticated,
      async (parent, { args }, { models, me }) => {
        const room = await models.Room.create({
          ...args,
        });

        return room;
      },
    ),

    deleteRoom: combineResolvers(
      isAuthenticated,

      async (parent, { id }, { models }) => {
        const room = await models.Room.findById(id);

        if (room) {
          await room.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },
};
