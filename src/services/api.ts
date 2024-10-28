import axios from 'axios';
import { Dataset, Schema, FileWithMetadata } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const findRegexMatch = async (filename: string) => {
  try {
    const response = await api.get(`/findregex/${filename}`);
    return response.data;
  } catch (error) {
    console.error('Error finding regex match:', error);
    return null;
  }
};

export const fetchDatasets = async (): Promise<Dataset[]> => {
  const response = await api.get('/datasets');
  return response.data;
};

export const uploadFile = async (
  file: FileWithMetadata,
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (file.metadata) {
    formData.append('metadata', JSON.stringify(file.metadata));
  }

  await api.post(`/upload/${file.name}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(progress);
      }
    },
  });
};

export const detectSchema = async (file: File): Promise<Schema> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/detect-schema', formData);
  return response.data;
};