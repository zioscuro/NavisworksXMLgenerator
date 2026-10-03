import { generateClashTest } from './clashGenerator';
import { LC } from './LC';

export const XML_HEADER = `<?xml version="1.0" encoding="UTF-8" ?>

<exchange xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://download.autodesk.com/us/navisworks/schemas/nw-exchange-12.0.xsd" units="ft" filename="" filepath="">
  <batchtest name="LRA-NavisworksXMLgenerator" internal_name="LRA-NavisworksXMLgenerator" units="ft">
    <clashtests>
`;

export const XML_FOOTER = `</clashtests>
<selectionsets/>
</batchtest>
</exchange>`;

function padTo3Digits(num: number): string {
  return num.toString().padStart(3, '0');
}

export function writeXmlForLCs(lcs: LC[]): string {
  let output = XML_HEADER;

  for (const lc of lcs) {
    for (const stage of lc.stageManager.stageList) {
      const isAutointersect = stage.options.autointesect;
      const type = stage.options.clashType;
      const tolerance = stage.options.tollerance;
      const matrixTable = stage.stageMatrix.matrixElement;

      let testCounter = 1;

      if (isAutointersect) {
        // Find checked checkboxes
        const checkedInputs = matrixTable.querySelectorAll('input:checked');

        checkedInputs.forEach((input) => {
          const td = input.closest('td');
          if (!td) return;
          const groupName = td.getAttribute('data-selection-left');
          if (!groupName) return;

          const testName = `LC${lc.lcNumber}-STAGE${stage.stageNumber}_${padTo3Digits(testCounter)}_${groupName}`;

          output += generateClashTest(
            testName,
            type,
            tolerance,
            true,
            [groupName],
            null
          );

          testCounter++;
        });

      } else {
        // Matrix mode
        const checkedRows = [
          ...matrixTable.querySelectorAll('tr:has(input:checked)'),
        ] as HTMLTableRowElement[];

        checkedRows.forEach((tr) => {
          const selectionLeft: string[] = [];
          const selectionRight: string[] = [];

          const rowHeader = tr.querySelector('th');
          if (!rowHeader || !rowHeader.textContent) return;

          const selectedLeft = rowHeader.textContent;
          selectionLeft.push(selectedLeft);

          const checkedInputs = tr.querySelectorAll('input:checked');
          checkedInputs.forEach((input) => {
            const td = input.closest('td');
            if (!td) return;
            const selectedRight = td.getAttribute('data-selection-right');
            if (selectedRight) {
              selectionRight.push(selectedRight);
            }
          });

          if (selectionRight.length > 0) {
             const testName = `LC${lc.lcNumber}-STAGE${stage.stageNumber}_${padTo3Digits(testCounter)}_${selectedLeft}`;
             output += generateClashTest(
               testName,
               type,
               tolerance,
               false,
               selectionLeft,
               selectionRight
             );
             testCounter++;
          }
        });
      }
    }
  }

  output += XML_FOOTER;
  return output;
}
