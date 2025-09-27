import { useState, useEffect } from 'react';
import { FilterParameters } from '../../types/index';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface ParameterPanelProps {
    parameters: FilterParameters;
    onChange: (params: FilterParameters) => void;
}

export default function ParameterPanel({ parameters, onChange }: ParameterPanelProps) {
    const [advancedVisible, setAdvancedVisible] = useState(false);
    const [importantSendersInput, setImportantSendersInput] = useState(parameters.importantSenders.join(', '));
    const [newCategoryName, setNewCategoryName] = useState('');

    const [keywordInputs, setKeywordInputs] = useState(
        Object.fromEntries(
            Object.entries(parameters.keywords).map(([category, words]) => [category, words.join(', ')])
        )
    );

    useEffect(() => {
        setKeywordInputs(
            Object.fromEntries(
                Object.entries(parameters.keywords).map(([category, words]) => [category, words.join(', ')])
            )
        );
        setImportantSendersInput(parameters.importantSenders.join(', '));
    }, [parameters.keywords, parameters.importantSenders]);

    const handleKeywordInputChange = (category: string, value: string) => {
        setKeywordInputs(inputs => ({ ...inputs, [category]: value }));
    };

    const handleKeywordInputBlur = (category: string) => {
        const words = keywordInputs[category]
            .split(',')
            .map(w => w.trim())
            .filter(w => w);
        const newKeywords = { ...parameters.keywords, [category]: words };
        onChange({ ...parameters, keywords: newKeywords });
    };

    const handleImportantSendersChange = (value: string) => {
        setImportantSendersInput(value);
    }

    const handleImportantSendersBlur = () => {
        const newSenders = importantSendersInput
            .split(',')
            .map(s => s.trim())
            .filter(s => s);
        onChange({ ...parameters, importantSenders: newSenders });
    }

    const addNewCategory = () => {
        if (!newCategoryName.trim()) return;
        
        const cleanName = newCategoryName.trim().toLowerCase();
        if (parameters.keywords[cleanName]) {
            setNewCategoryName('');
            return;
        }

        const newKeywords = {
            ...parameters.keywords,
            [cleanName]: []
        };
        
        setKeywordInputs(inputs => ({ ...inputs, [cleanName]: '' }));
        onChange({ ...parameters, keywords: newKeywords });
        setNewCategoryName('');
    };

    const removeCategory = (category: string) => {
        const newKeywords = { ...parameters.keywords };
        delete newKeywords[category];
        
        setKeywordInputs(inputs => {
            const newInputs = { ...inputs };
            delete newInputs[category];
            return newInputs;
        });
        
        onChange({ ...parameters, keywords: newKeywords });
    };

    const updateCategoryName = (oldName: string, newName: string) => {
        if (!newName.trim() || newName === oldName) return;
        
        const cleanNewName = newName.trim().toLowerCase();
        if (parameters.keywords[cleanNewName] && cleanNewName !== oldName) {
            return;
        }

        const newKeywords = { ...parameters.keywords };
        const keywords = newKeywords[oldName];
        delete newKeywords[oldName];
        newKeywords[cleanNewName] = keywords;

        setKeywordInputs(inputs => {
            const newInputs = { ...inputs };
            newInputs[cleanNewName] = newInputs[oldName];
            delete newInputs[oldName];
            return newInputs;
        });

        onChange({ ...parameters, keywords: newKeywords });
    };

    const updatePattern = (pattern: keyof typeof parameters.patterns, value: boolean) => {
        const newPatterns = { ...parameters.patterns, [pattern]: value };
        onChange({ ...parameters, patterns: newPatterns });
    };

    const updateScore = (key: keyof typeof parameters.scores, value: number) => {
        const newScores = { ...parameters.scores, [key]: value };
        onChange({ ...parameters, scores: newScores });
    };

    return (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Filter Parameters</h2>
        
            <div className="mb-4">
                <h3 className="font-medium mb-2">Pattern Detection</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(parameters.patterns).map(([pattern, enabled]) => (
                    <label key={pattern} className="flex items-center hover:cursor-pointer">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => updatePattern(pattern as keyof typeof parameters.patterns, e.target.checked)}
                            className="mr-2 hover:cursor-pointer"
                        />
                        {pattern.replace('_', ' ')}
                    </label>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="font-medium mb-2">Important Senders</h3>
                <input
                    type="text"
                    value={importantSendersInput}
                    onChange={(e) => handleImportantSendersChange(e.target.value)}
                    onBlur={handleImportantSendersBlur}
                    placeholder="Prof, CS, IT, etc."
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                onClick={() => setAdvancedVisible(!advancedVisible)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 cursor-pointer"
            >
                {advancedVisible ? 'Hide' : 'Show'} Advanced Settings
            </button>

            {advancedVisible && (
                <div className="mt-4 p-4 bg-white rounded border">
                    <h3 className="font-medium mb-2">Keyword Categories</h3>

                    <div className="mb-4 flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New category name"
                            className="flex-1 p-2 border rounded text-sm min-w-0"
                            onKeyPress={(e) => e.key === 'Enter' && addNewCategory()}
                        />
                        <button
                            onClick={addNewCategory}
                            className="font-medium bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm cursor-pointer flex items-center justify-center gap-1 sm:w-auto w-full sm:px-2 py-1"
                        >
                            <FaPlus /> Add
                        </button>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(parameters.keywords).map(([category]) => (
                            <div key={category} className="p-3 border rounded">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => updateCategoryName(category, e.target.value)}
                                        onBlur={(e) => updateCategoryName(category, e.target.value)}
                                        className="font-medium border-b border-dashed border-gray-300 focus:border-solid focus:border-blue-500 flex-1 min-w-0 text-sm sm:text-base"
                                    />
                                    <button
                                        onClick={() => removeCategory(category)}
                                        className="bg-red-500 text-white rounded hover:bg-red-600 text-sm cursor-pointer flex items-center justify-center gap-1 sm:w-auto w-full sm:px-2 py-1"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={keywordInputs[category] ?? ''}
                                    onChange={(e) => handleKeywordInputChange(category, e.target.value)}
                                    onBlur={() => handleKeywordInputBlur(category)}
                                    className="w-full p-2 border rounded text-sm"
                                    placeholder="comma, separated, keywords"
                                />
                            </div>
                        ))}
                    </div>

                    <h3 className="font-medium mt-4 mb-2">Scoring System</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Keyword Score</label>
                            <input
                                type="number"
                                value={parameters.scores.keywordScore}
                                onChange={(e) => updateScore('keywordScore', Number(e.target.value))}
                                className="w-full p-2 border rounded text-sm"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Pattern Score</label>
                            <input
                                type="number"
                                value={parameters.scores.patternScore}
                                onChange={(e) => updateScore('patternScore', Number(e.target.value))}
                                className="w-full p-2 border rounded text-sm"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Sender Score</label>
                            <input
                                type="number"
                                value={parameters.scores.senderScore}
                                onChange={(e) => updateScore('senderScore', Number(e.target.value))}
                                className="w-full p-2 border rounded text-sm"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Threshold</label>
                            <input
                                type="number"
                                value={parameters.scores.threshold}
                                onChange={(e) => updateScore('threshold', Number(e.target.value))}
                                className="w-full p-2 border rounded text-sm"
                                min="1"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );    
}