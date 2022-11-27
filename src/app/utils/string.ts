export function toTitleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function abbrAddr(base58: string, size = 4) {
  return base58.slice(0, size + 2) + '…' + base58.slice(-size);
}
