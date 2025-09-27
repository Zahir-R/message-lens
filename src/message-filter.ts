import * as fs from 'fs';
import * as readline from 'readline';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

interface Message {
    datetime: Date;
    sender: string;
    message: string;
    important: boolean;
    score: number;
}

interface KeywordCategories {
    [category: string]: string[];
}

interface Patterns {
    [patternName: string]: RegExp;
}

class MessageFilter {
    private keywords: KeywordCategories = {
        'event': ['speech', 'conference', 'seminar', 'workshop', 'event'],
        'scholar': ['partial', 'exam', 'test', 'suspension', 'class', 'lab'],
        'oportunity': ['volunteering', 'internship', 'scholarship', 'contest', 'hackathon', 'competition'],
        'important': ['urgent', 'important', 'attention', 'mandatory', 'attendance'],
        'technology': ['programming', 'python', 'java', 'web', 'app', 'coding', 'development', 'frontend', 'backend']
    };

    private patterns: Patterns = {
        'date': /\b\d{2}\/\d{2}\/\d{2}\b/,
        'time': /\b\d{2}:\d{2}\b/,
        'link': /https?:\/\/\S+/,
        'place': /(classroom|hall|auditorium|lab|laboratory)\s+[A-Z0-9]+/i,
        'attached_file': /(\(file attached\)|IMG-|PTT-|Media omitted)/
    };

    private importantSenders: string[] = [
        'SYS', 'CS', 'IT', 'Ms', 'Mr', 'Prof'
    ];

    async parseChat(filePath: string): Promise<Message[]> {
        const messages: Message[] = [];
        const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
        
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const messagePattern = /(\d{2}\/\d{2}\/\d{2}),\s(\d{2}:\d{2})\s-\s([^:]+):\s(.+)/;
    
        for await (const line of rl) {
            const match = line.match(messagePattern);
            if (match) {
                const [date, time, sender, message] = match;
                const [day, month, year] = date.split('/').map(Number);
                const [hours, minutes] = time.split(':').map(Number);
                const fullYear = 2000 + year;
                const datetime = new Date(fullYear, month - 1, day, hours, minutes);

                const { important, score } = this.isImportant(message, sender);
                messages.push({
                    datetime,
                    sender: sender.trim(),
                    message: message.trim(),
                    important,
                    score
                });
            }
        }
    return messages;
    }

    private isImportant(message: string, sender: string): { important: boolean; score: number } {
        let score = 0;
        const messageLower = message.toLowerCase();
        const senderLower = sender.toLowerCase();
        const hasAttachment = this.patterns.attached_file.test(message);

        for (const category of Object.values(this.keywords)) {
            for (const word of category) {
                if (messageLower.includes(word)) {
                    score += 3;
                }
            }
        }

        for (const [patternName, pattern] of Object.entries(this.patterns)) {
            if (patternName !== 'attached_file' && pattern.test(message)) {
                score += 2;
            }
        }

        if (hasAttachment) {
            if (score > 0) score += 1;
            else score += 0.5;
        }

        for (const importantSender of this.importantSenders) {
            if (senderLower.includes(importantSender.toLowerCase())) {
                score += 2;
                break;
            }
        }

        return {
            important: score >= 5,
            score
        };
    }

    generateReport(messages: Message[]): string {
        const importantMsgs = messages.filter(msg => msg.important);
    
        if (importantMsgs.length === 0) {
            return 'There are no recent important messages.';
        }

        let report = 'IMPORTANT MESSAGES:\n\n';
        report += `Found ${importantMsgs.length} important messages\n`;
        report += "=".repeat(60) + "\n\n";

        for (const msg of importantMsgs) {
            report += `${msg.datetime.toLocaleString('en-US')} - ${msg.sender} (score: ${msg.score}):\n`;
            report += `${msg.message}\n`;
            report += "-".repeat(60) + "\n\n";
        }
        return report;
    }

    async sendEmailNotification(report: string, email: string): Promise<void> {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email not configured');
            return;
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: 'example@gmail.com',
            to: email,
            subject: 'Summary of important messages',
            text: report
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Notification mail sent succesfully');
        } catch (error) {
            console.error('Error sending file:', error);
        }
    }

    async saveToFile(report: string, filename: string = 'important_messages.txt'): Promise<void> {
        try {
            await fs.promises.writeFile(filename, report, 'utf-8');
            console.log(`Report saved in ${filename}`);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }
}

async function main() {
    const filter = new MessageFilter();
    const chatPath = process.env.CHAT_PATH || 'examples/chat.txt';
    try {
        const messages = await filter.parseChat(chatPath);
        const report = filter.generateReport(messages);
        console.log(report);

        await filter.saveToFile(report);
        // Email (optional - configure)
        // await filter.sendEmailNotification(report, 'example@gmail.com');
    
    } catch (error) {
        console.error('Error:', error);
    }
}

main();