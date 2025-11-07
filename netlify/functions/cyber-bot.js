exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { message } = JSON.parse(event.body || '{}');
  const apiKey = process.env.GEMINI_API_KEY;

  const systemPrompt = `You are a cybersecurity AI assistant...`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
      {
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
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Gemini API returned error: " + errorText);
    }
    const data = await response.json();
    let reply = "Sorry, AI did not reply.";
    try {
      reply = data.candidates[0].content.parts[0].text;
    } catch (e) {}
    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    // Return the error for frontend to display
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: err.message })
    };
  }
};
