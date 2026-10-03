import { LCManager } from './LCManager';
import { StageManager } from './StageManager';

export class LC {
  lcManager: LCManager;
  lcNumber: number;
  lcElement: HTMLElement;
  stageManager: StageManager;

  constructor(manager: LCManager, lcNumber: number) {
    this.lcManager = manager;
    this.lcNumber = lcNumber;

    this.lcElement = document.createElement('li');
    this.lcElement.className = 'lc-item card shadow-sm mb-4';

    this.lcElement.innerHTML = this.renderInitialHTML();

    const stageContainer = this.lcElement.querySelector('.lc-stage-list') as HTMLUListElement;
    this.stageManager = new StageManager(stageContainer, this.lcManager.selectionSets, this);

    this.setupListeners();
  }

  renderInitialHTML() {
    return `
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0 lc-title">LC${this.lcNumber}</h2>
        <div>
          <button class="btn btn-outline-danger btn-sm remove-lc-btn">Remove LC</button>
        </div>
      </div>
      <div class="card-body">
        <ul class="lc-stage-list list-unstyled"></ul>
        <div class="mt-3">
          <button class="btn btn-success export-lc-btn">Export LC${this.lcNumber} XML</button>
        </div>
      </div>
    `;
  }

  updateUI() {
    const title = this.lcElement.querySelector('.lc-title');
    if (title) title.textContent = `LC${this.lcNumber}`;

    const exportBtn = this.lcElement.querySelector('.export-lc-btn');
    if (exportBtn) exportBtn.textContent = `Export LC${this.lcNumber} XML`;
  }

  setupListeners() {
    const removeBtn = this.lcElement.querySelector('.remove-lc-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.lcManager.removeLC(this));
    }

    const exportBtn = this.lcElement.querySelector('.export-lc-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
         this.lcManager.exportLC(this);
      });
    }
  }
}
