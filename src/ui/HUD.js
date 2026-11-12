export class HUD {
  constructor() {
    this.hintEl = document.querySelector('.hint-text');
    this.fpsEl = document.getElementById('fps-counter');
    this.loadingOverlay = document.getElementById('loading-overlay');

    this.defaultHint = '<strong>Drag</strong> to orbit • <strong>Scroll</strong> to zoom • <strong>Click horse</strong> to interact';
    this.toastTimer = null;

    // FPS calculation
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 60;
  }

  showToast(message, durationMs = 2400) {
    if (!this.hintEl) return;

    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.hintEl.innerHTML = `<span style="color: #fde047; font-weight: 600;">${message}</span>`;

    this.toastTimer = setTimeout(() => {
      this.hintEl.innerHTML = this.defaultHint;
      this.toastTimer = null;
    }, durationMs);
  }

  updateFPS() {
    if (!this.fpsEl) return;

    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.fpsEl.textContent = `${this.fps} FPS`;

      if (this.fps >= 55) {
        this.fpsEl.style.color = '#4ade80';
        this.fpsEl.style.borderColor = 'rgba(74, 222, 128, 0.25)';
      } else if (this.fps >= 30) {
        this.fpsEl.style.color = '#facc15';
        this.fpsEl.style.borderColor = 'rgba(250, 204, 21, 0.25)';
      } else {
        this.fpsEl.style.color = '#f87171';
        this.fpsEl.style.borderColor = 'rgba(248, 113, 113, 0.25)';
      }

      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.add('hidden');
    }
  }
}
