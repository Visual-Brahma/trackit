import Plunk from '@plunk/node';
import environmentVariables from '@/config/environment';

export const plunk=new Plunk(environmentVariables.email.plunkApiKey);