const express = require('express');
const path = require('path');
const app = express();

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Serve static files from the 'static' directory within '365cms'
app.use(express.static(path.join(__dirname, 'public')));

// Optionally, define a route for "/" to specifically serve index.html from the 'public' directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle any other paths with a 404 response
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
