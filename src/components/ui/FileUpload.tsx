import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  onFileRemove: (file: File) => void;
  selectedFiles: File[];
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  maxFiles?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  selectedFiles,
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  },
  maxFiles = 5
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
  });

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + ' B';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    else return (size / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Max file size: {formatFileSize(maxSize)} | Accepted formats: PDF, DOC, DOCX, JPG, PNG
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Selected Files:</p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{file.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
              </div>
              <button
                onClick={() => onFileRemove(file)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;