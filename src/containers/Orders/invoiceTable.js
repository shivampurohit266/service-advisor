import React, { Component } from "react";
import moment from "moment";

import {
  calculateSubTotal,
  calculateValues,
  serviceTotalsCalculation
} from "../../helpers";

class InvoiceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getServiceItems = serviceItemData => {
    let calSubTotal = 0;
    const styleTr = {
      border: '0px'
    }
    var table = [];
    for (let j = 0; j < (serviceItemData && serviceItemData.length ? serviceItemData.length : 0); j++) {
      let service = serviceItemData[j];
      var val = service.description || service.brandName || service.discription;
      var note =
        (service.serviceType === "part" &&
          service.partOptions &&
          service.partOptions.showNoteOnQuoteAndInvoice &&
          service.note !== ""
          ? (`Note : ${service.note}`)
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
        service.retailPrice ||
        (service.tierSize && service.tierSize.length ? service.tierSize[0].retailPrice : null) ||
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
      var discountType = service.discount.type;
      var discountValue = service.discount.value || 0;
      var discountMainVal = "";
      discountMainVal =
        discountValue > 0
          ? discountType === "%"
            ? discountValue + "%"
            : "$" + discountValue
          : 0;
      table.push(
        <tr key={j} style={styleTr}>
          <td>
            <span className="parts-name">
              {val} {partnumber}
            </span>
            <span className="note-text">{note}</span>
          </td>
          <td>
            {service.serviceType === "part" &&
              service.partOptions &&
              service.partOptions.showPriceOnQuoteAndInvoice
              ? "$" + cost
              : service.serviceType === "tire"
                ? "$" + cost
                : "-" || "-"}
          </td>
          <td>
            {service.serviceType === "part" &&
              service.partOptions &&
              service.partOptions.showPriceOnQuoteAndInvoice
              ? qty
              : service.serviceType === "tire"
                ? qty
                : "-" || "-"}
          </td>
          <td>{hours || "-"}</td>
          <td>{discountMainVal}</td>
          <td>${servicesSubTotal}</td>
        </tr>
      );
    }
    return table;
  };

