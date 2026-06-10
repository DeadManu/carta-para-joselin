const canvas = document.getElementById("fondo");
const ctx = canvas.getContext("2d");
const btnAbrir = document.getElementById("btnAbrir");

let w;
let h;
let particles = [];

function ajustarCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  crearParticulas();
}

function puntoCorazon(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x, y };
}

function crearParticulas() {
  particles = [];

  const total = window.innerWidth < 520 ? 260 : 520;
  const escala = window.innerWidth < 520 ? 9 : 15;

  for (let i = 0; i < total; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = puntoCorazon(t);

    particles.push({
      baseX: w / 2 + p.x * escala,
      baseY: h / 2 + p.y * escala,
      size: Math.random() * 2.5 + 0.7,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.018 + 0.006,
      alpha: Math.random() * 0.65 + 0.25
    });
  }
}

function animarFondo() {
  ctx.clearRect(0, 0, w, h);

  for (const p of particles) {
    p.angle += p.speed;

    const dx = Math.cos(p.angle) * 10;
    const dy = Math.sin(p.angle) * 10;

    ctx.beginPath();
    ctx.arc(p.baseX + dx, p.baseY + dy, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 73, 145, ${p.alpha})`;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ff4f91";
    ctx.fill();
  }

  requestAnimationFrame(animarFondo);
}

function crearCorazonFlotante(simbolo = "❤") {
  const c = document.createElement("div");

  c.className = "corazon-flotante";
  c.textContent = simbolo;
  c.style.left = Math.random() * 100 + "vw";
  c.style.fontSize = 13 + Math.random() * 27 + "px";
  c.style.animationDuration = 5 + Math.random() * 6 + "s";

  document.body.appendChild(c);

  setTimeout(() => c.remove(), 12000);
}

function lluviaEspecial() {
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      crearCorazonFlotante(Math.random() > 0.45 ? "❤" : "♡");
    }, i * 70);
  }
}

btnAbrir.addEventListener("click", lluviaEspecial);

setInterval(() => {
  const simbolos = ["❤", "♡", "✦"];
  crearCorazonFlotante(simbolos[Math.floor(Math.random() * simbolos.length)]);
}, 650);

window.addEventListener("resize", ajustarCanvas);

ajustarCanvas();
animarFondo();
