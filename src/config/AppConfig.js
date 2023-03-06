export const EnviornmentTypes = {
  DEV: "development",
  PROD: "production"
};
export const mode = process.env.NODE_ENV || EnviornmentTypes.DEV; //stage,dev,live
export const isProd = mode === EnviornmentTypes.PROD;
export const APP_URL = process.env.REACT_APP_CURRENT_APP_DOMAIN;
let data;
data = {
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  API_VERSION: process.env.REACT_APP_API_VERSION,
  phoneLength: 3,
  DEFAULT_DATE_FORMAT: "LLL",
  ITEMS_PER_PAGE: 250,
  IMAGE_ENDPOINT: process.env.REACT_APP_API_ENDPOINT
};

export const AppConfig = data;
