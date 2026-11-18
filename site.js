// Meteor shower background + footer year
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.createElement("canvas");
  canvas.id = "meteor-shower";
  document.body.prepend(canvas);
  var ctx = canvas.getContext("2d");
  var dpr = window.devicePixelRatio || 1;
  var W, H, meteors = [];
  var colors = ["#c4b5fd", "#93c5fd", "#86efac", "#f9a8d4", "#fde68a"];

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function spawn() {
    var speed = 4 + Math.random() * 4;
    meteors.push({
      x: Math.random() * W * 1.2,
      y: -20,
      vx: -speed * 0.6,
      vy: speed,
      len: 60 + Math.random() * 80,
      color: colors[(Math.random() * colors.length) | 0],
    });
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    if (Math.random() < 0.03 && meteors.length < 6) spawn();
    meteors = meteors.filter(function (m) {
      m.x += m.vx; m.y += m.vy;
      var mag = Math.hypot(m.vx, m.vy);
      var tx = m.x - (m.vx / mag) * m.len, ty = m.y - (m.vy / mag) * m.len;
      var g = ctx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, m.color);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
      return m.y - m.len < H && m.x + m.len > 0;
    });
    requestAnimationFrame(tick);
  }
  tick();
});
