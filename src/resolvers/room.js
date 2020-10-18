import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from './authorization';

export default {
  Query: {
    // Get all rooms
    rooms: async (parent, args, { models }) => {
      const rooms = await models.Room.find({});
      return rooms;
    },
    // Get room by ID
    room: async (parent, { id }, { models }) => {
      return await models.Room.findById(id);
    },
  },

  Mutation: {
    // Create new room, ready for approval
    createRoom: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        // Set room to incoming args
        const room = await models.Room.create({
          ...args,
        });

        room.active = false;
        room.successes = 0;
        room.attempts = 0;
        room.fastest = 0;
        await room.save();
        // Query and return all rooms
        const rooms = await models.Room.find({});
        return rooms;
      },
    ),

    updateRoom: combineResolvers(
      isAuthenticated,
      async (parent, args, { models }) => {
        // Get room by ID
        let room = await models.Room.findById(args.id);
        // If room found, loop through incoming variables and update room
        if (room) {
          for (const key in args) {
            if (args.hasOwnProperty(key)) {
              const element = args[key];
              room[key] = element;
            }
          }
          await room.save();
        }
        // Query and return all rooms
        const rooms = await models.Room.find({});
        return rooms;
      },
    ),

    completeRoom: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        // Get room and user by ID's
        const room = await models.Room.findById(args.id);
        const user = await models.User.findById(me.id);
        // If new time less than room time limit, set as success
        if (args.time < room.timeLimit) {
          room.successes++;
          if (args.time < room.fastest) {
            room.fastest = args.time;
          }
        }
        room.attempts++;
        // Check is room part of user wishlist and remove
        const wishlistIndex = user.wishlist.indexOf(args.id);
        if (wishlistIndex >= 0) {
          user.wishlist.splice(wishlistIndex, 1);
        }
        // Add to users completed rooms if not already
        if (user.completedRooms.indexOf(args.id) === -1) {
          user.completedRooms.push(args.id);
        }
        // Save user and room updates
        await user.save();
        await room.save();
        // Query and return all rooms
        const rooms = await models.Room.find({});
        return { rooms, user };
      },
    ),

    approveRoom: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, { id }, { models }) => {
        // Get room by ID
        const room = await models.Room.findById(id);
        // If room found set to active
        if (room) {
          room.active = true;
          await room.save();
        }
        // Query and return all rooms
        const rooms = await models.Room.find({});
        return rooms;
      },
    ),

    removeRoom: combineResolvers(
      isAuthenticated,
      isAdmin,

      async (parent, { id }, { models }) => {
        // Get room by ID
        const room = await models.Room.findById(id);
        // If room found, delete from DB
        if (room) {
          await room.remove();
        }
        // Query and return all rooms
        const rooms = await models.Room.find({});
        return rooms;
      },
    ),
  },
};
