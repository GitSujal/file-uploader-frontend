import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileUp, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { DatasetSelector } from './DatasetSelector';
import { SchemaEditor } from './SchemaEditor';
import { FileWithMetadata, Dataset, WriteMode, Schema } from '../types';
import { findRegexMatch, fetchDatasets, detectSchema, uploadFile } from '../services/api';

const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
const MAX_FILES = 10;

export const FileUploader = () => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileWithMetadata | null>(null);
  const [showSchemaEditor, setShowSchemaEditor] = useState(false);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        const data = await fetchDatasets();
        setDatasets(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load datasets:', error);
        toast.error('Failed to load datasets');
        setDatasets([]);
      }
    };
    loadDatasets();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length + files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const validFiles = acceptedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 300MB limit`);
        return false;
      }
      return true;
    });

    const filesWithMetadata: FileWithMetadata[] = await Promise.all(
      validFiles.map(async (file) => {
        const match = await findRegexMatch(file.name);
        return {
          ...file,
          metadata: match || {},
        };
      })
    );

    setFiles(prev => [...prev, ...filesWithMetadata]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
  });

  const removeFile = (name: string) => {
    setFiles(files => files.filter(file => file.name !== name));
    if (selectedFile?.name === name) {
      setSelectedFile(null);
      setShowSchemaEditor(false);
    }
  };

  const handleFileSelect = async (file: FileWithMetadata) => {
    setSelectedFile(file);
    if (!file.metadata?.schema) {
      try {
        const schema = await detectSchema(file);
        setFiles(prev =>
          prev.map(f =>
            f.name === file.name
              ? { ...f, metadata: { ...f.metadata, schema } }
              : f
          )
        );
      } catch (error) {
        toast.error('Failed to detect schema');
      }
    }
  };

  const handleDatasetChange = (dataset: string) => {
    if (selectedFile) {
      setFiles(prev =>
        prev.map(f =>
          f.name === selectedFile.name
            ? {
                ...f,
                metadata: { ...f.metadata, dataset, table: undefined, writeMode: undefined },
              }
            : f
        )
      );
    }
  };

  const handleTableChange = (table: string) => {
    if (selectedFile) {
      setFiles(prev =>
        prev.map(f =>
          f.name === selectedFile.name
            ? {
                ...f,
                metadata: { ...f.metadata, table },
              }
            : f
        )
      );
    }
  };

  const handleWriteModeChange = (writeMode: WriteMode) => {
    if (selectedFile) {
      setFiles(prev =>
        prev.map(f =>
          f.name === selectedFile.name
            ? {
                ...f,
                metadata: { ...f.metadata, writeMode },
              }
            : f
        )
      );
    }
  };

  const handleSchemaChange = (schema: Schema) => {
    if (selectedFile) {
      setFiles(prev =>
        prev.map(f =>
          f.name === selectedFile.name
            ? {
                ...f,
                metadata: { ...f.metadata, schema },
              }
            : f
        )
      );
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    const invalidFiles = files.filter(
      file =>
        !file.metadata?.dataset ||
        !file.metadata?.table ||
        !file.metadata?.writeMode
    );

    if (invalidFiles.length > 0) {
      toast.error('Please complete dataset and table information for all files');
      return;
    }

    setUploading(true);

    try {
      await Promise.all(
        files.map(file =>
          uploadFile(file, (progress) => {
            setFiles(prev =>
              prev.map(f =>
                f.name === file.name ? { ...f, progress } : f
              )
            );
          })
        )
      );

      toast.success('All files uploaded successfully!');
      setFiles([]);
      setSelectedFile(null);
      setShowSchemaEditor(false);
    } catch (error) {
      toast.error('Failed to upload one or more files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg text-gray-700">
          {isDragActive ? (
            'Drop the files here...'
          ) : (
            'Drag & drop files here, or click to select files'
          )}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Up to {MAX_FILES} files, max 300MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Selected Files</h3>
          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={clsx(
                  'flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer transition-colors',
                  selectedFile?.name === file.name && 'ring-2 ring-blue-500'
                )}
                onClick={() => handleFileSelect(file)}
              >
                <div className="flex items-center space-x-3">
                  <FileUp className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {file.progress !== undefined && (
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.name);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedFile && (
            <div className="mt-6 space-y-6">
              <DatasetSelector
                datasets={datasets}
                selectedDataset={selectedFile.metadata?.dataset}
                selectedTable={selectedFile.metadata?.table}
                writeMode={selectedFile.metadata?.writeMode}
                onDatasetChange={handleDatasetChange}
                onTableChange={handleTableChange}
                onWriteModeChange={handleWriteModeChange}
                onNewDataset={() => {/* Implement new dataset creation */}}
                onNewTable={() => setShowSchemaEditor(true)}
              />

              {showSchemaEditor && selectedFile.metadata?.schema && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4">Edit Schema</h4>
                  <SchemaEditor
                    columns={selectedFile.metadata.schema.columns}
                    onChange={(columns) =>
                      handleSchemaChange({ columns })
                    }
                  />
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className={clsx(
              'mt-6 w-full py-3 px-4 rounded-lg text-white font-medium transition',
              uploading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      )}

      {files.length === 0 && (
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <AlertCircle className="h-5 w-5" />
            <p>No files selected</p>
          </div>
        </div>
      )}
    </div>
  );
};