/* =========================================================
   THE ETERNAL PAGE · script.js
   1. MEMORIES: the 12 pieces of me on the wheel (edit freely!)
   2. the wheel   3. the book   4. the starry sky
   ========================================================= */

// 1. MEMORIES ------------------------------------------------
// One per numeral on the wheel, I to XII. Change the title and text to anything.
const MEMORIES = [
  { title: "Dr. Phaidei",        text: "3 PhDs in Phaideiology. Phainon × Mydei, forever and always." },
  { title: "The Archive",        text: "When AO3 went down I built a home for 435 Phaidei fics. Khaslana could never burn this library." },
  { title: "The Lost Phone",     text: "An AU you play through Phainon's phone, found in the sand at Aedes Elysiae. The passcode is a clue." },
  { title: "CS Major",           text: "I study computer science, but honestly I learn the most building fandom websites at 2am." },
  { title: "Honkai: Star Rail",  text: "Where it all started. Amphoreus has my whole heart, and its UI is the reason this page looks like a book." },
  { title: "Anime",              text: "Link Click, ORV, Alien Stage, WHA, Blue Lock, BSD, JJK, and a bunch of others." },
  { title: "Kpop !!",            text: "Stray Kids (Lee Know), Jungkook (solo) and PLAVE (Hamin)." },
  { title: "Vtubers !!",         text: "Claude (!!), Kaelix, Doppio, Kenji and Leo." },
  { title: "Gacha games !!",     text: "Wuthering Waves, HSR, LADS, Project Sekai, and Genshin I guess." },
  { title: "On repeat",          text: "The 6th Summer by PLAVE, SHADE by NIJISANJI EN, and Phobia by Stray Kids." },
  { title: "Kooguang",           text: "That's me on Twitter, yapping about Phaidei. Come say hi and tell me which ending you got." },
  { title: "No AI, no ads",      text: "Everything I make is handmade and free. I ask authors first, and I take anything down if they ask." },
];

// 2. THE WHEEL -----------------------------------------------
const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
const dial = document.getElementById("dial");
const sun = document.getElementById("sun");
const spokes = document.getElementById("spokes");
const links = document.getElementById("links");
const rays = document.getElementById("rays");
const memNum = document.getElementById("mem-num");
const memTitle = document.getElementById("mem-title");
const memText = document.getElementById("mem-text");
const memCount = document.getElementById("mem-count");
const memBar = document.getElementById("mem-bar");
const memDone = document.getElementById("mem-done");

const N = MEMORIES.length;
const found = [];          // the order you recovered them in
let rotation = 0;          // current wheel rotation in degrees
const nodes = [];

// sun rays and spokes (drawn once)
for (let i = 0; i < 24; i++) {
  const a = (i * 360) / 24, long = i % 2 === 0;
  rays.insertAdjacentHTML("beforeend",
    `<polygon points="-6,-50 6,-50 0,${long ? -96 : -78}" transform="rotate(${a})"/>`);
}
for (let i = 0; i < N; i++) {
  const a = (i * 2 * Math.PI) / N;
  spokes.insertAdjacentHTML("beforeend",
    `<line x1="${Math.sin(a) * 60}" y1="${-Math.cos(a) * 60}" x2="${Math.sin(a) * 236}" y2="${-Math.cos(a) * 236}"/>`);
}

// the 12 buttons
MEMORIES.forEach((m, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "node";
  b.style.setProperty("--a", `${(i * 360) / N}deg`);
  b.textContent = ROMAN[i];
  b.setAttribute("aria-label", `Memory ${ROMAN[i]}: ${m.title}`);
  b.addEventListener("click", () => recover(i));
  dial.appendChild(b);
  nodes.push(b);
});

function point(i) {
  const a = (i * 2 * Math.PI) / N, r = 205;
  return [Math.sin(a) * r, -Math.cos(a) * r];
}

