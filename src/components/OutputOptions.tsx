interface OutputOptionsProps {
    email: string;
    sendEmail: boolean;
    downloadFile: boolean;
    onEmailChange: (email: string) => void;
    onSendEmailChange: (send: boolean) => void;
    onDownloadChange: (download: boolean) => void;
}

export default function OutputOptions({
    email,
    sendEmail,
    downloadFile,
    onEmailChange,
    onSendEmailChange,
    onDownloadChange
    }: OutputOptionsProps) {
        return (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Output Options</h2>
                <div className="mb-4">
                    <label className="flex items-center hover:cursor-pointer">
                        <input
                            type="checkbox"
                            checked={downloadFile}
                            onChange={(e) => onDownloadChange(e.target.checked)}
                            className="mr-2 hover:cursor-pointer"
                        />
                        Download important messages file
                    </label>
                </div>
                <div>
                    <label className="flex items-center mb-2 hover:cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => onSendEmailChange(e.target.checked)}
                            className="mr-2 hover:cursor-pointer"
                        />
                        Send email notification
                    </label>
                    {sendEmail && (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full p-2 border rounded mt-2"
                        />
                    )}
                </div>
            </div>
        );
    }