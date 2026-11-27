export function csvCell(value: string | number): string {
  const text = String(value);
  const safe = typeof value === "string" && (/^[\s\u0000-\u001f]*[=+\-@]/.test(text) || /^ *[\t\r\n]/.test(text)) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function csvRows(rows: (string | number)[][]): string {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
