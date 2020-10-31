import { combineResolvers } from 'graphql-resolvers';
import { isAdmin, isAuthenticated } from './authorization';

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
        // Set company to incoming params
        const company = await models.Company.create({
          ...args,
        });
        // Query and return all companies
        const companies = await models.Company.find({});
        return companies;
      },
    ),
    approveCompany: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models, me }) => {
        // Query company and set to active
        const company = await models.Company.findById(args.id);
        company.active = true;
        await company.save();
        // Query and return all companies
        const companies = await models.Company.find({});
        return companies;
      },
    ),

    removeCompany: combineResolvers(
      isAuthenticated,
      isAdmin,

      async (parent, { id }, { models }) => {
        // Query and remove company if found
        const company = await models.Company.findById(id);
        if (company) {
          await company.remove();
        }
        // Query and return all companies
        const companies = await models.Company.find({});
        return companies;
      },
    ),
  },
};
