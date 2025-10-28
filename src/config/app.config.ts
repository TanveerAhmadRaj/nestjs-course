import {registerAs} from '@nestjs/config';

//Configuration Type for the Application.

export interface AppConfig {
  messagePrefix: string;
}
export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    messagePrefix:
      process.env.APP_MESSAGE_PREFIX ??
      'Implemented by Full Stack Developer --> (Tanveer Ahmad)',
  })
);
