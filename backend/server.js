const express = require('express');
const cors = require('cors');
const adviceRoutes = require('./routes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/advice', adviceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Intern Advice Book API running on http://localhost:${PORT}`);
});
