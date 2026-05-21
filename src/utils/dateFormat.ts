// Format a date string 'YYYY-MM-DD' → 'YYYY/MM/DD'
export function fmtDate(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  return dateStr.replace(/-/g, '/');
}

// Compute ISO week string 'WW/YY' from a date string 'YYYY-MM-DD'
export function dateToWeek(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  const d = new Date(Date.UTC(
    parseInt(dateStr.slice(0, 4)),
    parseInt(dateStr.slice(5, 7)) - 1,
    parseInt(dateStr.slice(8, 10))
  ));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${String(week).padStart(2, '0')}/${yy}`;
}

// Compute Monday date 'YYYY/MM/DD' from ISO week string 'WW/YY'
export function weekToDate(weekStr: string | undefined): string {
  if (!weekStr) return '—';
  const [wPart, yPart] = weekStr.split('/');
  const week = parseInt(wPart);
  const fullYear = 2000 + parseInt(yPart);
  // Jan 4 is always in week 1
  const jan4 = new Date(Date.UTC(fullYear, 0, 4));
  const dow = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dow + 1 + (week - 1) * 7);
  const y = monday.getUTCFullYear();
  const m = String(monday.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(monday.getUTCDate()).padStart(2, '0');
  return `${y}/${m}/${dd}`;
}

// Combined: 'YYYY/MM/DD (WW/YY)' from a date string
export function dateWithWeek(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  return `${fmtDate(dateStr)} (${dateToWeek(dateStr)})`;
}

// Combined: 'YYYY/MM/DD (WW/YY)' from a week string (uses Monday of that week)
export function weekWithDate(weekStr: string | undefined): string {
  if (!weekStr) return '—';
  return `${weekToDate(weekStr)} (${weekStr})`;
}
