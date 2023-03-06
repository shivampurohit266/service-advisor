const CustomerAgeTypes = {
  ZERO_DAYS: "0-30 Days",
  THIRTY_DAYS: "31-60 Days",
  SIXTY_DAYS: "61-90 Days",
  NINETY_DAYS: "91 Days and above"
};
const CustomerAge = [
  CustomerAgeTypes.THIRTY_DAYS,
  CustomerAgeTypes.THIRTY_DAYS,
  CustomerAgeTypes.SIXTY_DAYS,
  CustomerAgeTypes.NINETY_DAYS
];

/**
 *
 */

module.exports = { CustomerAge, CustomerAgeTypes };
