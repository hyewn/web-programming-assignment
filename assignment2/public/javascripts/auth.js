export const tokenKey = 'access_token';

export const saveToken  = (t) => localStorage.setItem(tokenKey, t);
export const getToken   = () => localStorage.getItem(tokenKey);
export const clearToken = () => localStorage.removeItem(tokenKey);

export async function fetchAuth(url, opt = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opt.headers || {}) };
  const t = getToken();
  if (t) headers.Authorization = 'Bearer ' + t;

  const res = await fetch(url, { ...opt, headers });
  if (res.status === 401 || res.status === 419) {
    clearToken();
    if (!location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')) {
      location.href = '/login';
    }
    return null;
  }
  return res;
}

export async function ensureLogin() {
  const t = getToken();
  if (!t) { location.href = '/login'; return null; }
  const r = await fetchAuth('/api/auth/me');
  if (!r) return null;
  if (!r.ok) { clearToken(); location.href = '/login'; return null; }
  return r.json();
}

export function doLogout() {
  clearToken();
  location.href = '/login';
}
