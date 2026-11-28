(function(){
 var doc=document,body=doc.body||doc.documentElement;
 var start=(body.getAttribute('data-lang')||'zh')==='en';
 function apply(en){
  doc.documentElement.lang=en?'en':'zh-CN';
  doc.title=en?'SellerPilot — Everyone takes a role in foreign trade':'SellerPilot — 让每个人在外贸里承担一个角色';
  doc.querySelectorAll('[data-zh]').forEach(function(el){var t=el.getAttribute(en?'data-en':'data-zh');if(t!==null)el.innerHTML=t;});
  doc.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',(b.getAttribute('data-l')==='en')===en);});
 }
 doc.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){apply(b.getAttribute('data-l')==='en')});});
 apply(start);
 var nav=doc.getElementById('nav');function sc(){if(nav)nav.classList.toggle('scrolled',window.scrollY>10)}window.addEventListener('scroll',sc,{passive:true});sc();
})();