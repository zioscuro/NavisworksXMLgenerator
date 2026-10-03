import { StageManager } from './StageManager';
import { Matrix } from './Matrix';

type ClashTestOptions = {
  clashType: 'hard' | 'duplicate';
  tollerance: number;
  autointesect: boolean;
};

export class Stage {
  stageElement: HTMLElement;
  stageManager: StageManager;
  stageMatrix: Matrix;
  stageNumber: number;
  options: ClashTestOptions;

  constructor(manager: StageManager, stageNumber: number) {
    const globalTolleranceInput = document.getElementById('global-tolerance-input') as HTMLInputElement;
    const globalTolleranceCm = globalTolleranceInput ? parseFloat(globalTolleranceInput.value) : 5;
    const globalTolleranceFt = globalTolleranceCm * 0.0328084;

    const globalClashTypeInput = document.getElementById('global-clash-type') as HTMLSelectElement;
    const globalClashType = globalClashTypeInput ? (globalClashTypeInput.value as 'hard' | 'duplicate') : 'hard';

    const globalAutointersectInput = document.getElementById('global-autointersect') as HTMLInputElement;
    const globalAutointersect = globalAutointersectInput ? globalAutointersectInput.checked : false;

    this.options = {
      clashType: globalClashType,
      tollerance: globalTolleranceFt,
      autointesect: globalAutointersect,
    };

    this.stageManager = manager;
    this.stageNumber = stageNumber;
    this.stageMatrix = new Matrix(this);
    this.stageElement = document.createElement('li');
    this.stageElement.className = 'clash-stage mb-3 border p-3 rounded bg-light';
    this.stageElement.innerHTML = this.renderUI();
    this.setupListeners();
  }

  updateUI() {
    // Only update specific elements to preserve matrix state
    const title = this.stageElement.querySelector('h3');
    if (title) {
      title.textContent = `STAGE-${this.stageNumber}`;
    }

    // Update the labels in the modal to keep IDs in sync
    const labelHard = this.stageElement.querySelector(`label[for^="ctype-hard-"]`);
    if (labelHard) labelHard.setAttribute('for', `ctype-hard-${this.stageManager.lc.lcNumber}-${this.stageNumber}`);

    const inputHard = this.stageElement.querySelector(`input[id^="ctype-hard-"]`);
    if (inputHard) inputHard.id = `ctype-hard-${this.stageManager.lc.lcNumber}-${this.stageNumber}`;

    const labelDup = this.stageElement.querySelector(`label[for^="ctype-duplicate-"]`);
    if (labelDup) labelDup.setAttribute('for', `ctype-duplicate-${this.stageManager.lc.lcNumber}-${this.stageNumber}`);

    const inputDup = this.stageElement.querySelector(`input[id^="ctype-duplicate-"]`);
    if (inputDup) inputDup.id = `ctype-duplicate-${this.stageManager.lc.lcNumber}-${this.stageNumber}`;

    const labelAuto = this.stageElement.querySelector(`label[for^="autointersect-"]`);
    if (labelAuto) labelAuto.setAttribute('for', `autointersect-${this.stageManager.lc.lcNumber}-${this.stageNumber}`);

    const inputAuto = this.stageElement.querySelector(`input[id^="autointersect-"]`);
    if (inputAuto) inputAuto.id = `autointersect-${this.stageManager.lc.lcNumber}-${this.stageNumber}`;
  }

  updateSettingsUI() {
    const p = this.stageElement.querySelector('.clash-stage-body p.text-muted');
    if (p) {
      p.textContent = `Type: ${this.options.clashType}, Tolerance: ${(this.options.tollerance / 0.0328084).toFixed(1)} cm, Autointersect: ${this.options.autointesect}`;
    }
  }

  renderUI() {
    return `
    <div>
      <div class="clash-stage-header d-flex justify-content-between align-items-center mb-2">
        <h3 class="h6 mb-0">STAGE-${this.stageNumber}</h3>
        <div>
          <button class="btn btn-outline-secondary btn-sm options-stage-btn">Options</button>
        </div>
      </div>
      <div class="clash-stage-body mb-2">
        <p class="mb-1 text-muted small">Type: ${this.options.clashType}, Tolerance: ${(this.options.tollerance / 0.0328084).toFixed(1)} cm, Autointersect: ${this.options.autointesect}</p>
        <button class="btn btn-sm btn-primary gen-matrix-btn">Gen Matrix</button>
        <button class="btn btn-sm btn-secondary refresh-matrix-btn" disabled>Refresh Matrix</button>
      </div>
      <dialog class="stage-modal rounded shadow border-0" style="width: 400px; max-width: 90vw;">
        <form class="p-4">
          <h4 class="mb-4 border-bottom pb-2">Stage Options</h4>

          <div class="mb-3">
            <label class="form-label d-block">Clash Type</label>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="clash-type" value="hard" id="ctype-hard-${this.stageManager.lc.lcNumber}-${this.stageNumber}" ${this.options.clashType === 'hard' ? 'checked' : ''}>
              <label class="form-check-label" for="ctype-hard-${this.stageManager.lc.lcNumber}-${this.stageNumber}">Hard</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="clash-type" value="duplicate" id="ctype-duplicate-${this.stageManager.lc.lcNumber}-${this.stageNumber}" ${this.options.clashType === 'duplicate' ? 'checked' : ''}>
              <label class="form-check-label" for="ctype-duplicate-${this.stageManager.lc.lcNumber}-${this.stageNumber}">Duplicate</label>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Tolerance (cm)</label>
            <input type="number" step="0.1" min="0" class="form-control" name="tollerance" value="${(this.options.tollerance / 0.0328084).toFixed(1)}">
          </div>

          <div class="mb-4 form-check">
            <input class="form-check-input" type="checkbox" name="autointesect" id="autointersect-${this.stageManager.lc.lcNumber}-${this.stageNumber}" ${this.options.autointesect ? 'checked' : ''}>
            <label class="form-check-label" for="autointersect-${this.stageManager.lc.lcNumber}-${this.stageNumber}">
              Autointersect
            </label>
          </div>

          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-outline-secondary cancel-options-btn">Cancel</button>
            <button type="submit" class="btn btn-primary">Update</button>
          </div>
        </form>
      </dialog>
    </div>
    `;
  }

