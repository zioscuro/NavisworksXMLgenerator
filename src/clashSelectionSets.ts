export const selectionSetsArray: string[] = [];

export function clashSelectionSetManager(clashGroupInput: HTMLInputElement, clashGroupList: HTMLUListElement) {
  const inputValue = clashGroupInput.value.trim();

  // Validation: Check for empty or duplicate names
  if (!inputValue) {
    clashGroupInput.classList.add('is-invalid');
    return false; // Indicates failure
  }

  if (selectionSetsArray.includes(inputValue)) {
    clashGroupInput.classList.add('is-invalid');
    return false; // Indicates failure
  }

  // Remove invalid class if valid
  clashGroupInput.classList.remove('is-invalid');

  const newClashGroupElement = document.createElement('li');
  newClashGroupElement.className = 'list-group-item d-flex justify-content-between align-items-center';

  const newClashGroupDescription = document.createElement('span');
  const newClashGroupCancBtn = document.createElement('button');

  newClashGroupDescription.textContent = inputValue;
  newClashGroupCancBtn.textContent = 'X';
  newClashGroupCancBtn.className = 'btn btn-danger btn-sm';

  newClashGroupElement.appendChild(newClashGroupDescription);
  newClashGroupElement.appendChild(newClashGroupCancBtn);

  selectionSetsArray.push(inputValue);

  clashGroupList.appendChild(newClashGroupElement);

  clashGroupInput.value = '';

  newClashGroupCancBtn.addEventListener('click', (e: MouseEvent) => {
    const selectedCancBtn = e.target as HTMLButtonElement
    const selectedClashGroup = selectedCancBtn.parentElement;

    if (!selectedClashGroup) return;

    const selectedClashGroupDescription =
      selectedClashGroup.querySelector('span') as HTMLSpanElement;

    if (!selectedClashGroupDescription.textContent) return;

    const selectecClashGroupIndex = selectionSetsArray.indexOf(
      selectedClashGroupDescription.textContent
    );

    clashGroupList.removeChild(selectedClashGroup);
    selectionSetsArray.splice(selectecClashGroupIndex, 1);
  });

  return true; // Indicates success
}