function recover(i) {
  // turn the wheel the short way so the chosen memory sits at the top
  const target = -(i * 360) / N;
  let diff = ((target - rotation) % 360 + 540) % 360 - 180;
  rotation += diff;
  dial.style.setProperty("--rot", `${rotation}deg`);

  nodes.forEach((n, k) => n.classList.toggle("on", k === i));
  if (!found.includes(i)) {
    found.push(i);
    nodes[i].classList.add("found");
    // draw the constellation line from the last memory to this one
    if (found.length > 1) {
      const [x1, y1] = point(found[found.length - 2]);
      const [x2, y2] = point(i);
      links.insertAdjacentHTML("beforeend", `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    }
  }
  memNum.textContent = `Memory ${ROMAN[i]}`;
  memTitle.textContent = MEMORIES[i].title;
  memText.textContent = MEMORIES[i].text;
  memCount.textContent = `${found.length} / ${N} recovered`;
  memBar.style.width = `${(found.length / N) * 100}%`;
  memDone.hidden = found.length < N;
}

sun.addEventListener("click", () => {
  nodes.forEach(n => n.classList.remove("on"));
  memNum.textContent = "Prologue";
  memTitle.textContent = "Twelve memories, scattered";
  memText.textContent = "Each numeral on the wheel holds a little piece of me. Recover all twelve to finish the page.";
});

// 3. THE BOOK ------------------------------------------------
const spreads = [...document.querySelectorAll(".spread")];
const dots = document.getElementById("dots");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const tip = document.getElementById("tip");
let pageAt = 0;
spreads.forEach(() => dots.appendChild(document.createElement("span")));

function showPage(p) {
  if (p < 0 || p >= spreads.length) return;
  spreads.forEach((s, k) => { s.hidden = k !== p; });
  const s = spreads[p];
  s.classList.remove("turning"); void s.offsetWidth; s.classList.add("turning");
  [...dots.children].forEach((d, k) => d.classList.toggle("on", k === p));
  prev.disabled = p === 0;
  next.disabled = p === spreads.length - 1;
  tip.textContent = p === spreads.length - 1 ? "The end of the foreword. On to the chapters ↓" : "Tap the page to continue";
  pageAt = p;
}
spreads.forEach(s => s.addEventListener("click", e => {
  if (e.target.closest("a")) return;            // let links work
  showPage(pageAt === spreads.length - 1 ? 0 : pageAt + 1);
}));
prev.addEventListener("click", () => showPage(pageAt - 1));
next.addEventListener("click", () => showPage(pageAt + 1));
document.getElementById("book").addEventListener("keydown", e => {
  if (e.key === "ArrowRight") showPage(pageAt + 1);
  if (e.key === "ArrowLeft") showPage(pageAt - 1);
});
document.getElementById("book").tabIndex = 0;
showPage(0);

// 4. THE STARRY SKY ------------------------------------------
const sky = document.getElementById("sky");
const ctx = sky.getContext("2d");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [];
function sizeSky() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  sky.width = innerWidth * dpr; sky.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.round((innerWidth * innerHeight) / 5000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 1.3 + .2, t: Math.random() * Math.PI * 2, s: Math.random() * .02 + .005,
    c: Math.random() < .12 ? "216,180,106" : Math.random() < .5 ? "190,210,255" : "244,236,216",
  }));
}
function drawSky() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const st of stars) {
    st.t += st.s;
    const a = calm ? .7 : .35 + Math.abs(Math.sin(st.t)) * .65;
    ctx.fillStyle = `rgba(${st.c},${a})`;
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
    if (st.r > 1.3) { // a few four-point sparkles
      ctx.fillRect(st.x - st.r * 3, st.y - .3, st.r * 6, .6);
      ctx.fillRect(st.x - .3, st.y - st.r * 3, .6, st.r * 6);
    }
  }
  if (!calm) requestAnimationFrame(drawSky);
}
sizeSky(); drawSky();
addEventListener("resize", () => { sizeSky(); if (calm) drawSky(); });
