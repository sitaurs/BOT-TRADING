async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  options.headers = options.headers || {};
  if (token) options.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function loadStatus() {
  try {
    const data = await api('/status');
    document.getElementById('content').innerText = data.message || JSON.stringify(data);
  } catch (e) {
    document.getElementById('content').innerText = 'Error: ' + e.message;
  }
}

if (location.pathname.endsWith('index.html') || location.pathname === '/') {
  loadStatus();
}

async function insertHeader() {
  const el = document.getElementById('header');
  if (!el) return;
  try {
    const res = await fetch('header.html');
    if (res.ok) {
      el.innerHTML = await res.text();
    }
  } catch (e) {
    console.error('Failed to load header', e);
  }
}

document.addEventListener('DOMContentLoaded', insertHeader);
