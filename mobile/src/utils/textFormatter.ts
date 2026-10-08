export function cleanText(input: string | null | undefined): string {
  if (!input) return '';
  return input.trim();
}

export function formatPageCitation(source: string, pageNumber: number): string {
  return `${source}, Page ${pageNumber}`;
}

