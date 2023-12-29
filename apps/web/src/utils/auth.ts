import environmentVariables from '@/config/environment';
import LogtoClient from '@logto/next/edge';

export const logtoClient = new LogtoClient({
  endpoint: environmentVariables.logto.endpoint,
  appId: environmentVariables.logto.appId,
  appSecret: environmentVariables.logto.appSecret,
  baseUrl: environmentVariables.baseUrl,
  cookieSecret: environmentVariables.logto.cookieSecret,
  cookieSecure: environmentVariables.nodeEnv === 'production',
});