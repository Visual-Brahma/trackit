import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Script src="//code.tidio.co/zyi8qkhaweop5tc4oenpsdstwnvcjw6j.js" async={true} />
            <Component {...pageProps} />
            <Analytics />
        </>
    );
}
