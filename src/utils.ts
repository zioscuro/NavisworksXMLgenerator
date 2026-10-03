export function cmToFeet(cm: number): number {
  return cm * 0.0328084;
}

export function downloadXml(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/xml;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}