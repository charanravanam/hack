// netlify/functions/cyber-bot.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Parse user message from POST body
  const { message } = JSON.parse(event.body || '{}');
  const apiKey = process.env.GEMINI_API_KEY;

  // Construct Gemini prompt
  const systemPrompt = `You are a cybersecurity AI assistant inside the Gatekeeper chat app. Never assist with illegal, dangerous, or offensive actions. Give accurate, ethical advice about defensive tactics, CTF hints, OSINT, secure coding, ethical hacking, and digital forensics. Never provide real attack payloads or steps for unauthorized access.`;

  // Call Gemini Pro (Google AI) chat endpoint
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [
          { text: systemPrompt },
          { text: String(message) }
        ]
      }]
    })
  });
  
  if (!response.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Bot error: Could not reach Gemini API." })
    };
  }

  const data = await response.json();

  // Gemini reply extraction
  let reply = "Sorry, AI did not reply.";
  try {
    reply = data.candidates[0].content.parts[0].text;
  } catch (e) {}

  return {
    statusCode: 200,
    body: JSON.stringify({ reply })
  };
};
