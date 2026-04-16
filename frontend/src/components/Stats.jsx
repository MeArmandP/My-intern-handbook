import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) return <div className="stats-page">Loading stats...</div>;

  const maxCatCount = Math.max(...stats.byCategory.map((c) => c.count), 1);
  const maxAdvisorCount = Math.max(...stats.byAdvisor.map((a) => a.count), 1);
  const maxTagCount = Math.max(...stats.topTags.map((t) => t.count), 1);

  return (
    <div className="stats-page">
      <h2>📊 Your Advice Stats</h2>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Advice</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{stats.favorites}</div>
          <div className="stat-label">Favorites ★</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{stats.byAdvisor.length}</div>
          <div className="stat-label">Advisors</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{stats.byCategory.length}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-section">
          <h3>By Category</h3>
          {stats.byCategory.map((c) => (
            <div key={c.category} className="bar-row">
              <span className="bar-label">{c.category}</span>
              <div className="bar-track">
                <div
                  className="bar-fill cat-bar"
                  style={{ width: `${(c.count / maxCatCount) * 100}%` }}
                />
              </div>
              <span className="bar-count">{c.count}</span>
            </div>
          ))}
        </div>

        <div className="chart-section">
          <h3>Top Advisors</h3>
          {stats.byAdvisor.slice(0, 8).map((a) => (
            <div key={a.advisor_name} className="bar-row">
              <span className="bar-label">{a.advisor_name}</span>
              <div className="bar-track">
                <div
                  className="bar-fill advisor-bar"
                  style={{ width: `${(a.count / maxAdvisorCount) * 100}%` }}
                />
              </div>
              <span className="bar-count">{a.count}</span>
            </div>
          ))}
        </div>

        <div className="chart-section">
          <h3>Top Tags</h3>
          {stats.topTags.map((t) => (
            <div key={t.name} className="bar-row">
              <span className="bar-label">#{t.name}</span>
              <div className="bar-track">
                <div
                  className="bar-fill tag-bar"
                  style={{ width: `${(t.count / maxTagCount) * 100}%` }}
                />
              </div>
              <span className="bar-count">{t.count}</span>
            </div>
          ))}
          {stats.topTags.length === 0 && <p className="empty-text">No tags yet</p>}
        </div>
      </div>

      {stats.timeline.length > 0 && (
        <div className="chart-section">
          <h3>📅 Timeline</h3>
          <div className="timeline">
            {stats.timeline.map((t) => (
              <div key={t.date} className="timeline-item">
                <span className="timeline-date">{t.date}</span>
                <span className="timeline-dots">
                  {'●'.repeat(Math.min(t.count, 20))}
                </span>
                <span className="bar-count">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
