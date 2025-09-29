import { useState } from 'react';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            onFileSelect(file);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Chat Export
            </label>
            <div className="flex items-center">
                <label className="flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border border-blue-50 dark:border-gray-600 cursor-pointer transition-colors duration-200 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white">
                    <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal text-center">Select a file</span>
                    <input type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
                </label>
                {fileName && (
                <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">{fileName}</span>
                )}
            </div>
        </div>
    );
}