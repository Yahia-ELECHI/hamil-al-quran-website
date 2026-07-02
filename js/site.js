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
