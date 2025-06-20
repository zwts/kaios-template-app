interface CustomNavigator {
  mozL10n: {
    once: (callback: Function) => void;
    get: (id: string, params?: object) => string;
  };
}
interface Navigator extends CustomNavigator {}

// See Gramjs exports: https://github.com/gram-js/gramjs/blob/master/gramjs/index.ts
declare let telegram: {
  tl: any,
  version: string;
  utils: any,
  errors: any,
  sessions: any,
  extensions: any,
  helpers: any,
  client: any,
  password: any,
  Api: any,
  TelegramClient: any,
  Connection: any,
  Logger: any,
};
