import { NextRequest, NextResponse } from 'next/server';
import { MessageFilter } from '../../../components/MessageFilter';
import { ProcessResponse } from '../../../../types';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const parametersString = formData.get('parameters') as string;

        if (!file) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'No file uploaded. Please select a chat export file.' 
                },
                { status: 400 }
            );
        }

        const content = await file.text();
        if (!content.trim()) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'The uploaded file is empty. Please check your file and try again.' 
                },
                { status: 400 }
            );
        }
        const parameters = JSON.parse(parametersString);

        const filter = new MessageFilter();
        const messages = filter.parseChatContent(content, parameters);
        const report = filter.generateCategorizedReport(messages);

        const response: ProcessResponse = {
            report,
            messageCount: messages.length,
            importantCount: messages.filter(m => m.important).length
        };

        return NextResponse.json({
            success: true,
            ...response
        });
    } catch (error) {
        console.error('Processing error:', error);
        let errorMessage = 'Failed to process chat file.';
        if (error instanceof SyntaxError) {
            errorMessage = 'Invalid parameters format. Please try refreshing the page.';
        } else if (error instanceof Error) {
            errorMessage = `Processing error: ${error.message}`;
        }

        return NextResponse.json(
            { 
                success: false,
                error: errorMessage 
            },
            { status: 500 }
        );
    }
}