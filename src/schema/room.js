import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    rooms: [Room!]
    room(id: ID!): Room!
  }

  extend type Mutation {
    createRoom(
      name: String!
      description: String!
      imageUrl: String!
      website: String!
      companyId: ID!
      timeLimit: Float!
    ): [Room!]
    updateRoom(
      id: ID!
      successes: Float
      attempts: Float
      fastest: Float
    ): [Room!]

    approveRoom(id: ID!): [Room!]
    removeRoom(id: ID!): [Room!]
    completeRoom(id: ID!, time: Float): RoomCompleted
  }

  type Room {
    id: ID!
    name: String!
    description: String!
    imageUrl: String!
    website: String!
    active: Boolean
    successes: Float
    attempts: Float
    fastest: Float
    timeLimit: Float!
    companyId: ID!
  }

  type RoomCreated {
    room: Room!
  }

  type RoomCompleted {
    rooms: [Room!]
    user: User
  }
`;
