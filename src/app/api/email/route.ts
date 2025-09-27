import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const rateLimitMap = new Map();

export async function POST(request: NextRequest) {
    try {
        const forwardedFor = request.headers.get('x-forwarded-for');
        const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
        const now = Date.now();
        const lastRequest = rateLimitMap.get(clientIp);

        if (lastRequest && (now - lastRequest) < 60000) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Rate limit exceeded. Please wait 1 minute between requests.'
                },
                { status: 429 }
            );
        }
        rateLimitMap.set(clientIp, now);

        if (rateLimitMap.size > 1000) {
            const oneMinuteAgo = now - 60000;
            for (const [ip, timestamp] of rateLimitMap.entries()) {
                if (timestamp < oneMinuteAgo) {
                    rateLimitMap.delete(ip);
                }
            }
        }
        
        const formData = await request.formData();
        const report = formData.get('report') as string;
        const email = formData.get('email') as string;

        if (!report || !email) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Missing report or email' 
                },
                { status: 400 }
            );
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'Email service is not configured properly. Please try again later.' 
                },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Important Messages Report',
            text: report,
        };

        await transporter.sendMail(mailOptions);
        
        return NextResponse.json({ 
            success: true,
            message: 'Email sent successfully' 
        });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: 'Failed to send email. Please check your email address and try again.' 
            },
            { status: 500 }
        );
    }
}