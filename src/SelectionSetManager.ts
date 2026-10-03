export class SelectionSetManager {
  selectionSetsForm: HTMLFormElement;
  selectionSetsList: HTMLUListElement;
  selectionSets: string[] = [];

  constructor(form: HTMLFormElement, list: HTMLUListElement) {
    this.selectionSetsForm = form;
    this.selectionSetsList = list;

    this.selectionSetsForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      const data = new FormData(this.selectionSetsForm);
      const selectionSetName = data.get('selection-set') as string;

      if (!selectionSetName) {
        return;
      }
      this.addSelectionSet(selectionSetName);

      this.selectionSetsForm.reset();
    });
  }

  addSelectionSet(selectionSet: string) {
    this.selectionSets.push(selectionSet);

    const newSelectionSetElement = document.createElement('li');
    newSelectionSetElement.className = 'list-group-item d-flex justify-content-between align-items-center';

    const newSelectionSetDescription = document.createElement('span');
    newSelectionSetDescription.textContent = selectionSet;

    const newSelectionSetCancBtn = document.createElement('button');
    newSelectionSetCancBtn.textContent = 'X';
    newSelectionSetCancBtn.className = 'btn btn-danger btn-sm';
    newSelectionSetCancBtn.addEventListener(
      'click',
      this.removeSelectionSet.bind(this)
    );

    newSelectionSetElement.appendChild(newSelectionSetDescription);
    newSelectionSetElement.appendChild(newSelectionSetCancBtn);

    this.selectionSetsList.appendChild(newSelectionSetElement);
  }

  removeSelectionSet(e: Event) {
    const selectedCancBtn = e.target as HTMLButtonElement;
    const selectedSet = selectedCancBtn.parentElement;

    if (!selectedSet) return;

    const selectedSetDescription = selectedSet.querySelector(
      'span'
    ) as HTMLSpanElement;

    if (!selectedSetDescription.textContent) return;

    const selectedSetIndex = this.selectionSets.indexOf(
      selectedSetDescription.textContent
    );

    this.selectionSetsList.removeChild(selectedSet);
    this.selectionSets.splice(selectedSetIndex, 1);
  }
}
