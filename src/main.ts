import { SelectionSetManager } from './SelectionSetManager';
import { LCManager } from './LCManager';

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
    lcManager.exportAllXML();
  });
}
