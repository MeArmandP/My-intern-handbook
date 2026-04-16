import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdviceOfTheDay() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandom = async () => {
    setLoading(true);
    try {
      const data = await api.getRandom();
      setAdvice(data);
    } catch {
      setAdvice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  if (loading) return <div className="aotd-card">Loading...</div>;
  if (!advice) return <div className="aotd-card">No advice yet! Add some first.</div>;

  return (
    <div className="aotd-card">
      <div className="aotd-header">
        <span className="aotd-icon">💡</span>
        <h3>Advice of the Day</h3>
        <button className="btn-sm" onClick={fetchRandom} title="Get another">🔄</button>
      </div>
      <blockquote className="aotd-text">"{advice.text}"</blockquote>
      <div className="aotd-author">
        — {advice.advisor_name}
        {advice.advisor_role && <span>, {advice.advisor_role}</span>}
      </div>
    </div>
  );
}
