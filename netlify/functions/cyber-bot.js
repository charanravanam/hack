// netlify/functions/cyber-bot.js
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { message } = JSON.parse(event.body || '{}');
  // Replace this stub with Gemini/OpenAI API call
  const reply = `You said: ${message} (cybersecurity advice would go here)`;
  return {
    statusCode: 200,
    body: JSON.stringify({ reply })
  };
};
