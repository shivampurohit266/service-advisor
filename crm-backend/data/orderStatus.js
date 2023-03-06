const DefaultOrderStatus = [
  {
    name: "Estimate",
    isInvoice: false,
    orderIndex: 0
  },
  {
    name: "In Progress",
    isInvoice: false,
    orderIndex: 1
  },
  {
    name: "Dropped Off",
    isInvoice: false,
    orderIndex: 2
  },
  {
    name: "Invoices",
    isInvoice: true,
    orderIndex: 3
  }
];

module.exports = DefaultOrderStatus;