  setupListeners() {
    const optionsBtn = this.stageElement.querySelector('.options-stage-btn');
    const optionsModal = this.stageElement.querySelector('.stage-modal');
    const optionsForm = this.stageElement.querySelector('.stage-modal form');
    const optionsFormCancBtn = this.stageElement.querySelector(
      '.cancel-options-btn'
    );
    const genMatrixBtn = this.stageElement.querySelector('.gen-matrix-btn');
    const refreshMatrixBtn = this.stageElement.querySelector(
      '.refresh-matrix-btn'
    );

    if (
      optionsBtn instanceof HTMLButtonElement &&
      optionsModal instanceof HTMLDialogElement &&
      optionsForm instanceof HTMLFormElement &&
      optionsFormCancBtn instanceof HTMLButtonElement &&
      genMatrixBtn instanceof HTMLButtonElement &&
      refreshMatrixBtn instanceof HTMLButtonElement
    ) {
      optionsBtn.addEventListener('click', this.showOptions.bind(this));
      optionsForm.addEventListener('submit', this.updateOptions.bind(this));
      optionsFormCancBtn.addEventListener('click', this.hideOptions.bind(this));
      genMatrixBtn.addEventListener('click', this.renderStageMatrix.bind(this));
      refreshMatrixBtn.addEventListener(
        'click',
        this.renderStageMatrix.bind(this)
      );
    }
  }

  showOptions() {
    const optionsModal = this.stageElement.querySelector('.stage-modal');
    if (optionsModal instanceof HTMLDialogElement) {
      optionsModal.showModal();
    }
  }

  hideOptions(e: Event) {
    e.preventDefault();
    const optionsModal = this.stageElement.querySelector('.stage-modal');
    if (optionsModal instanceof HTMLDialogElement) {
      optionsModal.close();
    }
  }

  updateOptions(e: Event) {
    e.preventDefault();
    const optionsModal = this.stageElement.querySelector('.stage-modal');
    const optionsForm = this.stageElement.querySelector('.stage-modal form');

    if (
      optionsModal instanceof HTMLDialogElement &&
      optionsForm instanceof HTMLFormElement
    ) {
      const data = new FormData(optionsForm);
      const updatedOptions: ClashTestOptions = {
        clashType: data.get('clash-type') as 'hard' | 'duplicate',
        tollerance: parseFloat(data.get('tollerance') as string) * 0.0328084,
        autointesect: Boolean(data.get('autointesect') as string),
      };

      const refreshNeeded = this.options.autointesect !== updatedOptions.autointesect;

      this.options = updatedOptions;
      this.updateSettingsUI();

      // If autointersect changed, the matrix must be cleared/refreshed
      if (refreshNeeded) {
        this.stageMatrix.matrixElement.innerHTML = '';
        const genMatrixBtn = this.stageElement.querySelector('.gen-matrix-btn') as HTMLButtonElement;
        const refreshMatrixBtn = this.stageElement.querySelector('.refresh-matrix-btn') as HTMLButtonElement;
        if (genMatrixBtn && refreshMatrixBtn) {
           genMatrixBtn.disabled = false;
           genMatrixBtn.style.display = 'inline-block';
           refreshMatrixBtn.disabled = true;
           refreshMatrixBtn.classList.add('btn-secondary');
           refreshMatrixBtn.classList.remove('btn-warning');
        }
      }
      optionsModal.close();
      this.stageManager.lc.lcManager.updateDefaultConfigButton();
    }
  }

  renderStageMatrix(e: Event) {
    const stageBody = this.stageElement.querySelector('.clash-stage-body');
    const genMatrixBtn = this.stageElement.querySelector('.gen-matrix-btn');
    const refreshMatrixBtn = this.stageElement.querySelector(
      '.refresh-matrix-btn'
    );

    if (
      !(
        stageBody instanceof HTMLDivElement &&
        genMatrixBtn instanceof HTMLButtonElement &&
        refreshMatrixBtn instanceof HTMLButtonElement
      )
    ) {
      return;
    }

    if (e.target instanceof HTMLButtonElement && e.target === refreshMatrixBtn) {
      if (!confirm('Are you sure you want to refresh the matrix? This will reset your current configuration.')) {
        return;
      }
    }

    this.stageMatrix.renderMatrix();

    if (e.target instanceof HTMLButtonElement && e.target === genMatrixBtn) {
      genMatrixBtn.disabled = true;
      genMatrixBtn.style.display = 'none';
      refreshMatrixBtn.disabled = false;
      refreshMatrixBtn.classList.remove('btn-secondary');
      refreshMatrixBtn.classList.add('btn-warning');
    }
  }
}
