console.log("Portfolio Loaded Successfully");
const themeToggle =
document.getElementById("themeToggle");

themeToggle.addEventListener(
"click",
()=>{

const html =
document.documentElement;

const current =
html.getAttribute("data-theme");

html.setAttribute(
"data-theme",
current==="dark" ? "light" : "dark"
);

}
);
const roles = [
"ECE Student",
"AI/ML Enthusiast",
"VLSI Aspirant",
"C++ Problem Solver",
"Python Developer"
];

let roleIndex = 0;
let charIndex = 0;

const target =
document.getElementById("typingTarget");

function type(){

if(!target) return;

target.textContent =
roles[roleIndex].slice(
0,
charIndex++
);

if(charIndex >
roles[roleIndex].length){

setTimeout(()=>{

charIndex=0;

roleIndex =
(roleIndex+1)%roles.length;

},1500);

}

setTimeout(type,120);
}

type();
const counters =
document.querySelectorAll(
".stat-number"
);

const observer =
new IntersectionObserver(
(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const counter =
entry.target;

const target =
+counter.dataset.target;

let current=0;

const interval =
setInterval(()=>{

current++;

counter.textContent =
current;

if(current>=target){

clearInterval(interval);

}

},20);

}

});

}
);

counters.forEach(
c=>observer.observe(c)
);
const reveals =
document.querySelectorAll(
".reveal"
);

const revealObserver =
new IntersectionObserver(
(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add(
"active"
);

}

});

}
);

reveals.forEach(
r=>revealObserver.observe(r)
);
const hamburger =
document.getElementById(
"hamburger"
);

const navLinks =
document.getElementById(
"navLinks"
);

hamburger.addEventListener(
"click",
()=>{

navLinks.classList.toggle(
"show"
);

}
);


