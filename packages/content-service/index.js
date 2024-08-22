const express = require('express');
const contentful = require('contentful');
require('dotenv').config();

const app = express();

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

app.use(require('cors')());

app.get('/api/content', async (req, res) => {
  try {
    const entries = await client.getEntries();
    res.json(entries.items);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default app;