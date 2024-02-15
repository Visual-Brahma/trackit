"use server"
import { createTransport } from 'nodemailer';
import environmentVariables from '@/config/environment';

interface SendEmailProps {
    subject: string;
    to: string;
    html: string;
    text: string;
    from: string;
}

export const sendEmail=async ({ to, subject, html, text, from }: SendEmailProps) => {
    const transporter=createTransport({
        host: environmentVariables.email.host,
        port: environmentVariables.email.port,
        secure: true,
        auth: {
            user: environmentVariables.email.user,
            pass: environmentVariables.email.password,
        },
        from: from,
    });

    const options={
        from: environmentVariables.email.user,
        to: to,
        subject: subject,
        html: html,
        text: text,
    };

    const result=await transporter.sendMail(options);
    const failed=result.rejected.concat(result.pending).filter(Boolean);

    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
}
