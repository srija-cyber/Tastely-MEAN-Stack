const express = require('express');
const cors = require('cors');

const app = express();

// Basic CORS
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Auth route
app.post('/api/auth/register', (req, res) => {
  console.log('Register request received:', req.body);
  res.json({ message: 'Registration endpoint reached!' });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
  console.log(`Test URL: http://localhost:${PORT}/api/test`);
});
