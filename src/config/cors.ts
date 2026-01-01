/* eslint-disable unicorn/no-null */
import cors, { type CorsOptions } from 'cors';

//* Update whitelist according to your need.
const whitelist = new Set([
  'https://app.example.com',
  'https://admin.example.com',
  'http://localhost:3000',
]);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (whitelist.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204,
  maxAge: 86_400,
};

export default cors(corsOptions);
