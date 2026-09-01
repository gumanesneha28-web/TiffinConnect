const messes=[
{id:1,name:"Shree Home Mess",type:"both",rating:4.8,distance:"0.8 km",image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",daily:80,weekly:500,monthly:2000},
{id:2,name:"Annapurna Kitchen",type:"veg",rating:4.7,distance:"1.2 km",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",daily:75,weekly:480,monthly:1850},
{id:3,name:"Ghar Ka Swad",type:"nonveg",rating:4.6,distance:"1.6 km",image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",daily:90,weekly:560,monthly:2250},
{id:4,name:"Campus Tadka",type:"both",rating:4.5,distance:"0.5 km",image:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",daily:70,weekly:450,monthly:1799},
{id:5,name:"Maa's Kitchen",type:"veg",rating:4.9,distance:"2.1 km",image:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",daily:85,weekly:520,monthly:2100},
{id:6,name:"Desi Zaika",type:"both",rating:4.6,distance:"1.9 km",image:"https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80",daily:88,weekly:540,monthly:2199}
];

function getData(k,f){try{const v=JSON.parse(localStorage.getItem(k));return v===null?f:v}catch{return f}}
function setData(k,v){localStorage.setItem(k,JSON.stringify(v))}
function currentDate(){return new Date().toDateString()}

/* Important: every dated notice is checked whenever a page opens.
   Old notices are deleted from LocalStorage automatically. */
function cleanExpiredData(){
  const today=currentDate();
  ['tiffinStatus','siteNotice','menu'].forEach(k=>{
    const item=getData(k,null);
    if(item && item.date && item.date!==today) localStorage.removeItem(k);
  });
}
cleanExpiredData();

function getSession(){return getData('session',null)}
function requireRole(role){
  cleanExpiredData();
  const s=getSession();
  if(!s||s.role!==role){location.href='login.html?role='+role;return false}
  return true
}
function logout(){localStorage.removeItem('session');localStorage.removeItem('currentUser');location.href='index.html'}
function scrollToSection(id){document.getElementById(id)?.scrollIntoView({behavior:'smooth'})}

function showAnnouncement(){
  cleanExpiredData();
  const box=document.getElementById('announcement');if(!box)return;
  const status=getData('tiffinStatus',null),notice=getData('siteNotice',null);
  let html='';
  if(status&&status.status!=='on-time') html=`⚠️ <b>Today's tiffin update:</b> ${status.message}<small class="update-time">Published ${status.time||''}</small>`;
  else if(notice) html=`📣 <b>Today's notice:</b> ${notice.message}<small class="update-time">Published ${notice.time||''}</small>`;
  if(html){box.innerHTML=html;box.classList.add('show')}
}

function refreshNav(){
 const s=getSession(),login=document.getElementById('navLogin'),join=document.getElementById('navJoin');
 if(!login||!join)return;
 if(s){
   login.textContent='Dashboard';
   login.href=s.role==='student'?'dashboard.html':s.role==='owner'?'owner.html':'admin.html';
   join.textContent='Logout';join.href='#';join.onclick=e=>{e.preventDefault();logout()};
 }
}

function renderMesses(filter='all'){
 const grid=document.getElementById('messGrid');if(!grid)return;
 const price=document.getElementById('priceFilter')?.value||'all';
 const arr=messes.filter(m=>(filter==='all'||m.type===filter)&&(price==='all'||m.monthly<=Number(price)));
 grid.innerHTML=arr.map(m=>`<article class="mess-card" onclick="chooseMess(${m.id})"><div class="mess-img"><img src="${m.image}" alt="${m.name}"><span class="tag">${m.type==='both'?'VEG + NON-VEG':m.type==='veg'?'VEG':'NON-VEG'}</span></div><div class="mess-info"><h3>${m.name}</h3><div class="mess-meta"><span>★ ${m.rating}</span><span>•</span><span>⌖ ${m.distance}</span></div><div class="price-row"><div><strong>₹${m.monthly}</strong><small>monthly</small></div><button class="btn btn-dark" type="button">View ↗</button></div></div></article>`).join('');
 document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderMesses(b.dataset.filter)});
 const pf=document.getElementById('priceFilter');if(pf)pf.onchange=()=>renderMesses(document.querySelector('.filter.active')?.dataset.filter||'all');
}
function chooseMess(id){
 const s=getSession();if(!s||s.role!=='student'){location.href='login.html?mode=signup';return}
 const user=getData('currentUser',null),m=messes.find(x=>x.id===id);if(!user)return;
 const type=prompt(`Choose a plan for ${m.name}: daily / weekly / monthly`,'monthly');
 if(!type)return;const t=type.toLowerCase();if(!['daily','weekly','monthly'].includes(t)){alert('Please enter daily, weekly or monthly.');return}
 const food=confirm('Press OK for VEG. Press Cancel for NON-VEG.')?'veg':'nonveg';
 user.plan={mess:m.name,type:t[0].toUpperCase()+t.slice(1),price:m[t],food,date:currentDate()};
 const users=getData('users',[]).map(x=>x.id===user.id?user:x);setData('users',users);setData('currentUser',user);
 location.href='dashboard.html';
}
function showToast(text){
 let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t)}
 t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400);
}
