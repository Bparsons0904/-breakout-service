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
        console.log(args);
        const company = await models.Company.create({
          ...args,
        });
        const companies = await models.Company.find({});
        return companies;
      },
    ),
    approveCompany: combineResolvers(
      isAuthenticated,
      isAdmin,
      async (parent, args, { models, me }) => {
        const company = await models.Company.findById(args.id);
        company.active = true;
        await company.save();

        const companies = await models.Company.find({});
        return companies;
      },
    ),

    removeCompany: combineResolvers(
      isAuthenticated,
      isAdmin,

      async (parent, { id }, { models }) => {
        const company = await models.Company.findById(id);

        if (company) {
          await company.remove();
        }

        const companies = await models.Company.find({});
        return companies;
      },
    ),
  },
};
