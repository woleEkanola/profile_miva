// Mobile navigation toggle
var hamburger = document.querySelector('.hamburger');
var navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', function () {
    navMenu.classList.toggle('active');
    var isOpen = navMenu.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  var navLinks = document.querySelectorAll('.nav-link');
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '&#9776;';
      }
    });
  }
}

// Highlight active nav link
var currentPage = window.location.pathname.split('/').pop() || 'index.html';
var allNavLinks = document.querySelectorAll('.nav-link');
for (var j = 0; j < allNavLinks.length; j++) {
  var linkHref = allNavLinks[j].getAttribute('href');
  if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
    allNavLinks[j].classList.add('active');
  }
}

// Scroll reveal animation
var reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  for (var k = 0; k < reveals.length; k++) {
    observer.observe(reveals[k]);
  }
} else {
  for (var m = 0; m < reveals.length; m++) {
    reveals[m].classList.add('visible');
  }
}

// Animate skill bars on scroll
var skillFills = document.querySelectorAll('.skill-fill');
if (skillFills.length > 0 && 'IntersectionObserver' in window) {
  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var width = entry.target.getAttribute('data-width') || '0';
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  for (var n = 0; n < skillFills.length; n++) {
    skillObserver.observe(skillFills[n]);
  }
}

// Update footer year
var yearEl = document.getElementById('current-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
