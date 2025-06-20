const { Api, TelegramClient, helpers, extensions, tl, password, errors } = telegram;
const { StoreSession } = telegram.sessions;
const session = new StoreSession('gramjs');

const client = new TelegramClient(session, Number(process.env.APP_ID), process.env.APP_HASH, {
  maxConcurrentDownloads: 1,
  deviceModel: 'Mozilla',
  systemVersion: '1.0',
  deviceType: 'Desktop',
  appVersion: '0.0.1',
});

client.setLogLevel('debug');

export { Api, client, helpers, extensions, tl, password, errors };
