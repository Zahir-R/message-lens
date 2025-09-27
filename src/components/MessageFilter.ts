import { Message } from '../../types/index';

export class MessageFilter {
    private defaultPatterns = {
        date: /\b\d{2}\/\d{2}\/\d{2}\b/,
        time: /\b\d{2}:\d{2}\b/,
        link: /https?:\/\/\S+/,
        place: /(classroom|hall|auditorium|lab|laboratory)\s+[A-Z0-9]+/i,
    };
    
    parseChatContent(content: string, parameters: any): Message[] {
        const messages: Message[] = [];
        const lines = content.split('\n');
        const messagePattern = /(\d{2}\/\d{2}\/\d{2}),\s(\d{2}:\d{2})\s-\s([^:]+):\s(.+)/;

        for (const line of lines) {
            const match = line.match(messagePattern);
            if (match) {
                const [, date, time, sender, message] = match;
                const [day, month, year] = date.split('/').map(Number);
                const [hours, minutes] = time.split(':').map(Number);
                const fullYear = 2000 + year;
                const datetime = new Date(fullYear, month - 1, day, hours, minutes);

                const { important, score, categories } = this.isImportant(message, sender, parameters);
                messages.push({
                    datetime,
                    sender: sender.trim(),
                    message: message.trim(),
                    important,
                    score,
                    categories
                });
            } else {
                if (messages.length > 0 && line.trim()) {
                    const lastMessage = messages[messages.length - 1];
                    lastMessage.message += '\n' + line.trim();
                }
            }
        }
        return messages;
    }

    private isImportant(message: string, sender: string, parameters: any): 
    { important: boolean; score: number; categories: string[] } {
        let score = 0;
        const senderLower = sender.toLowerCase();
        const categories: string[] = [];

        for (const [category, words] of Object.entries(parameters.keywords) as [string, string[]][]) {
            for (const word of words) {
                if (!word) continue;
                const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(message)) {
                    score += parameters.scores.keywordScore;
                    if (!categories.includes(category)) {
                        categories.push(category);
                    }
                }
            }
        }

        for (const [patternName, enabled] of Object.entries(parameters.patterns)) {
            if (enabled && this.defaultPatterns[patternName as keyof typeof this.defaultPatterns].test(message)) {
                score += parameters.scores.patternScore;
            }
        }

        for (const importantSender of parameters.importantSenders) {
            if (senderLower.includes(importantSender.toLowerCase())) {
                score += parameters.scores.senderScore;
                break;
            }
        }

        return {
            important: score >= parameters.scores.threshold,
            score,
            categories
        };
    }

    generateCategorizedReport(messages: Message[]): string {
        const importantMsgs = messages.filter(msg => msg.important);

        if (importantMsgs.length === 0) {
            return 'There are no recent important messages.';
        }

        const categorizedMessages: { [category: string]: Message[] } = {};
        importantMsgs.forEach(msg => {
            if (msg.categories.length === 0) {
                if (!categorizedMessages['General']) {
                    categorizedMessages['General'] = [];
                }
                categorizedMessages['General'].push(msg);
            } else {
                msg.categories.forEach(category => {
                    if (!categorizedMessages[category]) {
                        categorizedMessages[category] = [];
                    }
                    categorizedMessages[category].push(msg);
                })
            }
        })
        let report = 'IMPORTANT MESSAGES:\n\n';
        report += `Found ${importantMsgs.length} important messages\n`;
        report += "=".repeat(60) + "\n\n";

        for (const [category, msgs] of Object.entries(categorizedMessages)) {
            report += `${category.toUpperCase()} (${msgs.length} messages):\n `;
            report += '-'.repeat(40) + '\n';
            for (const msg of msgs) {
                report += `${msg.datetime.toLocaleString('en-US')} - ${msg.sender} (score: ${msg.score}):\n`;
                report += `${msg.message}\n\n`;
            }
            report += '='.repeat(60) + '\n\n';
        }
        return report;
    }
    generateReport(messages: Message[]): string {
        return this.generateCategorizedReport(messages);
    }
}