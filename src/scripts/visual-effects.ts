// Progressive visual enhancements; the page remains readable without JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const root = document.documentElement;
const pointerEffectsEnabled = () => !reducedMotion.matches && finePointer.matches;

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.setAttribute('data-revealed', 'true');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll<HTMLElement>('.expertise-item, .approach-grid article, .contact-grid').forEach((element, index) => {
    element.dataset.reveal = 'true';
    element.style.setProperty('--reveal-delay', `${(index % 3) * 80}ms`);
    observer.observe(element);
  });
  root.classList.add('has-reveal');
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      root.classList.remove('has-reveal');
      observer.disconnect();
    }
  });
}

let ambientFrame = 0;
document.addEventListener('pointermove', event => {
  if (!pointerEffectsEnabled() || event.pointerType === 'touch') return;
  cancelAnimationFrame(ambientFrame);
  ambientFrame = requestAnimationFrame(() => {
    root.style.setProperty('--ambient-x', `${event.clientX}px`);
    root.style.setProperty('--ambient-y', `${event.clientY}px`);
    root.style.setProperty('--metal-position', `${(event.clientX / window.innerWidth) * 100}%`);
  });
}, { passive: true });

const resetAmbient = () => {
  cancelAnimationFrame(ambientFrame);
  root.style.removeProperty('--ambient-x');
  root.style.removeProperty('--ambient-y');
  root.style.removeProperty('--metal-position');
};
document.documentElement.addEventListener('pointerleave', resetAmbient);
reducedMotion.addEventListener('change', resetAmbient);
finePointer.addEventListener('change', resetAmbient);
window.addEventListener('blur', resetAmbient);

document.querySelectorAll<HTMLElement>('[data-tilt], .expertise-item, .hero-facts, .contact-grid').forEach(element => {
  let frame = 0;
  const reset = () => {
    cancelAnimationFrame(frame);
    delete element.dataset.luxActive;
    for (const property of ['--tilt-x', '--tilt-y', '--shine-x', '--shine-y', '--light-angle']) {
      element.style.removeProperty(property);
    }
  };
  element.addEventListener('pointermove', event => {
    if (!pointerEffectsEnabled() || event.pointerType === 'touch') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      element.dataset.luxActive = 'true';
      element.style.setProperty('--shine-x', `${x * 100}%`);
      element.style.setProperty('--shine-y', `${y * 100}%`);
      element.style.setProperty('--light-angle', `${Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI + 90}deg`);
      if (element.hasAttribute('data-tilt')) {
        element.style.setProperty('--tilt-x', `${(0.5 - y) * 4}deg`);
        element.style.setProperty('--tilt-y', `${(x - 0.5) * 5}deg`);
      }
    });
  }, { passive: true });
  element.addEventListener('pointerleave', reset);
  reducedMotion.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
  window.addEventListener('blur', reset);
});

let scrollFrame = 0;
function updateReadingProgress() {
  const distance = root.scrollHeight - root.clientHeight;
  const progress = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
  root.style.setProperty('--reading-progress', String(progress));
}
window.addEventListener('scroll', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(updateReadingProgress);
}, { passive: true });
window.addEventListener('resize', updateReadingProgress, { passive: true });
window.addEventListener('load', updateReadingProgress, { once: true });
updateReadingProgress();
