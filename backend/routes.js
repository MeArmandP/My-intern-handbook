const express = require('express');
const { load, save } = require('./db');

const router = express.Router();

// --- GET all tags (must be before /:id) ---
router.get('/meta/tags', (req, res) => {
  const data = load();
  res.json(data.tags.map((name, i) => ({ id: i + 1, name })));
});

// --- GET all advice (with optional search, filter, category) ---
router.get('/', (req, res) => {
  const { search, category, tag, favorite } = req.query;
  const data = load();
  let results = [...data.advice];

  if (search) {
    const s = search.toLowerCase();
    results = results.filter(
      (a) =>
        a.text.toLowerCase().includes(s) ||
        a.advisor_name.toLowerCase().includes(s) ||
        (a.context_notes && a.context_notes.toLowerCase().includes(s))
    );
  }
  if (category && category !== 'all') {
    results = results.filter((a) => a.category === category);
  }
  if (favorite === 'true') {
    results = results.filter((a) => a.is_favorite);
  }
  if (tag) {
    results = results.filter((a) => a.tags && a.tags.includes(tag));
  }

  results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(results);
});

// --- GET random advice (Advice of the Day) ---
router.get('/random', (req, res) => {
  const data = load();
  if (data.advice.length === 0) return res.json(null);
  const idx = Math.floor(Math.random() * data.advice.length);
  res.json(data.advice[idx]);
});

// --- GET stats ---
router.get('/stats', (req, res) => {
  const data = load();
  const all = data.advice;
  const total = all.length;
  const favorites = all.filter((a) => a.is_favorite).length;

  const catMap = {};
  const advisorMap = {};
  const tagMap = {};
  const dateMap = {};

  for (const a of all) {
    catMap[a.category] = (catMap[a.category] || 0) + 1;
    advisorMap[a.advisor_name] = (advisorMap[a.advisor_name] || 0) + 1;
    const date = a.created_at.split('T')[0];
    dateMap[date] = (dateMap[date] || 0) + 1;
    if (a.tags) {
      for (const t of a.tags) {
        tagMap[t] = (tagMap[t] || 0) + 1;
      }
    }
  }

  const byCategory = Object.entries(catMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
  const byAdvisor = Object.entries(advisorMap)
    .map(([advisor_name, count]) => ({ advisor_name, count }))
    .sort((a, b) => b.count - a.count);
  const topTags = Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const timeline = Object.entries(dateMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  res.json({ total, favorites, byCategory, byAdvisor, topTags, timeline });
});

// --- GET single advice ---
router.get('/:id', (req, res) => {
  const data = load();
  const item = data.advice.find((a) => a.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// --- CREATE advice ---
router.post('/', (req, res) => {
  const { text, advisor_name, advisor_role, category, context_notes, tags } = req.body;

  if (!text || !advisor_name) {
    return res.status(400).json({ error: 'text and advisor_name are required' });
  }

  const data = load();
  const newAdvice = {
    id: data.nextId++,
    text,
    advisor_name,
    advisor_role: advisor_role || '',
    category: category || 'general',
    context_notes: context_notes || '',
    is_favorite: false,
    tags: (tags || []).map((t) => t.trim().toLowerCase()).filter(Boolean),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Add any new tags to the global tag list
  for (const t of newAdvice.tags) {
    if (!data.tags.includes(t)) data.tags.push(t);
  }

  data.advice.push(newAdvice);
  save(data);

  res.status(201).json({ id: newAdvice.id });
});

// --- UPDATE advice ---
router.put('/:id', (req, res) => {
  const { text, advisor_name, advisor_role, category, context_notes, is_favorite, tags } = req.body;
  const data = load();
  const idx = data.advice.findIndex((a) => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const existing = data.advice[idx];
  data.advice[idx] = {
    ...existing,
    text: text ?? existing.text,
    advisor_name: advisor_name ?? existing.advisor_name,
    advisor_role: advisor_role ?? existing.advisor_role,
    category: category ?? existing.category,
    context_notes: context_notes ?? existing.context_notes,
    is_favorite: is_favorite !== undefined ? is_favorite : existing.is_favorite,
    tags: tags ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean) : existing.tags,
    updated_at: new Date().toISOString(),
  };

  // Add any new tags
  if (tags) {
    for (const t of data.advice[idx].tags) {
      if (!data.tags.includes(t)) data.tags.push(t);
    }
  }

  save(data);
  res.json({ success: true });
});

// --- TOGGLE favorite ---
router.patch('/:id/favorite', (req, res) => {
  const data = load();
  const item = data.advice.find((a) => a.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });

  item.is_favorite = !item.is_favorite;
  save(data);
  res.json({ is_favorite: item.is_favorite });
});

// --- DELETE advice ---
router.delete('/:id', (req, res) => {
  const data = load();
  const idx = data.advice.findIndex((a) => a.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  data.advice.splice(idx, 1);
  save(data);
  res.json({ success: true });
});

module.exports = router;
