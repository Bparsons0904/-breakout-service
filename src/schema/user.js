import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
    ): Token!

    signIn(login: String!, password: String!): Token!
    updateUser(username: String!): User!
    deleteUser(id: ID!): Boolean!
    addFavorite(roomId: ID!): User
    addCompleted(roomId: ID!): User
    addWishlist(roomId: ID!): User
    addSuccess: User
    addFailure: User
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    wishlist: [Room]
    completedRooms: [Room]
    favorites: [Room]
    successfulRooms: Int
    failedRooms: Int
  }
`;
