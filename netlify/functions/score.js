// netlify/functions/score.js
const fetch = require("node-fetch"); // Node 18+ has fetch by default

// Categories to score
const CATEGORIES = [
  'validity',
  'fact check',
  'hallucination',
  'authenticity',
  'unbiased response',
  'secure',
  'data privacy',
  'ai generated text'
];

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const text = body.text;

    if (!text) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing text input" }) };
    }

    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "HF_API_KEY not set" }) };
    }

    // Replace with a Hugging Face model of your choice
    const MODEL_URL = "https://api-inference.huggingface.co/models/gpt2"; 

    // Call Hugging Face API
    const hfRes = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text })
    });

    const hfOutput = await hfRes.json();

    // Example: convert API response to scores
    // You can customize mapping logic depending on model output
    const scores = {};
    CATEGORIES.forEach((cat, i) => {
      // Random example scoring (50–100) for demo
      scores[cat] = Math.min(100, Math.max(0, Math.round(Math.random() * 50 + 50)));
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        scores,
        explanation: "Scores generated via Hugging Face API (demo mapping)."
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
