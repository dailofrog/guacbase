// utils.tsx

export function getTimestampedImageUrl(imgurl: string): string {
    const timestamp = Date.now();
    const separator = imgurl.includes('?') ? '&' : '?';
    return `${imgurl}${separator}timestamp=${timestamp}`;
}

export function convertSeconds(seconds) {
    const hours = Math.floor(seconds / 3600); // 1 hour = 3600 seconds
    const minutes = Math.floor((seconds % 3600) / 60); // Remaining minutes
    const remainingSeconds = seconds % 60; // Remaining seconds

    return `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
}


export function toQueryString(params: Record<string, any>): string {
  const query = Object.entries(params)
    .filter(([key, value]) => value !== null) // Exclude pairs where value is null
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return query;
}

export function abbreviateAddress(address: string, charsLength: number = 3): string {
  if (typeof address !== 'string') return '';
  if (address.length < charsLength * 2 + 2) return address;

  const prefix = address.substr(0, charsLength + 2); // '0x' + charsLength characters
  const suffix = address.substr(-charsLength);

  return `${prefix}...${suffix}`;
}