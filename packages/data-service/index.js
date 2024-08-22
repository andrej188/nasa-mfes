const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/api/nasa', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${process.env.NASA_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const limitedData = data.slice(0, 5);
    res.json(limitedData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default app;
