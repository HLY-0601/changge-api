const CATS={img:"图片壁纸",quote:"语录文案",hot:"热榜",tool:"工具",intl:"国外API"};
let cur="all";
const $=s=>document.querySelector(s);
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1600)}
function copy(t){navigator.clipboard.writeText(t).then(()=>toast("已复制"),()=>{const x=document.createElement("textarea");x.value=t;document.body.appendChild(x);x.select();document.execCommand("copy");x.remove();toast("已复制")})}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function closeOv(){$("#ov").classList.remove("show")}
$("#ov").onclick=e=>{if(e.target.id==="ov")closeOv()};
function findImg(o){
 if(typeof o==="string"){const t=o.trim();if(/^https?:\/\/\S+\.(jpg|jpeg|png|gif|webp|svg)(\?\S*)?$/i.test(t))return t;return null}
 if(Array.isArray(o)){for(const v of o){const r=findImg(v);if(r)return r}}
 else if(o&&typeof o==="object"){
  const pref=["url","file","image","img","photo","thumbnail","message","imageUrl","strDrinkThumb"];
  for(const k of pref){if(k in o){const r=findImg(o[k]);if(r)return r}}
  for(const k in o){const r=findImg(o[k]);if(r)return r}}
 return null}
async function preview(url){
 toast("加载中…");
 try{
  const res=await fetch(url,{redirect:"follow"});
  const ct=res.headers.get("content-type")||"";
  if(ct.includes("image")){showImg(url,"图片");return}
  const txt=await res.text();
  let js=null;try{js=JSON.parse(txt)}catch(e){}
  if(js){const im=findImg(js);if(im){showImg(im,"图片");return}showText(JSON.stringify(js,null,2),"返回结果")}
  else{const t=txt.trim();if(/^https?:\/\/\S+\.(jpg|jpeg|png|gif|webp|svg)(\?\S*)?$/i.test(t)){showImg(t,"图片");return}showText(txt,"返回结果")}
 }catch(e){toast("该接口不支持页内预览，已打开新窗口");window.open(url,"_blank")}}
function showImg(u,t){$("#ovc").innerHTML="<h4>"+esc(t)+"</h4><img src=\""+u+"\" alt=\"preview\">";$("#ov").classList.add("show")}
function showText(t,c){$("#ovc").innerHTML="<h4>"+esc(c)+"</h4><pre>"+esc(t)+"</pre>";$("#ov").classList.add("show")}
function chips(){
 const c={};DATA.forEach(i=>c[i[2]]=(c[i[2]]||0)+1);
 let h='<span class="chip on" data-c="all">全部 '+DATA.length+'</span>';
 Object.keys(c).forEach(k=>h+='<span class="chip" data-c="'+k+'">'+(CATS[k]||k)+' '+c[k]+'</span>');
 $("#chips").innerHTML=h;
 document.querySelectorAll(".chip").forEach(x=>x.onclick=()=>{document.querySelectorAll(".chip").forEach(y=>y.classList.remove("on"));x.classList.add("on");cur=x.dataset.c;render()})}
function render(){
 const q=$("#search").value.trim().toLowerCase();
 const l=DATA.filter(i=>(cur==="all"||i[2]===cur)&&(!q||(i[0]+i[3]+(CATS[i[2]]||"")).toLowerCase().includes(q)));
 if(!l.length){$("#grid").innerHTML='<p style="padding:60px;color:#6b7698">没有找到匹配接口</p>';return}
 let h="";
 l.forEach(i=>{const n=i[0],p=i[1],d=i[3];
  h+='<div class="card"><div class="cat">'+(CATS[i[2]]||i[2])+'</div><h3>'+n+'</h3><p>'+d+'</p><div class="ep">'+p+'</div><div class="row"><button class="btn p" onclick="preview(\''+p+'\')">预览</button><button class="btn" onclick="copy(\''+p+'\')">复制</button><a class="btn" target="_blank" href="'+p+'">原始</a></div></div>'});
 $("#grid").innerHTML=h}
$("#search").oninput=render;
$("#s1").textContent=DATA.length;$("#s2").textContent=Object.keys(CATS).filter(k=>DATA.some(i=>i[2]===k)).length;
chips();render();
