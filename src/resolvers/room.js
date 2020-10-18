import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from './authorization';

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
        const rooms = await models.Room.find({});

        return rooms;
      },
    ),

    updateRoom: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => {
        let room = await models.Room.findById(args.id);
        if (room) {
          for (const key in args) {
            if (args.hasOwnProperty(key)) {
              const element = args[key];
              room[key] = element;
            }
          }
          await room.save();
        }
        const rooms = await models.Room.find({});
        return rooms;
      },
    ),

    completeRoom: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        const room = await models.Room.findById(args.id);
        const user = await models.User.findById(me.id);
        if (args.time < room.timeLimit) {
          room.attempts++;
          room.successes++;
          if (args.time < room.fastest) {
            room.fastest = args.time;
          }
        } else {
          room.attempts++;
        }
        const wishlistIndex = user.wishlist.indexOf(args.id);
        if (wishlistIndex >= 0) {
          user.wishlist.splice(wishlistIndex, 1);
        }
        if (user.completedRooms.indexOf(args.id) === -1) {
          user.completedRooms.push(args.id);
        }
        await user.save();
        await room.save();
        const rooms = await models.Room.find({});
        return { rooms, user };
      },
    ),

    approveRoom: combineResolvers(
      isAuthenticated,
      isAdmin,
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
      isAdmin,

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
