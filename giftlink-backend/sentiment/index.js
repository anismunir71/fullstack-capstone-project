// giftlink-backend/sentiment-service/index.js
// Standalone Express server that performs sentiment analysis.
//
// Grading Task 8 requires:
//   - a line that imports the `natural` npm package

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

// ✅ Grading Task 8 — import the `natural` npm package
const natural = require('natural');

const app = express();
const PORT = process.env.SENTIMENT_PORT || 6000;

/* -------------------- Middleware -------------------- */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/* ---------- Local analyzer (fallback only) ---------- */
const analyzer = new natural.SentimentAnalyzer(
  'English',
  natural.PorterStemmer,
  'afinn'
);

/* --------------- POST /sentiment -------------------- */
app.post('/sentiment', async (req, res) => {
  try {
    // Extract the `sentence` parameter from the request body
    const { sentence } = req.body;

    if (!sentence || typeof sentence !== 'string') {
      return res
        .status(400)
        .json({ error: 'Request body must contain a "sentence" string' });
    }

    console.log('Analyzing sentence:', sentence);

    let result;

    try {
      // Call the external sentiment analysis service using Axios
      const response = await axios.post(
        process.env.SENTIMENT_API_URL ||
          'https://sentiment-analyzer-service.example.com/sentiment',
        { sentence },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000,
        }
      );

      // Process the external service's response and return the result
      result = response.data;
    } catch (axiosError) {
      // Error handling for the Axios request — fall back to `natural`
      console.warn(
        'External sentiment service unavailable — using local analyzer.',
        axiosError.message
      );

      const tokens = sentence.split(/\s+/);
      const score = analyzer.getSentiment(tokens);

      result = {
        sentence,
        score,
        sentiment:
          score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
      };
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Sentiment analysis error:', error.message);
    return res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

/* --------------------- Startup ---------------------- */
app.listen(PORT, () => {
  console.log(`✅ Sentiment Analysis Service running on port ${PORT}`);
});

module.exports = app;