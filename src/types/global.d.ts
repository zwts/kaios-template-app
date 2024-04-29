interface CustomNavigator {
  mozL10n: {
    once: (callback: Function) => void;
    get: (id: string, params?: object) => string;
  };
}
interface Navigator extends CustomNavigator {}
