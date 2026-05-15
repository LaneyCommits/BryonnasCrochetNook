//////////////////////////////
// Mobile nav toggle (home page)
//////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
});

//////////////////////////////
// Logo Animation Script (pages with .site-logo)
//////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.site-logo');
  if (!logo) return;

  // smooth transforms
  logo.style.transition = 'transform 300ms cubic-bezier(.2,.8,.2,1), box-shadow 300ms';
  logo.style.transformOrigin = 'center center';
  logo.style.willChange = 'transform';

  // entry "pop" animation
  logo.style.transform = 'scale(0.95)';
  setTimeout(() => {
    logo.style.transform = 'scale(1.12)';
    logo.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)';
    setTimeout(() => {
      logo.style.transform = 'scale(1)';
      logo.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
    }, 260);
  }, 120);

  // hover/touch interactions
  logo.addEventListener('mouseenter', () => {
    logo.style.transform = 'scale(1.06)';
    logo.style.boxShadow = '0 14px 36px rgba(0,0,0,0.28)';
  });
  logo.addEventListener('mouseleave', () => {
    logo.style.transform = 'scale(1)';
    logo.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
  });

  // quick press/tap feedback
  logo.addEventListener('pointerdown', () => {
    logo.style.transition = 'transform 120ms';
    logo.style.transform = 'scale(0.9)';
  });
  logo.addEventListener('pointerup', () => {
    logo.style.transition = 'transform 240ms cubic-bezier(.2,.8,.2,1)';
    logo.style.transform = 'scale(1.06)';
    setTimeout(() => (logo.style.transform = 'scale(1)'), 180);
  });
});
//////////////////////////////////////
// End Logo Animation Script //
//////////////////////////////////////

//////////////////////////////
// Shop: category filter (selectable categories)
//////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.shop-categories');
  if (!nav) return;

  const links = nav.querySelectorAll('.shop-categories__link[data-filter]');
  const sections = document.querySelectorAll('.shop-section');

  function setFilter(filter) {
    links.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-filter') === filter);
    });
    sections.forEach(function (section) {
      const id = section.id;
      const show = filter === 'all' || id === filter;
      section.classList.toggle('shop-section--hidden', !show);
    });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      setFilter(link.getAttribute('data-filter'));
    });
  });

  // If page loaded with hash (e.g. #plushies), select that category
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    setFilter(hash);
  }
});

//////////////////////////////
// Dimensional text + soft highlights
//////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  const popTargets = document.querySelectorAll(
    '.hero-modern__sub, .hero-modern__tagline, .feature-title, .shop-section__title, .about-story__heading'
  );
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  popTargets.forEach((el) => el.classList.add('text-pop'));

  if (reduceMotion) {
    popTargets.forEach((el) => el.classList.add('text-pop-in'));
    return;
  }

  const popObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('text-pop-in');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -30px 0px' }
  );

  popTargets.forEach((el) => popObserver.observe(el));
});

