import { expect } from 'chai';

import * as api from './api';
import models, { connectDb } from '../models';

let db;

before(async () => {
  db = await connectDb(process.env.DATABASE_URL);
});

after(async () => {
  await db.connection.close();
});

describe('Messages', () => {
  describe('messages (limit: INT)', () => {
    it('returns a list of messages', async () => {
      const expectedResult = {
        data: {
          messages: {
            edges: [
              {
                text: '',
              },
              {
                text: '',
              },
            ],
          },
        },
      };

      const result = await api.messages();

      expect(result.data).to.eql(expectedResult);
    });

    it('should get messages with the users', async () => {
      const expectedResult = {
        data: {
          messages: {
            edges: [
              {
                text: '',
                user: {
                  username: '',
                },
              },
              {
                text: '',
                user: {
                  username: '',
                },
              },
            ],
          },
        },
      };

      const result = await api.messagesInclUsers();

      expect(result.data).to.eql(expectedResult);
    });
  });
});
