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

    this.options = {
      clashType: 'duplicate',
      tollerance: globalTolleranceFt,
      autointesect: true,
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
    this.stageElement.innerHTML = this.renderUI();
    this.setupListeners();
  }

  renderUI() {
    return `
    <div>
      <div class="clash-stage-header d-flex justify-content-between align-items-center mb-2">
        <h3 class="h6 mb-0">STAGE-${this.stageNumber}</h3>
        <div>
          <button class="btn btn-outline-secondary btn-sm remove-stage-btn">-</button>
          <button class="btn btn-outline-primary btn-sm add-stage-btn">+</button>
        </div>
      </div>
      <div class="clash-stage-body mb-2">
        <p class="mb-1 text-muted small">Type: ${this.options.clashType}, Tolerance: ${this.options.tollerance} ft, Autointersect: ${this.options.autointesect}</p>
        <button class="btn btn-sm btn-info options-stage-btn">Options</button>
        <button class="btn btn-sm btn-primary gen-matrix-btn">Gen Matrix</button>
        <button class="btn btn-sm btn-secondary refresh-matrix-btn" disabled>Refresh Matrix</button>
      </div>
      <dialog class="stage-modal p-4 rounded shadow-sm border-0">
        <form>
        <h4>stage options</h4>
        <section>
          <label>Clash Type:</label>
          <label>duplicate
            <input type="radio" name="clash-type" value="duplicate">
          </label>
          <label>intersections
            <input type="radio" name="clash-type" value="hard">
          </label>
        </section>
        <section>
          <label>Tollerance (ft)</label>
          <input type="text" name="tollerance" value="${this.options.tollerance}">
        </section>
        <section>
          <label>autointersect
            <input type="checkbox" name="autointesect">
          </label>
        </section>
        <hr>
        <input type="submit" value="update">
        <button>cancel</button>
      </form>
      </dialog>
    </div>
    `;
  }

  setupListeners() {
    const addBtn = this.stageElement.querySelector('.add-stage-btn');
    const removeBtn = this.stageElement.querySelector('.remove-stage-btn');
    const optionsBtn = this.stageElement.querySelector('.options-stage-btn');
    const optionsModal = this.stageElement.querySelector('.stage-modal');
    const optionsForm = this.stageElement.querySelector('.stage-modal form');
    const optionsFormCancBtn = this.stageElement.querySelector(
      '.stage-modal form button'
    );
    const genMatrixBtn = this.stageElement.querySelector('.gen-matrix-btn');
    const refreshMatrixBtn = this.stageElement.querySelector(
      '.refresh-matrix-btn'
    );

    if (
      addBtn instanceof HTMLButtonElement &&
      removeBtn instanceof HTMLButtonElement &&
      optionsBtn instanceof HTMLButtonElement &&
      optionsModal instanceof HTMLDialogElement &&
      optionsForm instanceof HTMLFormElement &&
      optionsFormCancBtn instanceof HTMLButtonElement &&
      genMatrixBtn instanceof HTMLButtonElement &&
      refreshMatrixBtn instanceof HTMLButtonElement
    ) {
      addBtn.addEventListener('click', this.addStage.bind(this));
      removeBtn.addEventListener('click', this.removeStage.bind(this));
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

  addStage() {
    this.stageManager.addStage();
  }

  removeStage() {
    this.stageManager.removeStage(this);
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
        tollerance: parseFloat(data.get('tollerance') as string) as number,
        autointesect: Boolean(data.get('autointesect') as string),
      };
      this.options = updatedOptions;
      this.updateUI();

      optionsForm.reset();
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

    this.stageMatrix.renderMatrix();

    if (e.target instanceof HTMLButtonElement && e.target === genMatrixBtn) {
      genMatrixBtn.disabled = true;
      genMatrixBtn.style.display = 'none';
      refreshMatrixBtn.disabled = false;
      refreshMatrixBtn.classList.remove('btn-secondary');
      refreshMatrixBtn.classList.add('btn-warning');
    } else if (
      e.target instanceof HTMLButtonElement &&
      e.target === refreshMatrixBtn
    ) {
      // already generated
    }
  }
}
