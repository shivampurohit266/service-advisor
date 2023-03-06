export const getSumOfArray = arr => {
  return arr.length ? arr.reduce((total, num) => total + num) : 0;
};

/**
 *
 */
export const calculateValues = (total, value, type = "%") => {
  switch (type) {
    case "%":
      return (total * value) / 100;
    case "$":
      return value;
    default:
      return value;
  }
};
/** 
/* 
 */
export const calculateSubTotal = (cost, quantity, hour, rate) => {
  return parseFloat(cost || hour) * parseFloat(quantity || rate);
};
/** 
/* 
 */
export const calculateDurationFromSeconds = Seconds => {
  var minutes = Math.floor(Seconds / 60);
  Seconds = Seconds % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  const duration = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${Seconds > 9 ? Seconds : `0${Seconds}`}`;
  return duration;
};
/** 
/* 
 */
export const serviceTotalsCalculation = (
  serviceData,
  fleetStatus,
  fleetDiscount
) => {
  let totalParts = 0,
    totalTires = 0,
    totalLabor = 0,
    orderSubTotal = 0,
    orderGrandTotal = 0,
    serviceTotalArray,
    totalTax = 0,
    totalDiscount = 0,
    serviceEpa = [],
    serviceTax = [],
    serviceDiscount = [],
    serviceCount = [];

  serviceData.map(item => {
    let mainserviceTotal = [],
      serviceTotal,
      epa,
      discount,
      tax;
    if (item.serviceId && item.serviceId.serviceItems && item.serviceId.serviceItems.length) {
      item.serviceId.serviceItems.map(service => {
        const calSubTotal = calculateSubTotal(
          service.retailPrice ||
          (service.tierSize && service.tierSize.length ? service.tierSize[0].retailPrice : null) ||
          0,
          service.qty || 0,
          service.hours || 0,
          service.rate ? service.rate.hourlyRate : 0
        ).toFixed(2);
        const subDiscount = calculateValues(
          calSubTotal || 0,
          service.discount.value || 0,
          service.discount.type
        );
        const servicesSubTotal = (
          parseFloat(calSubTotal) - parseFloat(subDiscount)
        ).toFixed(2);
        mainserviceTotal.push(parseFloat(servicesSubTotal));
        serviceTotalArray = getSumOfArray(mainserviceTotal);
        epa = calculateValues(
          serviceTotalArray || 0,
          item.serviceId.epa.value || 0,
          item.serviceId.epa ? item.serviceId.epa.type : "$"
        );
        discount = calculateValues(
          serviceTotalArray || 0,
          item.serviceId.discount.value || 0,
          item.serviceId.discount ? item.serviceId.discount.type : "$"
        );
        tax = calculateValues(
          serviceTotalArray || 0,
          item.serviceId.taxes.value || 0,
          item.serviceId.taxes ? item.serviceId.taxes.type : "$"
        );
        serviceTotal = (
          parseFloat(serviceTotalArray) +
          parseFloat(epa) +
          parseFloat(tax) -
          parseFloat(discount)
        ).toFixed(2);
        if (service.serviceType === "part") {
          totalParts += parseFloat(servicesSubTotal);
        }

        if (service.serviceType === "tire") {
          totalTires += parseFloat(servicesSubTotal);
        }
        if (service.serviceType === "labor") {
          totalLabor += parseFloat(servicesSubTotal);
        }
        orderSubTotal += parseFloat(servicesSubTotal);
        return true;
      });
    }
    if (epa) {
      serviceEpa.push(epa);
    }
    if (tax) {
      serviceTax.push(tax);
    }
    if (discount) {
      serviceDiscount.push(discount);
    }
    if (serviceTotal) {
      serviceCount.push(serviceTotal);
    }
    totalTax += parseFloat(epa) + parseFloat(tax) || 0;
    totalDiscount += parseFloat(discount) || 0;
    orderGrandTotal += parseFloat(serviceTotal) || 0;
    fleetDiscount = fleetStatus ? calculateValues(orderGrandTotal, fleetDiscount, "%") : 0;
    orderGrandTotal = fleetStatus
      ? orderGrandTotal - fleetDiscount
      : orderGrandTotal;
    return true;
  });

  const data = {
    totalParts,
    totalTires,
    totalLabor,
    orderSubTotal,
    totalTax,
    totalDiscount,
    orderGrandTotal,
    serviceEpa,
    serviceTax,
    serviceDiscount,
    serviceCount,
    fleetDiscount
  };
  return data;
};
