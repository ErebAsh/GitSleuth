export function formatTimestamp(isoString: string): {
  readable: string;
  iso: string;
} {
  const dateObj = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  return {
    readable: dateObj.toLocaleString(undefined, options),
    iso: dateObj.toISOString(),
  };
}

export function extractRepoName(repositoryUrl: string): string {
  const parts = repositoryUrl.split('/');
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
  }
  return repositoryUrl;
}

export function getLabelTextColor(hexColor: string): string {
  if (!hexColor || hexColor.length < 6) return '#ffffff';
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}
