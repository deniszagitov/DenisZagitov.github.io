// Selected diagrams and native technology details share one selection.
// No idle JavaScript rendering loop is needed.
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
  const planes = [...root.querySelectorAll<HTMLElement>('[data-plane]')];
  let focused = false;
  let inside = false;
  let paused = false;
  let onScreen = !('IntersectionObserver' in window);
  let pointerFrame = 0;
  const selectedId = () => inputs.find(input => input.checked)?.value;
  const selectedPanel = () => panels.find(panel => panel.dataset.layerPanel === selectedId());
  const resetPointer = () => {
    cancelAnimationFrame(pointerFrame);
    delete stage.dataset.spatialActive;
    for (const name of ['--scene-x', '--scene-y', '--scene-light-x', '--scene-light-y']) stage.style.removeProperty(name);
  };
  const updateMotion = () => {
    const enabled = !paused && !reducedMotion.matches;
    root.dataset.flowRunning = String(enabled && onScreen && !document.hidden && !focused);
    motionButton.hidden = focused;
    motionButton.setAttribute('aria-pressed', String(enabled));
    motionButton.disabled = reducedMotion.matches;
    const label = motionButton.querySelector<HTMLElement>('[data-motion-label]');
    if (label) label.textContent = reducedMotion.matches ? motionButton.dataset.staticLabel! : enabled ? motionButton.dataset.pauseLabel! : motionButton.dataset.playLabel!;
    motionButton.querySelector<HTMLElement>('[data-motion-icon="pause"]')!.hidden = !enabled;
    motionButton.querySelector<HTMLElement>('[data-motion-icon="play"]')!.hidden = enabled;
  };
  const highlightTechnology = (technology: string | null) => {
    root.dataset.activeTechnology = technology || '';
    for (const plane of planes) {
      const diagram = plane.querySelector<SVGSVGElement>('.spatial-layer-diagram');
      if (!diagram) continue;
      const nodes = [...diagram.querySelectorAll<SVGGElement>('[data-node-id]')];
      const activeIds = new Set(nodes.filter(node => plane.dataset.plane === selectedId() && technology && node.dataset.technologies?.split('|').includes(technology)).map(node => node.dataset.nodeId));
      diagram.dataset.hasHighlight = String(activeIds.size > 0);
      nodes.forEach(node => node.toggleAttribute('data-highlight', activeIds.has(node.dataset.nodeId)));
      diagram.querySelectorAll<SVGPathElement>('.diagram-edge').forEach(path => {
        path.toggleAttribute('data-highlight', activeIds.has(path.dataset.from) || activeIds.has(path.dataset.to));
      });
    }
  };
  const updateLayer = () => {
    panels.forEach(panel => { panel.hidden = panel.dataset.layerPanel !== selectedId(); });
    planes.forEach(plane => {
      const selected = plane.dataset.plane === selectedId();
      plane.toggleAttribute('data-selected', selected);
      plane.setAttribute('aria-hidden', String(!focused || !selected));
    });
    const lastOpen = [...(selectedPanel()?.querySelectorAll<HTMLDetailsElement>('details[open]') || [])].at(-1);
    highlightTechnology(inside ? lastOpen?.dataset.technology || null : null);
  };
  const focusLayer = () => {
    if (!focused) resetPointer();
    focused = true;
    root.dataset.scene = 'focused';
    perspective.setAttribute('aria-hidden', 'false');
    closeButton.hidden = false;
    updateLayer();
    updateMotion();
  };
  const showDescription = (show: boolean) => {
    inside = show;
    root.dataset.view = inside ? 'inside' : 'overview';
    inspector.hidden = !inside;
    openButton.setAttribute('aria-expanded', String(inside));
    const label = openButton.querySelector<HTMLElement>('[data-inspector-label]');
    if (label) label.textContent = inside ? openButton.dataset.collapseLabel! : openButton.dataset.openLabel!;
    if (!inside) highlightTechnology(null);
    if (inside) {
      focusLayer();
      const heading = selectedPanel()?.querySelector<HTMLElement>('h3');
      heading?.focus({ preventScroll: true });
      if (heading && heading.getBoundingClientRect().bottom > window.innerHeight - 40) {
        heading.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }
    }
  };
  const showStack = () => {
    showDescription(false);
    focused = false;
    root.dataset.scene = 'stack';
    perspective.setAttribute('aria-hidden', 'true');
    closeButton.hidden = true;
    resetPointer();
    updateLayer();
    updateMotion();
    stage.tabIndex = -1;
    stage.focus({ preventScroll: true });
    stage.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  };
  inputs.forEach(input => {
    input.addEventListener('change', focusLayer);
    input.addEventListener('keydown', event => {
      if (input.checked && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        focusLayer();
      }
    });
    input.addEventListener('click', event => {
      focusLayer();
      if (event.detail > 0 && window.matchMedia('(max-width: 760px)').matches) {
        stage.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
  inspector.querySelectorAll<HTMLDetailsElement>('details[data-technology]').forEach(details => {
    details.addEventListener('toggle', () => {
      if (inside && !details.closest<HTMLElement>('[data-layer-panel]')?.hidden) {
        const fallback = [...(selectedPanel()?.querySelectorAll<HTMLDetailsElement>('details[open]') || [])].at(-1);
        highlightTechnology((details.open ? details : fallback)?.dataset.technology || null);
      }
    });
  });
  openButton.addEventListener('click', () => { focusLayer(); showDescription(!inside); });
  closeButton.addEventListener('click', showStack);
  motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      onScreen = entries.some(entry => entry.isIntersecting);
      updateMotion();
    }, { threshold: 0.05 });
    observer.observe(stage);
  }
  stage.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      stage.dataset.spatialActive = 'true';
      stage.style.setProperty('--scene-x', ((0.5 - y) * (focused ? 2 : 6)) + 'deg');
      stage.style.setProperty('--scene-y', ((x - 0.5) * (focused ? 2 : 8)) + 'deg');
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
