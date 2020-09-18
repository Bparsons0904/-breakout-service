import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    rooms: Room!
    room(id: ID!): Room!
  }

  extend type Mutation {
    createRoom(
      name: String!
      intro: String!
      imageUrl: String!
    ): RoomCreated!

    deleteRoom(id: ID!): Boolean!
  }

  type Room {
    id: ID!
    name: String!
    intro: String!
    imageUrl: String!
    successes: Float
    attempts: Float
    fastest: Float
  }

  type RoomCreated {
    room: Room!
  }
`;
