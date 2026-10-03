import { downloadXml, cmToFeet } from './utils';
import { writeXmlLC1, writeXmlLC2 } from './clashXMLwriter';
import { buildClashMatrix, resetClashMatrix } from './clashMatrix';
import { clashSelectionSetManager, selectionSetsArray} from './clashSelectionSets';

const btnExportLC1 = document.getElementById(
  'btn-export-LC1'
) as HTMLButtonElement;
const btnExportLC2 = document.getElementById(
  'btn-export-LC2'
) as HTMLButtonElement;
const btnGenerateClashMatrix = document.getElementById(
  'btn-generate-clashmatrix'
) as HTMLButtonElement;
const btnRefreshClashMatrix = document.getElementById(
  'btn-refresh-clashmatrix'
) as HTMLButtonElement;

const clashGroupInput = document.getElementById(
  'clash-group-input'
) as HTMLInputElement;
const clashGroupList = document.getElementById(
  'clash-group-list'
) as HTMLUListElement;
const clashGroupAddBtn = document.getElementById(
  'add-clash-group-input'
) as HTMLButtonElement;

const clashMatrixLC2 = document.getElementById(
  'clashMatrix-LC2'
) as HTMLTableElement;

const globalToleranceInput = document.getElementById('global-tolerance-input') as HTMLInputElement;
const lc1ToleranceInput = document.getElementById('lc1-tolerance-input') as HTMLInputElement;
const lc2ToleranceInput = document.getElementById('lc2-tolerance-input') as HTMLInputElement;
const alertsContainer = document.getElementById('alerts-container') as HTMLDivElement;

function showAlert(message: string, type: 'success' | 'danger') {
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

globalToleranceInput.addEventListener('input', () => {
  const val = globalToleranceInput.value;
  lc1ToleranceInput.value = val;
  lc2ToleranceInput.value = val;
});

clashGroupAddBtn.addEventListener('click', (e: Event) => {
  e.preventDefault();

  const success = clashSelectionSetManager(clashGroupInput, clashGroupList);

  if (success) {
    btnExportLC2.disabled = true;
  }
});

clashGroupInput.addEventListener('input', () => {
    clashGroupInput.classList.remove('is-invalid');
});

btnGenerateClashMatrix.addEventListener('click', () => {
  buildClashMatrix(clashMatrixLC2, selectionSetsArray);

  btnGenerateClashMatrix.remove();

  btnRefreshClashMatrix.disabled = false;
  btnRefreshClashMatrix.style.display = 'block';
  btnExportLC2.disabled = false;
});

btnRefreshClashMatrix.addEventListener('click', () => {
  resetClashMatrix(clashMatrixLC2);

  buildClashMatrix(clashMatrixLC2, selectionSetsArray);

  btnExportLC2.disabled = false;
});

btnExportLC1.addEventListener('click', () => {
  if (selectionSetsArray.length === 0) {
    showAlert('Please add at least one Selection Set before exporting LC1.', 'danger');
    return;
  }
  const tolCm = parseFloat(lc1ToleranceInput.value) || 5;
  const tolFt = cmToFeet(tolCm);
  downloadXml('fileXML-LC1', writeXmlLC1(tolFt));
  showAlert('LC1 XML exported successfully!', 'success');
});

btnExportLC2.addEventListener('click', () => {
  const tolCm = parseFloat(lc2ToleranceInput.value) || 5;
  const tolFt = cmToFeet(tolCm);
  downloadXml('fileXML-LC2', writeXmlLC2(clashMatrixLC2, tolFt));
  showAlert('LC2 XML exported successfully!', 'success');
});

