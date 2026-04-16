import { api } from '../api';

export default function AdviceCard({ advice, onEdit, onDeleted, onFavoriteToggled }) {
  const handleDelete = async () => {
    if (!confirm('Delete this advice?')) return;
    await api.delete(advice.id);
    onDeleted();
  };

  const handleFavorite = async () => {
    await api.toggleFavorite(advice.id);
    onFavoriteToggled();
  };

  const categoryColors = {
    general: '#6c757d',
    career: '#0d6efd',
    technical: '#198754',
    life: '#e91e8b',
    leadership: '#fd7e14',
    communication: '#6f42c1',
  };

  return (
    <div className={`advice-card ${advice.is_favorite ? 'favorite' : ''}`}>
      <div className="card-header">
        <span
          className="category-badge"
          style={{ backgroundColor: categoryColors[advice.category] || '#6c757d' }}
        >
          {advice.category}
        </span>
        <button
          className={`star-btn ${advice.is_favorite ? 'starred' : ''}`}
          onClick={handleFavorite}
          title={advice.is_favorite ? 'Unstar' : 'Star this advice'}
        >
          {advice.is_favorite ? '★' : '☆'}
        </button>
      </div>

      <blockquote className="advice-text">"{advice.text}"</blockquote>

      <div className="advisor-info">
        <strong>— {advice.advisor_name}</strong>
        {advice.advisor_role && <span className="role">, {advice.advisor_role}</span>}
      </div>

      {advice.context_notes && (
        <div className="context-notes">
          <em>📝 {advice.context_notes}</em>
        </div>
      )}

      {advice.tags && advice.tags.length > 0 && (
        <div className="tags">
          {advice.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="card-footer">
        <span className="date">
          {new Date(advice.created_at).toLocaleDateString()}
        </span>
        <div className="card-actions">
          <button className="btn-sm" onClick={() => onEdit(advice)}>Edit</button>
          <button className="btn-sm btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
