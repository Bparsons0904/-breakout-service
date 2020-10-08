import { combineResolvers } from 'graphql-resolvers';

import pubsub, { EVENTS } from '../subscription';
import { isAuthenticated } from './authorization';

export default {
  Query: {
    companies: async (parent, args, { models }) => {
      const companies = await models.Company.find({});

      return companies;
    },
    company: async (parent, { id }, { models }) => {
      return await models.Company.findById(id);
    },
  },

  Mutation: {
    createCompany: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        console.log(args);
        const company = await models.Company.create({
          ...args,
        });
        return { company };
      },
    ),
    approveCompany: combineResolvers(
      isAuthenticated,
      async (parent, args, { models, me }) => {
        const company = await models.Company.findById(args.id);
        company.active = true;
        await company.save();
        return company.active;
      },
    ),

    deleteCompany: combineResolvers(
      isAuthenticated,

      async (parent, { id }, { models }) => {
        const company = await models.Company.findById(id);

        if (company) {
          await company.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },
};
