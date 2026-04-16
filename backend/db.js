const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.json');

const defaultData = {
  advice: [],
  tags: ['career', 'technical', 'life', 'communication', 'leadership', 'productivity', 'networking', 'mindset'],
  nextId: 1,
};

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch {
    // corrupted file, start fresh
  }
  return { ...defaultData };
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Initialize file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  save(defaultData);
}

module.exports = { load, save };
