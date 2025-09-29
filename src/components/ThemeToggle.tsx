'use client';

import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <span className="sr-only">Toggle theme</span>
            <span
                className={`${
                    theme === 'light' ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
            />
            <span className="absolute inset-0 flex items-center justify-between px-1">
            <span className="text-xs">🌙</span>
            <span className="text-xs">☀️</span>
            </span>
        </button>
    );
}