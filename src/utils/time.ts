import moment from "moment";

export const defaultTimeFormat = "YYYY-MM-DD HH:mm:ss";

export function convertToDefaultTimeFormat(date: Date, utc: boolean = true) {
  if (utc) return moment.utc(date).format(defaultTimeFormat);
  else return moment(date).format(defaultTimeFormat);
}
