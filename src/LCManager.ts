import { LC } from './LC';

export class LCManager {
  lcContainer: HTMLUListElement;
  lcList: LC[] = [];
  selectionSets: string[];

  constructor(lcContainer: HTMLUListElement, selectionSets: string[]) {
    this.lcContainer = lcContainer;
    this.selectionSets = selectionSets;
    this.renderUI();
  }

  addLC() {
    const newLC = new LC(this, this.lcList.length + 1);
    this.lcList.push(newLC);
    this.renderUI();
    this.updateDefaultConfigButton();
  }

  removeLC(removedLC: LC) {
    const removedLCIndex = this.lcList.indexOf(removedLC);
    if (removedLCIndex > -1) {
      this.lcList.splice(removedLCIndex, 1);
      // Re-number LCs
      this.lcList.forEach((lc, index) => {
        lc.lcNumber = index + 1;
        lc.updateUI();
      });
      this.renderUI();
      this.updateDefaultConfigButton();
    }
  }

  renderUI() {
    this.lcContainer.innerHTML = '';
    for (const lc of this.lcList) {
      this.lcContainer.appendChild(lc.lcElement);
    }
  }

  updateDefaultConfigButton() {
    const defaultBtn = document.getElementById('btn-default-config') as HTMLButtonElement;
    if (defaultBtn) {
      defaultBtn.disabled = this.lcList.length > 0;
    }
  }

  exportLC(lc: LC) {
    // We need a helper to download files. Let's assume it's in utils.
    import('./utils').then(({ downloadXml }) => {
      import('./clashXMLwriter').then(({ writeXmlForLCs }) => {
        const xml = writeXmlForLCs([lc]);
        downloadXml(`fileXML-LC${lc.lcNumber}`, xml);
        this.showAlert(`LC${lc.lcNumber} XML exported successfully!`, 'success');
      });
    });
  }

  exportAllXML() {
    if (this.lcList.length === 0) {
      this.showAlert('Please add at least one LC before exporting.', 'danger');
      return;
    }

    import('./utils').then(({ downloadXml }) => {
      import('./clashXMLwriter').then(({ writeXmlForLCs }) => {
        const xml = writeXmlForLCs(this.lcList);
        downloadXml('fileXML-All-LCs', xml);
        this.showAlert('All LCs XML exported successfully!', 'success');
      });
    });
  }

  showAlert(message: string, type: 'success' | 'danger') {
    const alertsContainer = document.getElementById('alerts-container');
    if (!alertsContainer) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertsContainer.appendChild(alertDiv);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 150); // wait for fade transition
    }, 5000);
  }

  generateDefaultConfig() {
    if (this.lcList.length > 0) return;

    const globalTolleranceInput = document.getElementById('global-tolerance-input') as HTMLInputElement;
    const globalTolleranceCm = globalTolleranceInput ? parseFloat(globalTolleranceInput.value) : 5;
    const globalTolleranceFt = globalTolleranceCm * 0.0328084;

    // Create LC1
    const lc1 = new LC(this, 1);
    this.lcList.push(lc1);

    // LC1 has 2 stages by default
    const stage1 = lc1.stageManager.stageList[0];
    stage1.options = { clashType: 'duplicate', tollerance: globalTolleranceFt, autointesect: true };
    stage1.updateSettingsUI();
    stage1.updateUI();

    lc1.stageManager.addStage();
    const stage2 = lc1.stageManager.stageList[1];
    stage2.options = { clashType: 'hard', tollerance: globalTolleranceFt, autointesect: true };
    stage2.updateSettingsUI();
    stage2.updateUI();

    // Create LC2
    const lc2 = new LC(this, 2);
    this.lcList.push(lc2);

    const lc2Stage1 = lc2.stageManager.stageList[0];
    lc2Stage1.options = { clashType: 'hard', tollerance: globalTolleranceFt, autointesect: false };
    lc2Stage1.updateSettingsUI();
    lc2Stage1.updateUI();

    this.renderUI();
    this.updateDefaultConfigButton();
  }
}
