const canvas = document.getElementById("fondo");
const ctx = canvas.getContext("2d");
const btnAbrir = document.getElementById("btnAbrir");
const contador = document.getElementById("contador");

let w;
let h;
let particles = [];

/*
  CONTADOR QUE NO SE REINICIA AL ACTUALIZAR LA PÁGINA

  Duración configurada:
  365 días + 24 horas + 60 segundos.

  La primera vez que se abre la página, se guarda la fecha final
  en el navegador usando localStorage. Así, aunque se actualice la página,
  el contador continuará desde donde debe ir.
*/

const DURACION_CONTADOR =
  ((365 * 24 * 60 * 60) +  // 365 días
  (24 * 60 * 60) +         // 24 horas
  60) * 1000;              // 60 segundos, convertido todo a milisegundos

const CLAVE_FECHA_FINAL = "fechaFinalContadorJoselin";

let fechaFinalGuardada = localStorage.getItem(CLAVE_FECHA_FINAL);

if (!fechaFinalGuardada) {
  fechaFinalGuardada = Date.now() + DURACION_CONTADOR;
  localStorage.setItem(CLAVE_FECHA_FINAL, fechaFinalGuardada);
}

const fechaFinal = Number(fechaFinalGuardada);

function actualizarContador() {
  const ahora = Date.now();
  const tiempoRestante = fechaFinal - ahora;

  if (tiempoRestante <= 0) {
    contador.innerHTML = `
      <div class="tiempo" style="grid-column: 1 / -1;">
        <span class="numero">❤️</span>
        <span class="etiqueta">El tiempo terminó, pero nunca borrará lo que siento por ti.</span>
      </div>
    `;
    return;
  }

  const totalSegundos = Math.floor(tiempoRestante / 1000);
  const dias = Math.floor(totalSegundos / 86400);
  const horas = Math.floor((totalSegundos % 86400) / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  contador.innerHTML = `
    <div class="tiempo">
      <span class="numero">${dias}</span>
      <span class="etiqueta">Días</span>
    </div>

    <div class="tiempo">
      <span class="numero">${horas}</span>
      <span class="etiqueta">Horas</span>
    </div>

    <div class="tiempo">
      <span class="numero">${minutos}</span>
      <span class="etiqueta">Minutos</span>
    </div>

    <div class="tiempo">
      <span class="numero">${segundos}</span>
      <span class="etiqueta">Segundos</span>
    </div>
  `;
}

setInterval(actualizarContador, 1000);
actualizarContador();

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
