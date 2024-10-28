import React from 'react';
import { FileUploader } from './components/FileUploader';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <FileUploader />
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;