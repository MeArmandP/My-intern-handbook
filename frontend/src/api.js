const API = 'http://localhost:3001/api/advice';

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${API}?${query}`).then(handleResponse);
  },

  getOne: (id) => fetch(`${API}/${id}`).then(handleResponse),

  getRandom: () => fetch(`${API}/random`).then(handleResponse),

  getStats: () => fetch(`${API}/stats`).then(handleResponse),

  getTags: () => fetch(`${API}/meta/tags`).then(handleResponse),

  create: (data) =>
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  toggleFavorite: (id) =>
    fetch(`${API}/${id}/favorite`, { method: 'PATCH' }).then(handleResponse),

  delete: (id) =>
    fetch(`${API}/${id}`, { method: 'DELETE' }).then(handleResponse),
};
