// Comportements partagés par toutes les pages du site
// Nav scroll state
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});
// Burger
const burger=document.getElementById('burger'),links=document.getElementById('navlinks');
burger.addEventListener('click',()=>links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
// Reveal on scroll
const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// Phone carousel (auto) — présent uniquement sur l'accueil
const track=document.getElementById('track');
if(track){let i=0;const n=track.children.length;setInterval(()=>{i=(i+1)%n;track.style.transform=`translateX(-${i*100}%)`;},2600);}

// Tutoriels — carrousel + lecteur (uniquement sur l'accueil)
// Miroir du carrousel de l'app : auto-défilement 5 s avec pause à
// l'interaction, effet de perspective (échelle/opacité selon la distance
// au centre), vignette + bouton play + titre. Lecture via youtube-nocookie
// avec rel=0 et contexte playlist → les suggestions restent sur la chaîne.
const tuto=document.getElementById('tutoriels');
if(tuto){
  const tabs=[...tuto.querySelectorAll('.tuto-tab')];
  const tracks=[...tuto.querySelectorAll('.tuto-track')];
  const carousel=tuto.querySelector('.tuto-carousel');
  const plLink=tuto.querySelector('.tuto-yt');
  const activeTrack=()=>tracks.find(t=>!t.hidden);

  // Perspective : échelle + fondu selon la distance au centre du carrousel
  let raf=0;
  function coverflow(t){
    const r=t.getBoundingClientRect(),cx=r.left+r.width/2;
    t.querySelectorAll('.tuto-card').forEach(c=>{
      const cr=c.getBoundingClientRect();
      const d=Math.min(Math.abs(cr.left+cr.width/2-cx)/r.width,.6);
      c.style.transform=`scale(${(1-d*.22).toFixed(3)})`;
      c.style.opacity=(1-d*.55).toFixed(3);
    });
  }
  tracks.forEach(t=>{
    t.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>coverflow(t))},{passive:true});
    coverflow(t);
  });
  addEventListener('resize',()=>coverflow(activeTrack()));

  // Avancer/reculer d'une carte, en boucle
  function step(dir){
    const t=activeTrack(),card=t.querySelector('.tuto-card');
    if(!card)return;
    const w=card.getBoundingClientRect().width+18;
    const max=t.scrollWidth-t.clientWidth;
    let x=t.scrollLeft+dir*w;
    if(dir>0&&t.scrollLeft>=max-8)x=0;
    if(dir<0&&t.scrollLeft<=8)x=max;
    t.scrollTo({left:x,behavior:'smooth'});
  }
  tuto.querySelector('.tuto-nav.prev').addEventListener('click',()=>{step(-1);restartAuto()});
  tuto.querySelector('.tuto-nav.next').addEventListener('click',()=>{step(1);restartAuto()});

  // Auto-défilement (5 s), pause au survol/toucher — comme dans l'app
  let timer=0;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function restartAuto(){clearInterval(timer);if(!reduced)timer=setInterval(()=>step(1),5000)}
  ['pointerenter','pointerdown','focusin'].forEach(ev=>carousel.addEventListener(ev,()=>clearInterval(timer)));
  carousel.addEventListener('pointerleave',restartAuto);
  restartAuto();

  // Onglets (une playlist par onglet)
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(b=>b.classList.toggle('active',b===tab));
    tracks.forEach(t=>{t.hidden=t.dataset.pl!==tab.dataset.pl});
    const t=activeTrack();
    t.scrollTo({left:0});
    coverflow(t);
    if(plLink)plLink.href='https://www.youtube.com/playlist?list='+t.dataset.list;
    restartAuto();
  }));

  // Lecteur modal
  const modal=document.querySelector('.tuto-modal');
  const holder=modal.querySelector('.tuto-player');
  const ytLink=modal.querySelector('.tuto-open-yt');
  function openVideo(v,list){
    holder.innerHTML='';
    const f=document.createElement('iframe');
    f.src=`https://www.youtube-nocookie.com/embed/${v}?list=${list}&rel=0&autoplay=1&playsinline=1&color=white`;
    f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen=true;
    f.title='Tutoriel Hamil Al-Quran';
    holder.appendChild(f);
    ytLink.href=`https://www.youtube.com/watch?v=${v}&list=${list}`;
    modal.hidden=false;
    document.body.style.overflow='hidden';
    clearInterval(timer);
  }
  function closeVideo(){
    modal.hidden=true;
    holder.innerHTML='';           // stoppe la lecture
    document.body.style.overflow='';
    restartAuto();
  }
  tuto.querySelectorAll('.tuto-card').forEach(c=>c.addEventListener('click',()=>openVideo(c.dataset.video,c.dataset.list)));
  modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.tuto-close'))closeVideo()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeVideo()});
}
