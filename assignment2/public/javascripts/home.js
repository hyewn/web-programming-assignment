import { ensureLogin, doLogout } from './auth.js';

(async () => {
  const me = await ensureLogin();
  if (!me) return;
  document.getElementById('who').textContent = `${me.username} (${me.realname})`;
  document.getElementById('submitter').textContent = `${(window.SUBMITTER_NAME || '')}`;
})();

document.getElementById('btn-logout').addEventListener('click', doLogout);
