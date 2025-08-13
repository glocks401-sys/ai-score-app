// netlify/functions/score.js
import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const { userInput } = JSON.parse(event.body);

    // Hugging Face model - you can change this to other text models
    const model = "facebook/bart-large-mnli"; // Zero-shot classification model
    const apiKey = process.env.HF_API_KEY; // Set this in Netlify environment variables

    // Labels for scoring
    const labels = [
      "validity",
      "fact check",
      "hallucination",
      "authenticity",
      "unbiased response",
      "secure",
      "data privacy",
      "AI generated text"
    ];

    // Call Hugging Face Inference API
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: userInput,
        parameters: { candidate_labels: labels }
      })
    });

    const data = await response.json();

    // Map scores (Hugging Face returns 0–1, so multiply by 100)
    const scores = {};
    labels.forEach((label, i) => {
      scores[label] = Math.round(data.scores[i] * 100);
    });

    return {
      statusCode: 200,
      body: JSON.stringify(scores)
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get scores" })
    };
  }
}
