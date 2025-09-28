const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const message = (data && data.detail) || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export function submitInsurance(data) {
  return jsonFetch(`${API_BASE}/insurance`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function submitRecords(data) {
  return jsonFetch(`${API_BASE}/records`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function submitAppointment(data) {
  return jsonFetch(`${API_BASE}/appointments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function sendChat(message) {
  return jsonFetch(`${API_BASE}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

