const mode = "development"; // test, production, development
const isDev = mode !== "production";
const webURL = isDev ? "localhost:3000" : "serviceadvisor.io/dev";
const s3Key = {
  key: "iIkoc2HZhl+JEMSUFZA2flh/YNtBMCUa3CE/GSbg",
  keyId: "AKIAIBVWQL2OGVIO6D7Q",
  acl: "public-read"
};

const StripeAPIKey = isDev
  ? "sk_test_zCSjOxiIHTNmPJUBdg4hFQAZ"
  : "sk_test_zCSjOxiIHTNmPJUBdg4hFQAZ";

const Twilio = {
  accountSid: isDev
    ? "ACa5b59a10ecb28e91fd3375991a06e050"
    : "ACf74b4d20b3e4d75db48ac9928090407e",
  authToken: isDev
    ? "ae58ecb856aeb716e5bb6411e21a670a"
    : "9ae3119ecc9ff41e3b7a968d768dfd25",
  from: isDev ? "+15005550006" : "+15005550006"
};

module.exports = {
  mode,
  isDev,
  webURL,
  s3Key,
  StripeAPIKey,
  Twilio
};
