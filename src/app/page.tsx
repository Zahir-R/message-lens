'use client';

import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ParameterPanel from '../components/ParameterPanel';
import OutputOptions from '../components/OutputOptions';
import Toast from '../components/Toast';
import { FilterParameters } from '../../types/index';

const defaultParameters: FilterParameters = {
    keywords: {
        'important': ['urgent', 'important', 'attention', 'mandatory', 'attendance'],
    },
    patterns: {
        date: true,
        time: true,
        link: true,
        place: true
    },
    importantSenders: ['SYS', 'CS', 'IT', 'Ms', 'Mr', 'Prof'],
    scores: {
        keywordScore: 3,
        patternScore: 2,
        senderScore: 2,
        threshold: 5
    }
};

type ToastType = 'success' | 'error' | 'info';

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [parameters, setParameters] = useState<FilterParameters>(defaultParameters);
    const [email, setEmail] = useState('');
    const [sendEmail, setSendEmail] = useState(false);
    const [downloadFile, setDownloadFile] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<{ messageCount: number; importantCount: number; report?: string } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [toast, setToast] = useState<{
        isVisible: boolean;
        message: string;
        type: ToastType;
    }>({
        isVisible: false,
        message: '',
        type: 'info'
    });

    const showToast = (message: string, type: ToastType = 'info') => {
        setToast({
            isVisible: true,
            message,
            type
        });
    }

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    }

    const handleProcess = async () => {
        if (!file) {
            showToast('Please select a file to upload', 'error');
            return;
        }
    
        setProcessing(true);
        setShowPreview(false);
        try {            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('parameters', JSON.stringify(parameters));
            
            const processResponse = await fetch('/api/process', {
                method: 'POST',
                body: formData,
            });
        
            const processData = await processResponse.json();
        
            if (!processResponse.ok || !processData.success) {
                throw new Error(processData.error || 'Failed to process file');
            }
        
            setResult(processData);
        
            if (downloadFile) {
                const blob = new Blob([processData.report], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'important_messages.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showToast('File processed and downloaded successfully!', 'success');
            } else {
                showToast('File processed successfully!', 'success');
            }
        
            if (sendEmail && email) {
                const emailFormData = new FormData();
                emailFormData.append('report', processData.report);
                emailFormData.append('email', email);
                
                const emailResponse = await fetch('/api/email', {
                    method: 'POST',
                    body: emailFormData,
                });
            
                const emailResult = await emailResponse.json();
            
                if (!emailResponse.ok || !emailResult.success) {
                    throw new Error(emailResult.error || 'Failed to send email');
                }
            
                showToast('Email sent successfully!', 'success');
            } else if (sendEmail && !email) {
                showToast('Please enter an email address', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            
            let errorMessage = 'An error occurred while processing your request.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            showToast(errorMessage, 'error');
        } finally {
            setProcessing(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-black mb-8">Message Lens</h1>
        
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-black">
                    <FileUpload onFileSelect={setFile} />
                    <ParameterPanel parameters={parameters} onChange={setParameters} />
                    <OutputOptions
                        email={email}
                        sendEmail={sendEmail}
                        downloadFile={downloadFile}
                        onEmailChange={setEmail}
                        onSendEmailChange={setSendEmail}
                        onDownloadChange={setDownloadFile}
                    />
                    <button
                        onClick={handleProcess}
                        disabled={!file || processing}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Processing...' : 'Process Chat'}
                    </button>
                </div>
        
                {result && (
                    <div className="bg-white rounded-lg shadow-md p-6 text-black" >
                        <h2 className="text-xl font-semibold mb-4">Results</h2>
                        <p>Processed {result.messageCount} messages</p>
                        <p>Found {result.importantCount} important messages</p>
                        {result.importantCount > 0 && (
                            <div className="mt-4">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 cursor-pointer"
                                >
                                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                                </button>
                                {showPreview && result.report && (
                                    <div className="mt-4">
                                        <h3 className="font-medium mb-2">Report Preview:</h3>
                                        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm whitespace-pre-wrap">
                                            {result.report}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.isVisible}
                    onClose={hideToast}
                    duration={4000}
                />
            </div>
        </div>
    );
}