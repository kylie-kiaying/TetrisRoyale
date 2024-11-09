export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
