// netlify/functions/verify-access.js

exports.handler = async function(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const { code } = JSON.parse(event.body || '{}');
  const validCodes = ["SECRET-ACCESS-2025", "VIP-INVITE-983"]; // put in env for security!
  if (validCodes.includes((code || '').trim())) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ success: false, error: 'Invalid or expired code. Contact admin for access.' })
  };
};
