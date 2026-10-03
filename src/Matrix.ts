import { Stage } from './Stage';

export class Matrix {
  parentStage: Stage;
  matrixElement: HTMLTableElement;

  constructor(parent: Stage) {
    this.parentStage = parent;
    this.matrixElement = document.createElement('table');
    this.matrixElement.className = 'table table-sm table-bordered mt-3 bg-white';
  }

  renderMatrix() {
    this.matrixElement.innerHTML = '';
    if (this.parentStage.options.autointesect) {
      this.buildAutointersectMatrix();
    } else {
      this.buildClashMatrix();
    }
    this.parentStage.stageElement.appendChild(this.matrixElement);
  }

  buildAutointersectMatrix() {
    const selectionSets = this.parentStage.stageManager.selectionSets;
    if (selectionSets.length === 0) return;

    const thead = this.matrixElement.createTHead();
    const tbody = this.matrixElement.createTBody();

    const headerRow = document.createElement('tr');

    const thGroup = document.createElement('th');
    thGroup.textContent = 'Selection Sets';
    headerRow.appendChild(thGroup);

    const thSelect = document.createElement('th');
    thSelect.textContent = 'Generate Self-Intersect Test';
    thSelect.className = 'text-center';
    headerRow.appendChild(thSelect);

    thead.appendChild(headerRow);

    for (const group of selectionSets) {
      const row = document.createElement('tr');

      const tdGroup = document.createElement('td');
      tdGroup.textContent = group;
      row.appendChild(tdGroup);

      const tdCheckbox = document.createElement('td');
      tdCheckbox.className = 'text-center';
      tdCheckbox.setAttribute('data-selection-left', group);
      tdCheckbox.setAttribute('data-selection-right', group);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true; // Default selected
      checkbox.className = 'form-check-input';

      tdCheckbox.appendChild(checkbox);
      row.appendChild(tdCheckbox);

      tbody.appendChild(row);
    }
  }

  buildClashMatrix() {
    const selectionSets = this.parentStage.stageManager.selectionSets;

    if (selectionSets.length <= 1) {
      return;
    }

    const clashMatrixThead = this.matrixElement.createTHead();
    const clashMatrixTbody = this.matrixElement.createTBody();

    const rowHeader = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.textContent = '';

    rowHeader.appendChild(blankHeader);

    for (const group of selectionSets) {
      const header = document.createElement('th');
      header.textContent = group;

      rowHeader.appendChild(header);
    }

    clashMatrixThead.appendChild(rowHeader);

    for (const groupSelectionA of selectionSets) {
      const row = document.createElement('tr');
      const header = document.createElement('th');
      header.textContent = groupSelectionA;

      row.appendChild(header);

      for (const groupSelectionB of selectionSets) {
        const tdCell = document.createElement('td');
        tdCell.setAttribute('data-selection-left', groupSelectionA);
        tdCell.setAttribute('data-selection-right', groupSelectionB);

        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.checked = false;

        if (tdCell.dataset.selectionLeft === tdCell.dataset.selectionRight) {
          groupCheckbox.disabled = true;
        }

        groupCheckbox.className = 'form-check-input';

        tdCell.appendChild(groupCheckbox);
        row.appendChild(tdCell);
      }

      clashMatrixTbody.appendChild(row);
    }
  }
}
