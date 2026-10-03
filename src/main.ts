import { SelectionSetManager } from './SelectionSetManager';
import { LCManager } from './LCManager';
import { showAlert } from './utils';

const selectionSetsList = document.getElementById(
  'clash-group-list'
) as HTMLUListElement;
const selectionSetsForm = document.getElementById(
  'clash-group-form'
) as HTMLFormElement;

const lcListContainer = document.getElementById(
  'lc-list'
) as HTMLUListElement;

const selectionSetManager = new SelectionSetManager(selectionSetsForm, selectionSetsList);
const lcManager = new LCManager(lcListContainer, selectionSetManager.selectionSets);

const defaultBtn = document.getElementById('btn-default-config');
if (defaultBtn) {
  defaultBtn.addEventListener('click', () => {
    lcManager.generateDefaultConfig();
    showAlert('Default configuration loaded.', 'success');
  });
}

const addLcBtn = document.getElementById('btn-add-lc');
if (addLcBtn) {
  addLcBtn.addEventListener('click', () => {
    lcManager.addLC();
  });
}

const exportAllBtn = document.getElementById('btn-export-all-xml');
if (exportAllBtn) {
  exportAllBtn.addEventListener('click', () => {
    if (selectionSetManager.selectionSets.length === 0) {
      showAlert('Please add at least one Selection Set before exporting.', 'danger');
      return;
    }
    lcManager.exportAllXML();

  });
}
