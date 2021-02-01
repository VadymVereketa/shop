class DateHelper {
  public static get2Date(date: Date) {
    const d = new Date(date);
    const offset = Math.floor(date.getTimezoneOffset() / 60);

    d.setHours(d.getHours() + offset + 2);
    d.setMinutes(d.getMinutes() + (date.getTimezoneOffset() - offset * 60));

    return d;
  }

  public static getUTCDate(date: Date) {
    const d = new Date(date);
    const offset = Math.floor(date.getTimezoneOffset() / 60);

    d.setHours(d.getHours() - offset - 2);
    d.setMinutes(d.getMinutes() - (date.getTimezoneOffset() - offset * 60));

    return d;
  }
}
export {DateHelper};
