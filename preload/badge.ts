import { ipcRenderer } from 'electron';

export default class BadgeHandler {
  safeParseInt(text: string | number | undefined | null) {
    if (text === undefined || text === null) {
      return 0;
    }

    // Parse number to integer
    // This will correct errors that recipes may introduce, e.g.
    // by sending a String instead of an integer
    const parsedNumber = Number.parseInt(text.toString(), 10);
    const adjustedNumber = Number.isNaN(parsedNumber) ? 0 : parsedNumber;
    return Math.max(adjustedNumber, 0);
  }
  setBadge(
    direct: string | number | undefined | null,
    indirect: string | number | undefined | null,
  ) {
    const count = {
      direct: this.safeParseInt(direct),
      indirect: this.safeParseInt(indirect),
    };

    ipcRenderer.sendToHost('message-counts', count);
  }
}
