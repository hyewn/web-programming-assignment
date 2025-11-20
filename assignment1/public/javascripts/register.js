const idInput = document.getElementById('reg-id');
const idMsg = document.getElementById('id-msg');
const pw1 = document.getElementById('pw1');
const pw2 = document.getElementById('pw2');
const pwMsg = document.getElementById('pw-msg');
const btnIdCheck = document.getElementById('btn-id-check');
const btnSubmit = document.getElementById('btn-submit');

let idOk = false, pwOk = false;

async function checkIdDup() {
  const id = idInput.value.trim();
  if (!id) { idMsg.textContent = 'ID를 입력하세요.'; idOk=false; update(); return; }
  const res = await fetch(`/api/users/check?id=${encodeURIComponent(id)}`);
  const { available } = await res.json();
  if (available) { idMsg.textContent = '사용 가능한 ID입니다.'; idOk = true; }
  else { idMsg.textContent = '이미 존재하는 ID입니다.'; idOk = false; }
  update();
}

function checkPw() {
  if (!pw1.value || !pw2.value) { pwMsg.textContent=''; pwOk=false; }
  else if (pw1.value === pw2.value) { pwMsg.textContent='비밀번호가 일치합니다.'; pwOk=true; }
  else { pwMsg.textContent='비밀번호가 일치하지 않습니다.'; pwOk=false; }
  update();
}

function update(){ btnSubmit.disabled = !(idOk && pwOk); }

btnIdCheck.addEventListener('click', checkIdDup);
pw2.addEventListener('blur', checkPw);
pw1.addEventListener('input', checkPw);
pw2.addEventListener('input', checkPw);
idInput.addEventListener('input', ()=>{ idOk=false; idMsg.textContent=''; update(); });
