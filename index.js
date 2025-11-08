require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())

// routes
const youtubeRoutes = require('./routes/youtubeRoutes');
app.use('/api', youtubeRoutes);

// health check endpoint
app.get('/', (req, res) => 
  res.send('YouTube Data API Server is running')
);

// global error handler (simple)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send('Internal Server Error');
});

app.listen(PORT, () => {
    console.log('Server listening on http://localhost:' + PORT);
});

