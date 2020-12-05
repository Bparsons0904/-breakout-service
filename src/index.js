import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';
// Get schemas, resolvers, models and loader from linking index files
import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import loaders from './loaders';

// Init express server
const app = express();
// And in cross script through cors
app.use(cors());
// Add morgan plugin
app.use(morgan('dev'));

// Load user based on token
const getMe = async (req) => {
  // Get token from header
  const token = req.headers['x-token'];
  // If token exist, verify token matches local secret key and is valid
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

// Init apollo server with schema and resolvers.
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  introspection: true,
  playground: true,
  formatError: (error) => {
    const message = error.message.replace('Validation error: ', '');
    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader((keys) =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }

    // Get user based on token
    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader((keys) =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

// Init graphql services
server.applyMiddleware({ app, path: '/graphql' });
// Init server
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// Set port to assigned production port or default
const port = process.env.PORT || 8000;
// Connect to DB then listen to incoming HTTP request on selected port
connectDb().then(async () => {
  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});
