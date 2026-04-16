import { useState, useEffect } from 'react';
import { api } from '../api';

const CATEGORIES = ['general', 'career', 'technical', 'life', 'leadership', 'communication'];

export default function AdviceForm({ advice, onSaved, onCancel }) {
  const [form, setForm] = useState({
    text: '',
    advisor_name: '',
    advisor_role: '',
    category: 'general',
    context_notes: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getTags().then(setAllTags).catch(() => {});
  }, []);

  useEffect(() => {
    if (advice) {
      setForm({
        text: advice.text || '',
        advisor_name: advice.advisor_name || '',
        advisor_role: advice.advisor_role || '',
        category: advice.category || 'general',
        context_notes: advice.context_notes || '',
        tags: advice.tags || [],
      });
    }
  }, [advice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (advice) {
        await api.update(advice.id, form);
      } else {
        await api.create(form);
      }
      onSaved();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form className="advice-form" onSubmit={handleSubmit}>
      <h2>{advice ? '✏️ Edit Advice' : '➕ Add New Advice'}</h2>

      <div className="form-group">
        <label>The Advice *</label>
        <textarea
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          placeholder="What wisdom were you given?"
          required
          rows={4}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Who Said It *</label>
          <input
            type="text"
            value={form.advisor_name}
            onChange={(e) => setForm({ ...form, advisor_name: e.target.value })}
            placeholder="e.g. Sarah, my manager"
            required
          />
        </div>
        <div className="form-group">
          <label>Their Role</label>
          <input
            type="text"
            value={form.advisor_role}
            onChange={(e) => setForm({ ...form, advisor_role: e.target.value })}
            placeholder="e.g. Senior Engineer"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Context / Mood Notes</label>
        <textarea
          value={form.context_notes}
          onChange={(e) => setForm({ ...form, context_notes: e.target.value })}
          placeholder="What was happening when they told you this? How did it make you feel?"
          rows={2}
        />
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div className="tag-input-row">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter"
            list="tag-suggestions"
          />
          <button type="button" className="btn-sm" onClick={addTag}>Add</button>
          <datalist id="tag-suggestions">
            {allTags.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
        </div>
        <div className="tags">
          {form.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : advice ? 'Update' : 'Save Advice'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
