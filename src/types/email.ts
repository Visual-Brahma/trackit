import { Theme } from 'next-auth/core/types';

export interface SignInEmailParams {
    url: string;
    host: string;
    theme: Theme;
}