'use strict';





/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * PAGE READY
 *
 * no full-screen preloader: the page is usable as soon as it is parsed,
 * images keep loading in the background
 */

const preloader = document.querySelector("[data-preloader]");

if (preloader) preloader.classList.add("loaded");
document.body.classList.add("loaded");



/**
 * FASTER PAGE SWITCHING
 *
 * prefetch the other pages when a link is hovered or touched,
 * so the next page is already downloaded when it is clicked
 */

if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) {
  const rules = document.createElement("script");
  rules.type = "speculationrules";
  rules.textContent = JSON.stringify({
    prefetch: [{ where: { href_matches: "/*" }, eagerness: "moderate" }]
  });
  document.head.appendChild(rules);
} else {
  const prefetched = new Set();
  document.addEventListener("pointerover", function (event) {
    const link = event.target.closest && event.target.closest("a[href$='.html'], a[href*='.html?'], a[href*='.html#']");
    if (!link || link.origin !== location.origin || prefetched.has(link.pathname)) return;
    prefetched.add(link.pathname);
    const hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = link.pathname;
    document.head.appendChild(hint);
  });
}



/**
 * MOBILE NAVBAR
 * 
 * show the mobile navbar when click menu button
 * and hidden after click menu close button or overlay
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNav = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNav);



/**
 * HEADER & BACK TOP BTN
 * 
 * active header & back top btn when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

window.addEventListener("scroll", activeElementOnScroll);



/**
 * SCROLL REVEAL
 */

const revealElements = document.querySelectorAll("[data-reveal]");

const revealElementOnScroll = function () {
  for (let i = 0, len = revealElements.length; i < len; i++) {
    if (revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15) {
      revealElements[i].classList.add("revealed");
    } else {
      revealElements[i].classList.remove("revealed");
    }
  }
}

window.addEventListener("scroll", revealElementOnScroll);

// reveal what is on screen straight away instead of waiting for every image to load
revealElementOnScroll();





/**
 * CURRENT PAGE IN THE MENU
 */

const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".navbar-link").forEach(function (link) {
  if (link.getAttribute("href") === currentPage) link.setAttribute("aria-current", "page");
});
