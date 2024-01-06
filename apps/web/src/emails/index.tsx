import { createTransport } from 'nodemailer';
import environmentVariables from '@/config/environment';

interface SendEmailProps {
    subject: string;
    to: string;
    html: string;
    text: string;
}

export const sendEmail=async ({ to, subject, html, text }: SendEmailProps) => {
    const transporter=createTransport({
        host: environmentVariables.email.host,
        port: environmentVariables.email.port,
        secure: true,
        auth: {
            user: environmentVariables.email.user,
            pass: environmentVariables.email.password,
        },
    });

    const options={
        from: environmentVariables.email.user,
        to: to,
        subject: subject,
        html: html,
        text: text,
    };

    try {
        await transporter.sendMail(options);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}
