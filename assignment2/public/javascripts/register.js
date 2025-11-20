import { saveToken } from './auth.js';
const idInput=document.getElementById('reg-id');
const idMsg=document.getElementById('id-msg');
const pw1=document.getElementById('pw1');
const pw2=document.getElementById('pw2');
const realname=document.getElementById('realname');
const pwMsg=document.getElementById('pw-msg');
const btnIdCheck=document.getElementById('btn-id-check');
const btnSubmit=document.getElementById('btn-submit');
let idOk=false, pwOk=false;

async function checkIdDup(){
  const id=idInput.value.trim();
  if(!id){ idMsg.textContent='ID를 입력하세요.'; idOk=false; update(); return; }
  const r=await fetch(`/api/auth/check?id=${encodeURIComponent(id)}`);
  const { available }=await r.json();
  idMsg.textContent=available?'사용 가능':'이미 존재하는 ID입니다.';
  idOk=!!available; update();
}
function checkPw(){
  if(!pw1.value||!pw2.value){ pwMsg.textContent=''; pwOk=false; }
  else if(pw1.value===pw2.value){ pwMsg.textContent='비밀번호가 일치합니다.'; pwOk=true; }
  else { pwMsg.textContent='비밀번호가 일치하지 않습니다.'; pwOk=false; }
  update();
}
function update(){ btnSubmit.disabled=!(idOk&&pwOk&&realname.value.trim()); }
btnIdCheck.addEventListener('click',checkIdDup);
pw1.addEventListener('input',checkPw);
pw2.addEventListener('input',checkPw);
idInput.addEventListener('input',()=>{ idOk=false; idMsg.textContent=''; update(); });

document.getElementById('regForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const r=await fetch('/api/auth/register',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      id:idInput.value.trim(),
      pw1:pw1.value, pw2:pw2.value,
      realname:realname.value.trim() })
  });
  if(!r.ok){ alert('회원가입 실패'); return; }
  const { token } = await r.json();
  saveToken(token); location.href='/home';
});
