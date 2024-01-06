import environmentVariables from '@/config/environment';
import { appName } from '@/utils/constants/brand';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';
import config from '../../tailwind.config';

export interface ContactFormRecievedResponseProps {
    firstName: string;
    subject: string;
    message: string;
}

export const ContactFormResponseEmail=({ firstName, subject, message }: ContactFormRecievedResponseProps) => {
    const previewText=`Your message has been recieved!`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind config={config}>
                <Body className="my-auto mx-auto font-sans p-4">
                    <Container className="border border-solid border-[#eaeaea] rounded my-8 mx-auto p-8 w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src={`${environmentVariables.baseUrl}/logo.svg`}
                                width="40"
                                height="37"
                                alt={appName}
                                className="my-0 mx-auto"
                            />
                        </Section>
                        <Heading className="text-2xl font-normal text-center my-8 mx-0">
                            Your message has been recieved!
                        </Heading>
                        <Text className="px-2">
                            Hello {firstName},
                        </Text>
                        <Text className="px-2">
                            Thank you for contacting us. We will get back to you as soon as possible.
                        </Text>
                        <Section className='bg-muted text-muted-foreground'>
                            <Text className="px-2">This is what we received.</Text>
                            <Text className="px-2">
                                <strong>Subject:</strong> {subject}
                                <br />
                                <strong>Message:</strong> {message}
                            </Text>
                        </Section>
                        <Hr className="border border-solid border-[#eaeaea] my-4 mx-0 w-full" />
                        <Text className="text-muted p-4">
                            You are receiving this email because you have filled the contact form on{" "}{environmentVariables.baseUrl}
                            {" "}.If you were not expecting this email, you can ignore this email. If you are
                            concerned about your account's safety, please reply to this email to
                            get in touch with us.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ContactFormResponseEmail;