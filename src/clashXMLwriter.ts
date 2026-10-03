import { generateClashTest } from './clashGenerator';
import { selectionSetsArray } from './clashSelectionSets';

const XML_HEADER = `<?xml version="1.0" encoding="UTF-8" ?>

<exchange xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://download.autodesk.com/us/navisworks/schemas/nw-exchange-12.0.xsd" units="ft" filename="" filepath="">
  <batchtest name="LRA-NavisworksXMLgenerator" internal_name="LRA-NavisworksXMLgenerator" units="ft">
    <clashtests>
`;

const XML_FOOTER = `</clashtests>
<selectionsets/>
</batchtest>
</exchange>`;

export function writeXmlLC1(toleranceFt: number) {
  let output = XML_HEADER;

  for (const selectionSet of selectionSetsArray) {
    output += generateClashTest(
      selectionSetsArray.indexOf(selectionSet),
      `_LC1-STAGE1_${selectionSet}`,
      'duplicate',
      toleranceFt,
      true,
      [selectionSet],
      null
    );
  }

  for (const selectionSet of selectionSetsArray) {
    output += generateClashTest(
      selectionSetsArray.indexOf(selectionSet),
      `_LC1-STAGE2_${selectionSet}`,
      'hard',
      toleranceFt,
      true,
      [selectionSet],
      null
    );
  }

  output += XML_FOOTER;

  return output;
}

export function writeXmlLC2(clashMatrix: HTMLTableElement, toleranceFt: number) {
  let output = XML_HEADER;

  const checkedRows = [
    ...clashMatrix.querySelectorAll('tr:has(input:checked)'),
  ] as HTMLTableRowElement[];

  checkedRows.forEach((tr) => {
    const reportNumber = checkedRows.indexOf(tr) + 1;

    const selectionLeft: string[] = [];
    const selectionRight: string[] = [];

    const rowHeader: HTMLTableCellElement | null = tr.querySelector('th');
    if (!rowHeader) return;

    const selectedLeft: string | null = rowHeader.textContent;
    if (!selectedLeft) return;

    selectionLeft.push(selectedLeft);

    const selectedRightArray = [
      ...tr.querySelectorAll('td:has(input:checked)'),
    ] as HTMLTableCellElement[];

    selectedRightArray.forEach((td) => {
      const selectedRight: string | undefined = td.dataset.selectionRight;

      if (!selectedRight) return;

      selectionRight.push(selectedRight);
    });

    output += generateClashTest(
      reportNumber,
      `_LC2-STAGE1_${selectedLeft}`,
      'hard',
      toleranceFt,
      false,
      selectionLeft,
      selectionRight
    );
  });

  output += XML_FOOTER;

  return output;
}
