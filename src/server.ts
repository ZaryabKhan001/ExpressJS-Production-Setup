import dotenv from 'dotenv';
import morgan from 'morgan';

import { buildApp } from './app.js';
import { config } from './config/index.js';

dotenv.config();

const port = Number(config.port) || 3000;
const app = buildApp();

//? configure morgan logging based on environment
const environment = config.nodeEnv || 'development';
app.use(environment === 'development' ? morgan('dev') : morgan('tiny'));

//? Start the server and capture the returned Server Instance.
const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//? Listen to the SIGTERM signal to gracefully shut dwn the server
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
