// The scene moves only in response to a precise pointer, never in an idle loop.
export {};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

document.querySelectorAll<HTMLElement>('[data-spatial-stage]').forEach(stage => {
  let frame = 0;
  const reset = () => {
    cancelAnimationFrame(frame);
    delete stage.dataset.spatialActive;
    for (const name of ['--scene-x', '--scene-y', '--scene-light-x', '--scene-light-y']) stage.style.removeProperty(name);
  };
  stage.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      stage.dataset.spatialActive = 'true';
      stage.style.setProperty('--scene-x', `${(0.5 - y) * 9}deg`);
      stage.style.setProperty('--scene-y', `${(x - 0.5) * 12}deg`);
      stage.style.setProperty('--scene-light-x', `${x * 100}%`);
      stage.style.setProperty('--scene-light-y', `${y * 100}%`);
    });
  }, { passive: true });
  stage.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  reducedMotion.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
});
