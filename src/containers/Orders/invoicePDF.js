import moment from "moment";
import {
  calculateSubTotal,
  getSumOfArray,
  calculateValues,
  serviceTotalsCalculation
} from "../../helpers";

export const invoicePDF = (
  sentinvoice,
  orderData,
  customerData,
  serviceData,
  comapnyInfo,
  vehilceInfo,
  doc,
  pdfWidth
) => {
  doc.setFontSize(15);
  doc.setTextColor(51, 47, 62);
  doc.text("Invoice -: #" + orderData.orderId + "", 20, 40);
  doc.setFontSize(10);
  doc.text(
    "Created -: " +
      moment(orderData.createdAt || "").format("MMM Do YYYY") +
      "",
    20,
    54
  );

  doc.setFontSize(15);
  doc.setFontStyle("bold");
  var nameWidth = doc.getTextDimensions(comapnyInfo.companyName);
  doc.text(comapnyInfo.companyName, pdfWidth - (nameWidth.w + 25), 45);
  doc.setFontStyle("normal");

  doc.setLineWidth(0.1);
  doc.setDrawColor(187, 185, 193);
  doc.line(20, 60, 570, 60);

  doc.setFontSize(12);
  doc.text(customerData.firstName + " " + customerData.lastName, 20, 78);
  doc.setFontSize(10);
  doc.text(customerData.email, 20, 95);

  doc.setLineWidth(0.1);
  doc.line(300, 100, 300, 60); // vertical line

  doc.setFontSize(12);
  doc.text(vehilceInfo, 320, 78);

  doc.setLineWidth(0.1);
  doc.setDrawColor(187, 185, 193);
  doc.line(20, 100, 570, 100);

  let epa = 0,
    epaType = "",
    serviceDiscount = 0,
    serviceDiscountType = "",
    serviceTax = 0,
    serviceTaxType = "",
    serviceTotal = 0,
    serviceTotalArray;

  let columnHeight = 110;
  let itemHeight = columnHeight;
  const serviceCal = serviceTotalsCalculation(serviceData);
  for (let i = 0; i < serviceData.length; i++) {
    let calEpa;
    epa = serviceData[i].serviceId.epa.value || 0;
    epaType = serviceData[i].serviceId.epa.type;
    serviceDiscount = serviceData[i].serviceId.discount.value || 0;
    serviceDiscountType = serviceData[i].serviceId.discount.type;
    serviceTax = serviceData[i].serviceId.taxes.value || 0;
    serviceTaxType = serviceData[i].serviceId.taxes.type || 0;
    doc.setDrawColor(187, 185, 193);
    doc.setFillColor(240, 243, 245);
    doc.rect(20, columnHeight, 550, 20, "FD");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(serviceData[i].serviceId.serviceName, 25, columnHeight + 14);

    let mainserviceTotal = [],
      discount,
      tax,
      calSubTotal = 0;

    var columns = [
      { title: "Service Title", dataKey: "Service Title" },
      { title: "Price", dataKey: "Price" },
      { title: "Qty", dataKey: "Qty" },
      { title: "Hours", dataKey: "Hours" },
      { title: "Discount", dataKey: "Discount" },
      { title: "Sub total", dataKey: "Sub total" }
    ];
    var rows = [];
    var options = {};
    options = {
      margin: { left: 20 },
      startY: columnHeight + 21,
      tableWidth: pdfWidth - 45,
      columnStyles: {
        "Service Title": { cellWidth: 150 },
        Price: { halign: "left" },
        Qty: { halign: "left", cellWidth: 30 },
        Hours: { halign: "left", cellWidth: 30 },
        Discount: { halign: "left" },
        "Sub total": { halign: "left" }
      },
      styles: {
        // minCellHeight: 5,
        cellPadding: 3,
        fontSize: 10,
        font: "helvetica", // helvetica, times, courier
        lineColor: 200,
        lineWidth: 0.1,
        lineHeight: 0,
        fontStyle: "normal", // normal, bold, italic, bolditalic
        overflow: "ellipsize", // visible, hidden, ellipsize or linebreak
        fillColor: 255,
        textColor: 20,
        halign: "left", // left, center, right
        valign: "middle", // top, middle, bottom
        fillStyle: "F", // 'S', 'F' or 'DF' (stroke, fill or fill then stroke)
        cellWidth: "auto", // 'auto', 'wrap' or a number
        minCellHeight: 20
      }
    };
    for (let j = 0; j < serviceData[i].serviceId.serviceItems.length; j++) {
      let service = serviceData[i].serviceId.serviceItems[j];
      var val = service.description || service.brandName || service.discription;

      var note =
        (service.serviceType === "part" &&
        service.partOptions &&
        service.partOptions.showNoteOnQuoteAndInvoice
          ? "Note : " + service.note
          : "") ||
        (service.serviceType === "tire" &&
        service.tierPermission &&
        service.tierPermission.showNoteOnQuotesInvoices && service.tierSize.length &&
        service.tierSize[0].notes !== ""
          ? "Note : " + service.tierSize[0].notes 
          : "");

      var partnumber =
        (service.serviceType === "part" &&
        service.partOptions &&
        service.partOptions.showNumberOnQuoteAndInvoice &&
        service.partNumber !== ""
          ? service.partNumber
          : "") || "";
      // var serviceType = service.serviceType;
      var qty = service.qty || "";
      var hours = service.hours;
      var hourlyRate = service.rate ? service.rate.hourlyRate : 0;
      var cost =
        service.cost ||
        (service.tierSize && service.tierSize.length ? service.tierSize[0].cost : null) ||
        0;

      calSubTotal = calculateSubTotal(
        cost,
        qty || 0,
        hours || 0,
        hourlyRate
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
      calEpa = calculateValues(
        serviceTotalArray || 0,
        epa || 0,
        epa ? epaType : "$"
      );
      discount = calculateValues(
        serviceTotalArray || 0,
        serviceDiscount || 0,
        serviceDiscount ? serviceDiscountType : "$"
      );
      tax = calculateValues(
        serviceTotalArray || 0,
        serviceTax || 0,
        serviceTax ? serviceTaxType : "$"
      );
      serviceTotal = (
        parseFloat(serviceTotalArray) +
        parseFloat(calEpa) +
        parseFloat(tax) -
        parseFloat(discount)
      ).toFixed(2);

      var discountType = service.discount.type;
      var discountValue = service.discount.value || 0;
      var discountMainVal = "";
      discountMainVal =
        discountValue > 0
          ? discountType === "%"
            ? discountValue + "%"
            : "$" + discountValue
          : 0;
          // console.log(
          //   val + " " + (partnumber || "") + " " + note,
          //   "note"
          // );
      rows.push({
        "Service Title": val + " " + (partnumber || "") + " " + (note),

        Price:
          service.serviceType === "part" &&
          service.partOptions &&
          service.partOptions.showPriceOnQuoteAndInvoice
            ? "$" + cost
            : service.serviceType === "tire"
            ? "$" + cost
            : "-" || "-",

        Qty:
          service.serviceType === "part" &&
          service.partOptions &&
          service.partOptions.showPriceOnQuoteAndInvoice
            ? qty
            : service.serviceType === "tire"
            ? qty
            : "-" || "-",
        Hours: hours || "-",
        Discount: discountMainVal,
        "Sub total": "$" + servicesSubTotal + ""
      });
    }

    doc.autoTable(columns, rows, options);
    var rowCount = serviceData[i].serviceId.serviceItems.length;
    var rowHeight = (rowCount + 1) * 22;
    var finalY = doc.autoTable.previous.finalY;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(
      "EPA : $" + parseFloat(calEpa).toFixed(2) + "",
      180,
      columnHeight + rowHeight + 28
    );
    doc.text(
      "Discount : $" + parseFloat(discount).toFixed(2) + "",
      250,
      columnHeight + rowHeight + 28
    );
    doc.text(
      "Tax : $" + parseFloat(tax).toFixed(2) + "",
      335,
      columnHeight + rowHeight + 28
    );
    doc.text(
      "Service Total : $" + serviceTotal + "",
      455,
      columnHeight + rowHeight + 28
    );

    //  to plus and increase columnHeight for next item
    columnHeight = columnHeight + rowHeight + 40;
    // Last row  EPA DISCOUNT
  }
  itemHeight = finalY + 30;

  doc.setFontSize(12);
  doc.text(
    "Total Parts  : $" + serviceCal.totalParts.toFixed(2) + "",
    450,
    itemHeight + 30
  );
  doc.text(
    "Total Tires  : $" + serviceCal.totalTires.toFixed(2) + "",
    450,
    itemHeight + 45
  );
  doc.text(
    "Total Labor  : $" + serviceCal.totalLabor.toFixed(2) + "",
    450,
    itemHeight + 60
  );
  doc.setDrawColor(187, 185, 192);
  doc.line(570, itemHeight + 110, 350, itemHeight + 110); // horizontal line
  doc.text(
    "Sub Total : $" + serviceCal.orderSubTotal.toFixed(2) + "",
    450,
    itemHeight + 75
  );
  doc.text(
    "Total Tax  : +  $" + serviceCal.totalTax.toFixed(2) + "",
    450,
    itemHeight + 90
  );
  doc.text(
    "Total Discount : - $" + serviceCal.totalDiscount.toFixed(2) + "",
    450,
    itemHeight + 105
  );
  doc.setDrawColor(187, 185, 193);
  doc.line(570, itemHeight + 110, 350, itemHeight + 110); // horizontal line
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFontStyle("bold");
  doc.text(
    "Grand Total  : $" + serviceCal.orderGrandTotal.toFixed(2) + "",
    430,
    itemHeight + 127
  );

  if (itemHeight > 750) {
    doc.addPage();
  }
  var file = doc.output("dataurlstring");

  if (!sentinvoice) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    const pdfBlob = file;
    return pdfBlob;
  }
};