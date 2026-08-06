// FILE: takato56-adidolf_frontend/lib/utils/export.ts

export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  data: T[]
): void {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  // Extract unique column headers across all items
  const headers = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  );

  const escapeCsvValue = (value: any): string => {
    if (value === null || value === undefined) return '""';
    let str = typeof value === 'object' ? JSON.stringify(value) : String(value);
    // Escape quotes for CSV compliance
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows: string[] = [];

  // Add Header Row
  csvRows.push(headers.map((h) => `"${h}"`).join(','));

  // Add Data Rows
  for (const row of data) {
    const values = headers.map((header) => escapeCsvValue(row[header]));
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  
  // \uFEFF enables UTF-8 BOM for Microsoft Excel / Google Sheets compatibility
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}