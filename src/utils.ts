export function cmToFeet(cm: number): number {
  return cm * 0.0328084;
}

export function showAlert(message: string, type: 'success' | 'danger') {
  const alertsContainer = document.getElementById('alerts-container') as HTMLDivElement;
  if (!alertsContainer) return;
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