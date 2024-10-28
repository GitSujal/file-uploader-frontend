export interface Dataset {
  id: string;
  name: string;
  tables: Table[];
}

export interface Table {
  id: string;
  name: string;
  schema?: Schema;
}

export interface Schema {
  columns: Column[];
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isSortKey: boolean;
  comments: string;
  sensitivity: 'Sensitive' | 'PII' | 'Internal' | 'Public';
  actions?: ('Redact' | 'Anonymize' | 'Mask' | 'Drop')[];
}

export type WriteMode = 'Append' | 'Merge' | 'Overwrite';

export interface FileMetadata {
  dataset?: string;
  table?: string;
  writeMode?: WriteMode;
  schema?: Schema;
}

export interface FileWithMetadata extends File {
  metadata?: FileMetadata;
  progress?: number;
}