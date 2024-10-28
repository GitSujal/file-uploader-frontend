import React from 'react';
import { Column } from '../types';

interface SchemaEditorProps {
  columns: Column[];
  onChange: (columns: Column[]) => void;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({
  columns,
  onChange,
}) => {
  const handleColumnChange = (index: number, field: keyof Column, value: any) => {
    const newColumns = [...columns];
    newColumns[index] = { ...newColumns[index], [field]: value };
    onChange(newColumns);
  };

  const SQL_TYPES = [
    'INTEGER',
    'BIGINT',
    'DECIMAL',
    'VARCHAR',
    'TEXT',
    'DATE',
    'TIMESTAMP',
    'BOOLEAN',
  ];

  const SENSITIVITY_LEVELS = ['Public', 'Internal', 'PII', 'Sensitive'];
  const ACTIONS = ['Redact', 'Anonymize', 'Mask', 'Drop'];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Column Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Nullable
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Primary Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sort Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sensitivity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {columns.map((column, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) =>
                    handleColumnChange(index, 'name', e.target.value)
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={column.type}
                  onChange={(e) =>
                    handleColumnChange(index, 'type', e.target.value)
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  {SQL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={column.nullable}
                  onChange={(e) =>
                    handleColumnChange(index, 'nullable', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={column.isPrimaryKey}
                  onChange={(e) =>
                    handleColumnChange(index, 'isPrimaryKey', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={column.isSortKey}
                  onChange={(e) =>
                    handleColumnChange(index, 'isSortKey', e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={column.sensitivity}
                  onChange={(e) =>
                    handleColumnChange(
                      index,
                      'sensitivity',
                      e.target.value as Column['sensitivity']
                    )
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  {SENSITIVITY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  multiple
                  value={column.actions || []}
                  onChange={(e) =>
                    handleColumnChange(
                      index,
                      'actions',
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  {ACTIONS.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};