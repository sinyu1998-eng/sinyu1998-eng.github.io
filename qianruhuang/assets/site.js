(function(){
  var doc=document, body=doc.body||doc.documentElement;
  var start=(body.getAttribute('data-lang')||'zh')==='en';
  var cur=start;
  function apply(en){
    doc.documentElement.lang=en?'en':'zh-CN';
    var titleMap={
      'index.html':[ '小黄 · Qianru (Carol) Huang — 个人主页','Xiao Huang · Qianru (Carol) Huang — Personal Website' ],
      'profile.html':[ '档案 · Qianru (Carol) Huang','Profile · Qianru (Carol) Huang' ],
      'creative.html':[ '创作 · Qianru (Carol) Huang','Creative · Qianru (Carol) Huang' ],
      'connect.html':[ '联系 · Qianru (Carol) Huang','Contact · Qianru (Carol) Huang' ]
    };
    var file=location.pathname.split('/').pop()||'index.html';
    if(titleMap[file]) doc.title=titleMap[file][en?1:0];
    doc.querySelectorAll('[data-zh]').forEach(function(el){
      var t=el.getAttribute(en?'data-en':'data-zh'); if(t!==null) el.innerHTML=t;
    });
    doc.querySelectorAll('.lang button').forEach(function(b){
      b.classList.toggle('on',(b.getAttribute('data-l')==='en')===en);
    });
    cur=en;
  }
  doc.querySelectorAll('.lang button').forEach(function(b){
    b.addEventListener('click',function(){apply(b.getAttribute('data-l')==='en')});
  });
  apply(start);
})();
