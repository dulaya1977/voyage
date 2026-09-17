(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.querySelector('#hero-chart');
  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-link');
  document.documentElement.classList.add('motion-ready');
  skipLink?.addEventListener('click', () => window.requestAnimationFrame(() => mainContent?.focus({ preventScroll: true })));
  const reveal = () => {
    const nodes = document.querySelectorAll('.reveal');
    if (reduceMotion.matches || !('IntersectionObserver' in window)) { nodes.forEach(node => node.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .16 });
    nodes.forEach(node => observer.observe(node));
  };
  function drawHeroChart() {
    if (!canvas) return;
    const context = canvas.getContext('2d'); if (!context) return;
    let animationId = 0;
    const points = [[.06,.84],[.18,.76],[.31,.68],[.44,.59],[.56,.51],[.67,.42],[.78,.30],[.93,.18]];
    const stop = () => { if (animationId) window.cancelAnimationFrame(animationId); animationId = 0; };
    const render = timestamp => {
      const { width, height } = canvas.getBoundingClientRect(); if (!width || !height) return;
      const t = reduceMotion.matches ? 0 : timestamp / 1000;
      context.clearRect(0, 0, width, height); context.fillStyle = '#071f2b'; context.fillRect(0, 0, width, height);
      context.strokeStyle = 'rgba(128,205,230,.16)'; context.lineWidth = 1;
      for (let x=0;x<width;x+=72) { context.beginPath(); context.moveTo(x,0); context.lineTo(x,height); context.stroke(); }
      for (let y=0;y<height;y+=72) { context.beginPath(); context.moveTo(0,y); context.lineTo(width,y); context.stroke(); }
      context.fillStyle = 'rgba(102,176,202,.12)'; context.beginPath(); context.moveTo(width*.76,0); context.bezierCurveTo(width*.62,height*.18,width*.84,height*.34,width*.67,height*.48); context.bezierCurveTo(width*.56,height*.62,width*.72,height*.78,width*.59,height); context.lineTo(width,height); context.lineTo(width,0); context.closePath(); context.fill();
      const route = points.map(([x,y]) => [x*width,y*height]); const safetyCenter = route[6]; const radius = Math.min(width,height);
      [[.18,'rgba(255,171,171,.13)'],[.29,'rgba(255,226,190,.11)'],[.4,'rgba(166,226,188,.08)']].forEach(([scale,fill]) => { context.beginPath(); context.arc(safetyCenter[0],safetyCenter[1],radius*scale,0,Math.PI*2); context.fillStyle=fill; context.fill(); });
      context.beginPath(); route.forEach(([x,y],i) => i ? context.lineTo(x,y) : context.moveTo(x,y)); context.strokeStyle='#4eb3df'; context.lineWidth=3; context.stroke(); context.setLineDash([5,10]); context.strokeStyle='rgba(194,238,248,.46)'; context.lineWidth=1; context.stroke(); context.setLineDash([]);
      route.forEach(([x,y],i) => { const pulse=1+Math.sin(t*2.2+i)*.15; const dummy=i===4; const aground=i===6; if(dummy||aground){context.beginPath();context.arc(x,y,(aground?13:10)*pulse,0,Math.PI*2);context.strokeStyle=aground?'rgba(255,105,96,.78)':'rgba(255,189,112,.68)';context.lineWidth=1.5;context.stroke();}context.beginPath();context.arc(x,y,5.5*pulse,0,Math.PI*2);context.fillStyle=aground?'#ff7169':(dummy?'#ffbd70':'#f6fcfe');context.fill();context.lineWidth=2;context.strokeStyle=aground?'#b63831':'#1b7fa9';context.stroke();if(i===1||dummy||aground){context.fillStyle='rgba(233,249,252,.82)';context.font='700 10px Segoe UI,Arial,sans-serif';context.fillText(dummy?'DUMMY CHECK':(aground?'AGROUND':'WP '+String(i+12).padStart(2,'0')),x+12,y-10);}});
      const travel=(t*.09)%1, position=travel*(route.length-1), index=Math.floor(position), amount=position-index, start=route[index], end=route[Math.min(index+1,route.length-1)], x=start[0]+(end[0]-start[0])*amount, y=start[1]+(end[1]-start[1])*amount;
      context.beginPath();context.arc(x,y,16+Math.sin(t*3)*3,0,Math.PI*2);context.strokeStyle='rgba(133,224,246,.66)';context.lineWidth=1.5;context.stroke();context.beginPath();context.arc(x,y,4,0,Math.PI*2);context.fillStyle='#fff';context.fill();
      if(!reduceMotion.matches) animationId=window.requestAnimationFrame(render);
    };
    const resize = () => { stop(); const rect=canvas.getBoundingClientRect(), ratio=Math.min(window.devicePixelRatio||1,2); canvas.width=Math.max(1,Math.round(rect.width*ratio)); canvas.height=Math.max(1,Math.round(rect.height*ratio)); context.setTransform(ratio,0,0,ratio,0,0); render(performance.now()); };
    window.addEventListener('resize',resize,{passive:true}); reduceMotion.addEventListener?.('change',resize); resize();
  }
  reveal(); drawHeroChart();
})();
