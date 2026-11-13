let en=false;
function toggleLang(){
  en=!en;
  document.documentElement.lang=en?'en':'zh-CN';
  document.getElementById('langBtn').textContent=en?'中文':'EN';
  document.querySelectorAll('[data-zh]').forEach(el=>{
    const t=el.getAttribute(en?'data-en':'data-zh');
    if(el.tagName==='TITLE'){document.title=t;return}
    el.innerHTML=t;
  });
}