  render() {
    const signature = {
      width: "100%",
      float: "left",
      marginTop: "20px"
    },
      disclamair = {
        float: "left",
        fontSize: "10px",
        width: "230px",
        paddingRight: "40px",
        paddingBottom: "20px"
      },
      orderTableBlock = {
        float: "left",
        width: "50%",
        paddingBottom: "20px"
      },
      headerStyle = {
        marginLeft: "8px",
        marginRight: "8px"
      },

      servicePrice = {
        width: "150px",
        float: "left",
        display: "block",
        textAlign: "right",
        fontSize: "11px",
        clear: "right"
      };
    const { profileReducer } = this.props;
    const orderData = this.props.orderReducer.orderItems;
    const customerData = orderData && orderData.customerId ? orderData.customerId : '';
    const comapnyInfo = profileReducer ? profileReducer.profileInfo : "";
    const address =
      profileReducer && profileReducer.profileInfo
        ? profileReducer.profileInfo.address
        : "";
    const serviceData = this.props.services;
    // const orderName =
    //   orderReducer && orderReducer.orderItems
    //     ? orderReducer.orderItems.orderName
    //     : "";
    const orderId = orderData ? orderData.orderId : "";
    const orderDate = orderData ? moment(orderData.createdAt || "").format("MMM Do YYYY") : "";
    const companyName = comapnyInfo.companyName;
    const vehilceInfo = orderData && orderData.vehicleId ? (
      orderData.vehicleId.year +
      " " +
      orderData.vehicleId.make +
      " " +
      orderData.vehicleId.modal
    ) : '';
    const licensePlate = orderData && orderData.vehicleId ? orderData.vehicleId.licensePlate : ''

    const serviceTableInnner = [];
    const servieArray = [];
    let serviceEpaPer, serviceDiscountPer, serviceTaxPer, servicesId;
    let serviceCal;
    if (serviceData && serviceData.length) {
      serviceData.map(item => {
        servieArray.push({ serviceId: item });
        serviceCal = serviceTotalsCalculation(servieArray);
        return true;
      });
    }
    for (let i = 0; i < servieArray.length; i++) {
      servicesId = servieArray[i].serviceId;
      serviceEpaPer =
        servicesId && servicesId.epa && servicesId.epa.value && servicesId.epa.type === "%"
          ? `(${servicesId.epa.value}%)`
          : "";
      serviceDiscountPer =
        servicesId &&
          servicesId.discount &&
          servicesId.discount.value && servicesId.discount.type === "%"
          ? `(${servicesId.discount.value}%)`
          : "";
      serviceTaxPer =
        servicesId && servicesId.taxes && servicesId.taxes.value && servicesId.taxes.type === "%"
          ? `(${servicesId.taxes.value}%)`
          : "";

      serviceTableInnner.push(
        <div className={"invoceTableDesign"} key={i}>
          <div className={"invoceTableTitle"}>
            <span >{servicesId.serviceName}</span>
          </div>
          <table
            id="tbl"
            cellPadding="0"
            cellSpacing="0"
            border="0"
            className={"invoice-table"}
          >
            <thead>
              <tr>
                <th width="200" className="service-title">
                  Service Title
                </th>
                <th>Price</th>
                <th>Qty</th>
                <th>Hours</th>
                <th>Discount</th>
                <th>Sub total</th>
              </tr>
            </thead>
            <tbody>
              {
                (this.getServiceItems(
                  servieArray[i].serviceId.serviceItems
                ))
              }
            </tbody>
          </table>
          <div className={"total-amount"}>
            <div className={"total-amount-left"}>
              <div className="epa-price">
                Epa : $
                {parseFloat(
                  serviceCal.serviceEpa &&
                    serviceCal.serviceEpa.length &&
                    !isNaN(serviceCal.serviceEpa[i])
                    ? serviceCal.serviceEpa[i]
                    : 0
                ).toFixed(2)}{" "}
                {serviceEpaPer}
              </div>
              <div className="discount-price">
                Discount: $
                {parseFloat(
                  serviceCal.serviceDiscount &&
                    serviceCal.serviceDiscount.length &&
                    !isNaN(serviceCal.serviceDiscount[i])
                    ? serviceCal.serviceDiscount[i]
                    : 0
                ).toFixed(2)}{" "}
                {serviceDiscountPer}
              </div>
              <div className="tax-price">
                Tax : $
                {parseFloat(
                  serviceCal.serviceTax &&
                    serviceCal.serviceTax.length &&
                    !isNaN(serviceCal.serviceTax[i])
                    ? serviceCal.serviceTax[i]
                    : 0
                ).toFixed(2)}{" "}
                {serviceTaxPer}
              </div>
            </div>
            <div className="service-price" style={servicePrice}>
              Service Total: $
              {serviceCal.serviceCount &&
                serviceCal.serviceCount.length &&
                !isNaN(serviceCal.serviceCount[i])
                ? serviceCal.serviceCount[i]
                : 0}
            </div>
            <div className={"clearfix"} />
          </div>
        </div>
      );
    }




    return (
      <div id={"invoicePDF"} className={"pdf-container"}>
        <div id="pageHeader" style={headerStyle}>
          <div>
            <div className="invoice">
              <div className="invoice-name">Invoice : #{orderId}</div>
              <div className="invoice-date">Created : {orderDate}</div>
            </div>
            <div className={"company-name-warp"}>
              <div className="company-name">
                <div>{companyName}</div>
              </div>
              <div className="company-address">{address}</div>
            </div>
            <div className="clearfix" />
          </div>
          <div className="user-details">
            <div className="width-50">
              <div className="user-details-left">
                <div>
                  {customerData.firstName + " " + customerData.lastName}
                </div>
                <div className="user-email">{customerData.email}</div>
              </div>
            </div>
            <div className="width-50">
              <div className="user-details-right">
                <div>{vehilceInfo}</div>
                <div className={"plateName"}>
                  License Plate : {licensePlate}
                </div>
              </div>
            </div>
            <div className="clearfix" />
          </div>
        </div>
        {serviceTableInnner}
        <div style={disclamair}>
          Quotes are an approximation of charges to you for the services
          requested. They are based on the anticipated details of the work to be
          done. It is possible for unexpected complications to cause some
          deviation from the quote. I hereby authorize the repair work
          hereinafter set forth to be done along with the necessary material and
          agree that you are not responsible for loss or damage to vehicle or
          articles left in vehicle in case of fre, theft or any other cause
          beyond your control or for any delays caused by unavailability of
          parts or delays in parts by the supplier or transporter. I understand
          that I have the right to know before authorizing my repairs what the
          repairs to my car will be and what their costs will be. You need not
          obtain approval from me prior to performing repairs what the repairs
          will be or their cost if the total amount for such repairs does not
          exceed authorized amount.
        </div>
        <div style={orderTableBlock}>
          <table
            id="invoiceTable"
            className="order-table order-total-table"
            align="right"
          >
            <tbody>
              <tr>
                <td>Total Parts</td>
                <td>
                  <span className="colon">:</span>
                  <span className="plus-width" />$
                  {serviceCal && serviceCal.totalParts
                    ? serviceCal.totalParts.toFixed(2)
                    : 0}
                </td>
              </tr>
              <tr>
                <td>Total Tires</td>
                <td>
                  <span className="colon">:</span>
                  <span className="plus-width" />$
                  {serviceCal && serviceCal.totalTires
                    ? serviceCal.totalTires.toFixed(2)
                    : 0}
                </td>
              </tr>
              <tr>
                <td className="border-bottom">Total Labor</td>
                <td className="border-bottom">
                  <span className="colon">:</span>
                  <span className="plus-width" />$
                  {serviceCal && serviceCal.totalLabor
                    ? serviceCal.totalLabor.toFixed(2)
                    : 0}
                </td>
              </tr>
              <tr>
                <td>Sub Total</td>
                <td>
                  <span className="colon">:</span>
                  <span className="plus-width" />$
                  {serviceCal && serviceCal.orderSubTotal
                    ? serviceCal.orderSubTotal.toFixed(2)
                    : 0}
                </td>
              </tr>
              <tr>
                <td>Total Tax</td>
                <td>
                  <span className="colon">:</span>
                  <span className="plus-width">+</span>$
                  {serviceCal && serviceCal.totalTax
                    ? serviceCal.totalTax.toFixed(2)
                    : 0}
                </td>
              </tr>
              <tr>
                <td>Total Discount</td>
                <td>
                  <span className="colon">:</span>
                  <span className="plus-width">-</span>$
                  {serviceCal && serviceCal.totalDiscount
                    ? serviceCal.totalDiscount.toFixed(2)
                    : 0}
                </td>
              </tr>
              <tr className="grand-total">
                <td>
                  <b>Grand Total</b>
                </td>
                <td>
                  <span className="colon">:</span>
                  <span className="plus-width" />$
                  {serviceCal && serviceCal.orderGrandTotal
                    ? serviceCal.orderGrandTotal.toFixed(2)
                    : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={signature}>Signature _______________________________</div>

        <div id="pageFooter">Default footer</div>
      </div>
    );
  }
}

export default InvoiceTable;
