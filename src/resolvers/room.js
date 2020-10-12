import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    rooms: async (parent, args, { models }) => {
      const rooms = await models.Room.find({});

      return rooms;
    },
    room: async (parent, { id }, { models }) => {
      return await models.Room.findById(id);
    },
  },

  Mutation: {
    createRoom: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        const room = await models.Room.create({
          ...args,
        });

        room.active = false;
        room.successes = 0;
        room.attempts = 0;
        room.fastest = 0;
        await room.save();
        console.log(room);
        const rooms = await models.Room.find({});

        return rooms;
      },
    ),

    approveRoom: combineResolvers(
      isAuthenticated,

      async (parent, { id }, { models }) => {
        const room = await models.Room.findById(id);

        if (room) {
          room.active = true;
          await room.save();
        }

        const rooms = await models.Room.find({});

        return rooms;
      },
    ),

    removeRoom: combineResolvers(
      isAuthenticated,

      async (parent, { id }, { models }) => {
        const room = await models.Room.findById(id);

        if (room) {
          await room.remove();
        }

        const rooms = await models.Room.find({});

        return rooms;
      },
    ),
  },
};
