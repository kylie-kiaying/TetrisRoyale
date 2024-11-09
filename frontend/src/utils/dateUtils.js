export function formatDateMedium(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
