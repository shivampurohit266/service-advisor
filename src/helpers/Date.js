import * as moment from "moment";
import { AppConfig } from "../config/AppConfig";

/**
 *
 */
export const formateDate = date => {
  return moment(new Date(date)).format(AppConfig.DEFAULT_DATE_FORMAT);
};
/**
 *
 */
const pad = num => {
  return ("0" + num).slice(-2);
};
/**
 *
 */
export const SecondsToHHMMSS = secs => {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};
