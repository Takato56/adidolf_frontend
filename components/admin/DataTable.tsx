'use client';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  title: string;
}

export function DataTable({ columns, data, title }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-surface-secondary border-b border-border">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-text-primary"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-divider">
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-surface-secondary transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-text-primary"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-text-muted text-sm"
              >
                No {title.toLowerCase()} found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
