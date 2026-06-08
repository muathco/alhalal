export function formatSar(amount: number): string {
  return `${amount.toLocaleString('ar-SA')} ر.س`;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
