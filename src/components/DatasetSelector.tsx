import React from 'react';
import { Dataset, WriteMode } from '../types';

interface DatasetSelectorProps {
  datasets: Dataset[];
  selectedDataset?: string;
  selectedTable?: string;
  writeMode?: WriteMode;
  onDatasetChange: (dataset: string) => void;
  onTableChange: (table: string) => void;
  onWriteModeChange: (mode: WriteMode) => void;
  onNewDataset: () => void;
  onNewTable: () => void;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  datasets,
  selectedDataset,
  selectedTable,
  writeMode,
  onDatasetChange,
  onTableChange,
  onWriteModeChange,
  onNewDataset,
  onNewTable,
}) => {
  const selectedDatasetObj = datasets.find(d => d.name === selectedDataset);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dataset
        </label>
        <div className="flex gap-2">
          <select
            value={selectedDataset || ''}
            onChange={(e) => onDatasetChange(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Dataset</option>
            {datasets.map((dataset) => (
              <option key={dataset.id} value={dataset.name}>
                {dataset.name}
              </option>
            ))}
          </select>
          <button
            onClick={onNewDataset}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            New
          </button>
        </div>
      </div>

      {selectedDataset && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Table
          </label>
          <div className="flex gap-2">
            <select
              value={selectedTable || ''}
              onChange={(e) => onTableChange(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select Table</option>
              {selectedDatasetObj?.tables.map((table) => (
                <option key={table.id} value={table.name}>
                  {table.name}
                </option>
              ))}
            </select>
            <button
              onClick={onNewTable}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New
            </button>
          </div>
        </div>
      )}

      {selectedDataset && selectedTable && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Write Mode
          </label>
          <select
            value={writeMode || ''}
            onChange={(e) => onWriteModeChange(e.target.value as WriteMode)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select Write Mode</option>
            <option value="Append">Append - Add new rows to existing table</option>
            <option value="Merge">Merge - Combine data intelligently</option>
            <option value="Overwrite">Overwrite - Replace current table</option>
          </select>
        </div>
      )}
    </div>
  );
};