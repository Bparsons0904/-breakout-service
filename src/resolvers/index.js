import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import companyResolvers from './company';
import roomResolvers from './room';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  companyResolvers,
  roomResolvers,
];
