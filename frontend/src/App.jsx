import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { api } from './api';
import AdviceForm from './components/AdviceForm';
import AdviceCard from './components/AdviceCard';
import AdviceOfTheDay from './components/AdviceOfTheDay';
import Stats from './components/Stats';
import ExportButton from './components/ExportButton';
import './App.css';

function HomePage() {
  const [adviceList, setAdviceList] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [allTags, setAllTags] = useState([]);

  const fetchAdvice = useCallback(async () => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'all') params.category = category;
    if (tagFilter) params.tag = tagFilter;
    if (showFavorites) params.favorite = 'true';

    const data = await api.getAll(params);
    setAdviceList(data);
  }, [search, category, tagFilter, showFavorites]);

  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  useEffect(() => {
    api.getTags().then(setAllTags).catch(() => {});
  }, []);

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    fetchAdvice();
    api.getTags().then(setAllTags).catch(() => {});
  };

  const handleEdit = (advice) => {
    setEditing(advice);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <AdviceOfTheDay />

      <div className="toolbar">
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search advice, people, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="career">Career</option>
            <option value="technical">Technical</option>
            <option value="life">Life</option>
            <option value="leadership">Leadership</option>
            <option value="communication">Communication</option>
          </select>

          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="">All Tags</option>
            {allTags.map((t) => (
              <option key={t.id} value={t.name}>#{t.name}</option>
            ))}
          </select>

          <button
            className={`btn-sm ${showFavorites ? 'active' : ''}`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? '★ Favorites' : '☆ Favorites'}
          </button>

          <ExportButton adviceList={adviceList} />
        </div>

        <button
          className="btn-primary add-btn"
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? '✕ Close' : '+ Add Advice'}
        </button>
      </div>

      {showForm && (
        <AdviceForm
          advice={editing}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <div className="advice-grid">
        {adviceList.length === 0 ? (
          <div className="empty-state">
            <p>📭 No advice found.</p>
            <p>
              {search || category !== 'all' || tagFilter || showFavorites
                ? 'Try adjusting your filters.'
                : 'Click "+ Add Advice" to start building your book!'}
            </p>
          </div>
        ) : (
          adviceList.map((a) => (
            <AdviceCard
              key={a.id}
              advice={a}
              onEdit={handleEdit}
              onDeleted={fetchAdvice}
              onFavoriteToggled={fetchAdvice}
            />
          ))
        )}
      </div>
    </div>
  );
}


export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <h1>📖 Intern Advice Book</h1>
          </div>
          <nav className="header-nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/stats">Stats</NavLink>
            <button
              className="theme-toggle"
              onClick={() => setDark(!dark)}
              title="Toggle dark mode"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>Built with 💛 during my internship</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}
