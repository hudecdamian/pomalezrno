const PHOTOS = {
};

document.querySelectorAll('.ph[data-k]').forEach(figure => {
  const src = PHOTOS[figure.dataset.k];
  if (src) {
    figure.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
  }
});


const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;

if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({
    duration: 1.25,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  const raf = time => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    const targetEl = targetId.length > 1 ? document.querySelector(targetId) : null;
    
    e.preventDefault();

    if (lenis) {
      lenis.scrollTo(targetEl || 0, {
        offset: targetEl ? -(header ? header.offsetHeight : 60) : 0,   // výška hlavičky (na mobilu je vyšší)
        duration: 1.6
      });
    } else {
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });
});


const progressBar = document.getElementById('bar');
const header = document.querySelector('header.top');
const heroPhoto = document.querySelector('.hero .ph');

function handleScroll() {
  const currentScroll = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${maxScroll > 0 ? currentScroll / maxScroll : 0})`;
  }

  if (header) {
    header.classList.toggle('scrolled', currentScroll > 10);
  }

  if (heroPhoto && !reduceMotion && currentScroll < window.innerHeight * 1.5) {
    heroPhoto.style.setProperty('--py', Math.min(currentScroll * 0.08, heroPhoto.offsetHeight * 0.05) + 'px');
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();



if (!reduceMotion) {
  const animateSelector = '.intro > *, .menu > .wrap > h2, .menu .sub, .cat h3, .cat .note, .cat li, .cat .ph, .gal h2, .grid .ph, .visit .wrap > *';
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -6% 0px'
  });

  document.querySelectorAll(animateSelector).forEach(el => {
    const childIndex = [...el.parentNode.children].indexOf(el);
    el.style.transitionDelay = Math.min(childIndex * 70, 420) + 'ms';
    el.classList.add('rv');
    observer.observe(el);
  });
}