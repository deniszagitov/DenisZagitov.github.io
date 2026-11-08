// Native radio/detail controls retain the readable content without JavaScript.
export {};
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

document.querySelectorAll<HTMLElement>('[data-architecture]').forEach(root => {
  const stage = root.querySelector<HTMLElement>('[data-spatial-stage]');
  const perspective = root.querySelector<HTMLElement>('.spatial-perspective');
  const inspector = root.querySelector<HTMLElement>('.spatial-inspector');
  const openButton = root.querySelector<HTMLButtonElement>('[data-open-layer]');
  const closeButton = root.querySelector<HTMLButtonElement>('[data-close-layer]');
  const motionButton = root.querySelector<HTMLButtonElement>('[data-toggle-flow]');
  if (!stage || !perspective || !inspector || !openButton || !closeButton || !motionButton) return;

  const inputs = [...root.querySelectorAll<HTMLInputElement>('input[name="expertise-layer"]')];
  const panels = [...inspector.querySelectorAll<HTMLElement>('[data-layer-panel]')];
  let inside = false;
  let paused = false;
  let onScreen = !('IntersectionObserver' in window);
  let pointerFrame = 0;

  const updateMotion = () => {
    const enabled = !paused && !reducedMotion.matches;
    root.dataset.flowRunning = String(enabled && onScreen && !document.hidden && !inside);
    motionButton.setAttribute('aria-pressed', String(enabled));
    motionButton.disabled = reducedMotion.matches;
    const label = motionButton.querySelector<HTMLElement>('[data-motion-label]');
    if (label) label.textContent = reducedMotion.matches ? motionButton.dataset.staticLabel! : enabled ? motionButton.dataset.pauseLabel! : motionButton.dataset.playLabel!;
    motionButton.querySelector<HTMLElement>('[data-motion-icon="pause"]')!.hidden = !enabled;
    motionButton.querySelector<HTMLElement>('[data-motion-icon="play"]')!.hidden = enabled;
  };
  const selectedPanel = () => {
    const selected = inputs.find(input => input.checked)?.value;
    return panels.find(panel => panel.dataset.layerPanel === selected);
  };
  const updateLayer = () => {
    const selected = selectedPanel();
    panels.forEach(panel => { panel.hidden = panel !== selected; });
  };
  const showView = (showInside: boolean) => {
    inside = showInside;
    root.dataset.view = inside ? 'inside' : 'overview';
    perspective.hidden = inside;
    inspector.hidden = !inside;
    openButton.hidden = inside;
    closeButton.hidden = !inside;
    openButton.setAttribute('aria-expanded', String(inside));
    updateLayer();
    updateMotion();
    if (inside) {
      selectedPanel()?.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 760px)').matches) stage.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    } else if (window.matchMedia('(max-width: 760px)').matches) {
      stage.tabIndex = -1;
      stage.focus({ preventScroll: true });
      stage.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    } else {
      openButton.focus({ preventScroll: true });
    }
  };

  inputs.forEach(input => input.addEventListener('change', updateLayer));
  openButton.addEventListener('click', () => showView(true));
  closeButton.addEventListener('click', () => showView(false));
  motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      onScreen = entries.some(entry => entry.isIntersecting);
      updateMotion();
    }, { threshold: 0.05 });
    observer.observe(stage);
  }

  const resetPointer = () => {
    cancelAnimationFrame(pointerFrame);
    delete stage.dataset.spatialActive;
    for (const name of ['--scene-x', '--scene-y', '--scene-light-x', '--scene-light-y']) stage.style.removeProperty(name);
  };
  stage.addEventListener('pointermove', event => {
    if (inside || reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      stage.dataset.spatialActive = 'true';
      stage.style.setProperty('--scene-x', ((0.5 - y) * 6) + 'deg');
      stage.style.setProperty('--scene-y', ((x - 0.5) * 8) + 'deg');
      stage.style.setProperty('--scene-light-x', (x * 100) + '%');
      stage.style.setProperty('--scene-light-y', (y * 100) + '%');
    });
  }, { passive: true });
  stage.addEventListener('pointerleave', resetPointer);
  window.addEventListener('blur', resetPointer);
  reducedMotion.addEventListener('change', () => { resetPointer(); updateMotion(); });
  finePointer.addEventListener('change', resetPointer);
  openButton.hidden = false;
  motionButton.hidden = false;
  updateLayer();
  updateMotion();
});
