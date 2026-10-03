type testSelectionSide = 'left' | 'right';

export function generateClashTest(
  name: string,
  type: string,
  tollerance: number,
  autointersect: boolean,
  selectionSetsLeft: string[],
  selectionSetsRight: string[] | null
) {
  const clashTestDefinition = `<clashtest name="${name}" test_type="${type}" status="new" tolerance="${tollerance}" merge_composites="1">
  <linkage mode="none"/>${defineSideSelection(
    'left',
    selectionSetsLeft,
    autointersect
  )}
  ${
    selectionSetsRight
      ? defineSideSelection(
          'right',
          selectionSetsRight,
          autointersect
        )
      : ``
  }
  <rules/>
</clashtest>
`;

  return clashTestDefinition;
}

function defineSideSelection(
  side: testSelectionSide,
  selectionSetsArray: string[],
  autointersect: boolean
) {
  let clashSelection = `<clashselection selfintersect="${
    autointersect ? 1 : 0
  }" primtypes="1">
  <locator>`;
  selectionSetsArray.forEach((group) => {
    clashSelection += `lcop_selection_set_tree/${group};`;
  });
  clashSelection = clashSelection.slice(0, -1);
  clashSelection += `</locator>
  </clashselection>`;

  const clashSideDefinition: string = `<${side}>
    ${clashSelection}
  </${side}>`;

  return clashSideDefinition;
}
