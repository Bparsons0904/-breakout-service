import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    companies(active: Boolean): [Company!]
    company(id: ID!): Company!
  }

  extend type Mutation {
    createCompany(
      name: String!
      location: String!
      website: String!
      imageUrl: String!
      active: Boolean
    ): CompanyCreated!
    deleteCompany(id: ID!): Boolean!
  }

  type Company {
    id: ID
    name: String
    description: String
    location: String
    website: String
    imageUrl: String
    active: Boolean
    rooms: [Room]
  }

  type CompanyCreated {
    company: Company!
  }
`;
