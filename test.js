const fs = require('fs');
const dotenv = require('dotenv');
const envConfig = dotenv.parse(fs.readFileSync('.env'));
const key = envConfig.OPENROUTER_API_KEY;

fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: envConfig.OPENROUTER_MODEL || 'openrouter/free',
    messages: [
      {
        role: 'system',
        content: 'You respond only in JSON like {"platform": "mobile", "features": ["f1"]}'
      },
      {
        role: 'user', 
        content: 'I want a mobile food delivery app'
      }
    ],
    temperature: 0.1, max_tokens: 1000
  })
}).then(r => r.json()).then(r => {
  console.log('API RESPONSE:', JSON.stringify(r, null, 2));
}).catch(console.error);