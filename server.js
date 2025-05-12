const express = require('express');
const next = require('next');
const path = require('path');
const http = require('http');

require('dotenv').config({ path: '.env.production' });

// Importing the database connection function
const connectDB = require('./src/app/api/database');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  // Connect to MongoDB
  await connectDB();
  const server = express();
  const httpServer = http.createServer(server);

  // Middleware to serve static files from the "public" directory
  server.use(express.static(path.join(__dirname, 'public')));

  // Let Next.js handle all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch(err => {
  console.error(err);
  process.exit(1);
});
