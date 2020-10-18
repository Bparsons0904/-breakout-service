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
      role: String
    ): Token!

    signIn(login: String!, password: String!): Token!
    updateUser(
      id: ID
      wishlist: ID
      completedRooms: ID
      favorites: ID
      successfulRooms: Int
      failedRooms: Int
    ): User!
    deleteUser(id: ID!): Boolean!
    updateWishlist(id: ID, add: Boolean): User
    updateFavorite(id: ID, add: Boolean): User
    updateCompletedRooms(id: ID, add: Boolean): User
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
    wishlist: [String]
    completedRooms: [String]
    favorites: [String]
    successfulRooms: Int
    failedRooms: Int
  }
`;
