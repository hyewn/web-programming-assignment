import { saveToken, getToken } from './auth.js';

if (getToken()) { location.href = '/home'; }

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('id').value.trim();
  const pw = document.getElementById('pw').value;
  const err = document.getElementById('login-error');
  err.textContent = '';

  const r = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, pw })
  });

  if (!r.ok) {
    err.textContent = 'ID/PW가 올바르지 않습니다.';
    return;
  }
  const { token } = await r.json();
  saveToken(token);
  location.href = '/home';
});
