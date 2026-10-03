import { Stage } from './Stage';
import { LC } from './LC';

export class StageManager {
  stageContainer: HTMLUListElement;
  stageList: Stage[] = [];
  selectionSets: string[];
  lc: LC;

  constructor(stageContainer: HTMLUListElement, selectionSet: string[], lc: LC) {
    this.selectionSets = selectionSet;
    this.stageContainer = stageContainer;
    this.lc = lc;

    const firstStage = new Stage(this, 1);
    this.stageList.push(firstStage);

    this.setupListeners();
    this.renderUI();
  }

  setupListeners() {
    const exportBtn = document.getElementById('btn-export-xml')

    if (exportBtn instanceof HTMLButtonElement) {
      exportBtn.addEventListener('click', this.exportXML.bind(this))
    }
  }

  renderUI() {
    this.stageContainer.innerHTML = '';
    for (const stage of this.stageList) {
      this.stageContainer.appendChild(stage.stageElement);
    }
  }

  addStage() {
    const newStage = new Stage(this, this.stageList.length + 1);
    this.stageList.push(newStage);
    this.renderUI();
    this.lc.lcManager.updateDefaultConfigButton();
  }

  removeStage(removedStage: Stage) {
    if (this.stageList.length === 1) {
      return;
    }

    const removedStageIndex = this.stageList.indexOf(removedStage);
    this.stageList.splice(removedStageIndex, 1);

    // Re-number stages
    this.stageList.forEach((stage, index) => {
      stage.stageNumber = index + 1;
      stage.updateUI();
    });

    this.renderUI();
    this.lc.lcManager.updateDefaultConfigButton();
  }

  exportXML() {
    console.log('export XML')
  }
}
