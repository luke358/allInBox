module.exports = AllInBox =>
  class Discord extends AllInBox {
    overrideUserAgent() {
      return window.navigator.userAgent
        .replace('(KHTML, like Gecko)', '(KHTML, like Gecko) discord/0.0.250')
        .replace('Electron', 'Discord')
        .replace('Ferdium', 'Discord')
        .replace('Apple Mac OS X', 'Intel Mac OS X');
    }
  };
