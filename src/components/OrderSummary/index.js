import React, { Component } from "react";
import moment from "moment";
import {
  getSumOfArray,
  calculateValues,
  calculateSubTotal,
  serviceTotalsCalculation
} from "../../helpers";
import Dollor from "../common/Dollor";
import serviceUser from "../../assets/service-user.png";
import serviceTyre from "../../assets/service-car.png";

class OrderSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: "",
      customerData: ""
    };
  }
  componentDidMount = () => {
    this.setState({
      orderData: this.props.summaryReducer.orderData,
      customerData: this.props.summaryReducer.userData
    });
  };
  componentDidUpdate = ({ summaryReducer }) => {
    const propData = this.props.summaryReducer;
    if (summaryReducer.isSuccess !== propData.isSuccess) {
      this.setState({
        orderData: this.props.summaryReducer.orderData
      });
    }
  };

  render() {
    const { orderData } = this.state;
    const { summaryReducer } = this.props;
    const customerInfo = orderData ? orderData.customerId : "";
    //const orderStatus = orderData ? orderData.status: ""
    const vehicleInfo = orderData ? orderData.vehicleId : "";
    const orderID = orderData ? orderData.orderId : "";
    const createdDate = orderData ? orderData.createdAt : "";
    const serviceData = orderData ? orderData.serviceId : "";
    let serviceTotalArray;

    const orderLabel =
      orderData && !orderData.isInvoice ? "Estimate" : "Invoice";

    const fleetStatus =
      orderData && orderData.customerId && orderData.customerId.fleet && 
      orderData.customerId.fleet.fleetDefaultPermissions &&
      orderData.customerId.fleet.fleetDefaultPermissions.shouldReceiveDiscount
        .status
        ? true
        : false;

    let fleetDiscount =
      orderData &&
      orderData.customerId &&
      orderData.customerId.fleet &&
      orderData.customerId.fleet.fleetDefaultPermissions
        ? orderData.customerId.fleet.fleetDefaultPermissions
            .shouldReceiveDiscount.percentageDiscount
        : 0;

    const serviceCal =
      serviceData && serviceData.length
        ? serviceTotalsCalculation(serviceData, fleetStatus, fleetDiscount)
        : "";
    const companyName =
      summaryReducer && summaryReducer.companyData
        ? summaryReducer.companyData.companyName
        : null;
    
    const shopLogo =
      summaryReducer && summaryReducer.companyData
        ? summaryReducer.companyData.shopLogo
        : null;
    const customerCommentId = summaryReducer && summaryReducer ? summaryReducer.orderData.customerCommentId : "";
    return (
      <>
        <div className={"summary-head d-flex flex-column  pt-2 pb-2 "}>
          <div className={"d-flex flex-row justify-content-between"}>
            <div className={"text-muted"}>
              <h4 className={"mb-0"}>
                <b>
                  {orderLabel} #{orderID || ""}
                </b>
              </h4>
              <h4>
                {orderData && orderData.orderItems
                  ? orderData.orderItems.orderName
                  : ""}
              </h4>
              <div>
                Created Date: {moment(createdDate || "").format("MMM Do YYYY")}
              </div>
            </div>
            <div className={"d-flex justify-content-center align-items-center"}>
              <h4 className={"mb-0 text-capitalize"}>{companyName}</h4>
              {shopLogo ? (
                <div className={"ml-2"}>
                  <img src={shopLogo} alt={companyName} width={60} />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className={"user-info d-flex justify-content-between border"}>
          <div className={" w-50 d-flex align-items-center "}>
            <div className={"pl-3 pr-3 pt-2 pb-2 mr-2"}>
              <img src={serviceUser} alt={serviceUser} width={40} height={41} />
            </div>
            {customerInfo ? (
              <div className={"pt-2 pb-2"}>
                {/* <label className={"text-black-50 mb-1"}>
                  Customer Information
                </label> */}
                <h5 className={"text-capitalize mb-1"}>
                  {customerInfo.firstName}
                </h5>
                <div>{customerInfo ? customerInfo.email : ""}</div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className={"w-50  d-flex align-items-center justify-content-end"}>
            <div className={"pl-3 pr-3 pt-2 pb-2 mr-2"}>
              <img src={serviceTyre} alt={serviceTyre} width={40} />
            </div>
            {vehicleInfo ? (
              <div className={"pt-2 pb-2 pr-2 "}>
                {/* <label className={"text-black-50 mb-1"}>
                  Vehicle Information
                </label> */}
                <h5 className={"mb-1"}>
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.modal}
                </h5>
                <div>License Plate : {vehicleInfo.licensePlate}</div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        {customerCommentId && customerCommentId.customerComment ? (
          <div
            className={
              "customer-comment d-flex justify-content-between border border-top-0"
            }
          >
            <div className={" w-50 d-flex"}>
              <div className={"p-2 pl-3"}>
                <label>Customer Comment</label>
                <p>
                  {customerCommentId ? customerCommentId.customerComment : ""}
                </p>
              </div>
            </div>
            <div className={"w-50  d-flex"}>
              <div className={"p-2 pl-3"}>
                <label>Recommandations</label>
                <p>
                  {customerCommentId ? customerCommentId.customerComment : ""}
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <div className={"service-warp "}>
          {serviceData && serviceData.length ? (
            serviceData.map((item, index) => {
              let mainserviceTotal = [],
                serviceTotal,
                epa,
                discount,
                tax;
              return (
                <div key={index} className={"mb-2 mt-2 border"}>
                  <h5 className={"text-capitalize bg-light p-2 border-bottom"}>
                    {item.serviceId.serviceName}
                  </h5>
                  {item.serviceId.serviceItems &&
                  item.serviceId.serviceItems.length
                    ? item.serviceId.serviceItems.map((service, sIndex) => {
                        const calSubTotal = calculateSubTotal(
                          service.retailPrice ||
                            (service.tierSize && service.tierSize.length
                              ? service.tierSize[0].retailPrice
                              : null) ||
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
                        epa =
                          calculateValues(
                            serviceTotalArray || 0,
                            item.serviceId.epa.value !== ""
                              ? item.serviceId.epa.value
                              : 0,
                            item.serviceId.epa ? item.serviceId.epa.type : "$"
                          ) || 0;
                        discount = calculateValues(
                          serviceTotalArray || 0,
                          item.serviceId.discount.value || 0,
                          item.serviceId.discount
                            ? item.serviceId.discount.type
                            : "$"
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

                        // if (service.serviceType === 'part') {
                        //   totalParts += parseFloat(servicesSubTotal)
                        // }
                        // if (service.serviceType === 'tire') {
                        //   totalTires += parseFloat(servicesSubTotal)
                        // }
                        // if (service.serviceType === 'labor') {
                        //   totalLabor += parseFloat(servicesSubTotal)
                        // }
                        // orderSubTotal += (parseFloat(servicesSubTotal))

                        return (
                          <div key={sIndex} className={"pb-2 border-bottom"}>
                            <div className={"pb-1 service-head pl-2 pr-2"}>
                              {service.description ||
                                service.brandName ||
                                service.discription}

                              {service.serviceType === "part" &&
                              service.partOptions &&
                              service.partOptions.showNumberOnQuoteAndInvoice &&
                              service.partNumber !== "" ? (
                                <span className="part-number">
                                  {" "}
                                  ({service.partNumber})
                                </span>
                              ) : (
                                ""
                              )}
                              {service.serviceType === "part" &&
                              service.partOptions &&
                              service.partOptions.showNoteOnQuoteAndInvoice ? (
                                <div className={"part-note"}>
                                  {service.note}
                                </div>
                              ) : (
                                ""
                              )}

                              {service.serviceType === "tire" &&
                              service.tierPermission &&
                              service.tierPermission.showNoteOnQuotesInvoices && service.tierSize.length &&
                              service.tierSize[0].notes !== "" ? (
                                <div className={"part-note"}>
                                  {" "}
                                  ({service.tierSize[0].notes})
                                </div>
                              ) : (
                                ""
                              )}

                              {service.serviceType === "labor" &&
                              service.permission &&
                              service.permission.showNoteOnQuotesInvoices &&
                              service.notes !== "" ? (
                                <div className={"part-note"}>
                                  {" "}
                                  ({service.notes})
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            {service.serviceType !== "labor" ? (
                              <div className={"d-flex pl-2 pr-2 entity"}>
                                {service.serviceType === "part" &&
                                service.partOptions &&
                                service.partOptions
                                  .showPriceOnQuoteAndInvoice ? (
                                  <>
                                    <span className={"pr-3"}>
                                      Price :{" "}
                                      <Dollor value={service.cost || 0} />
                                    </span>
                                    <span className={"pr-3"}>
                                      QTY : {service.qty}
                                    </span>
                                  </>
                                ) : (
                                  ""
                                )}
                                {service.serviceType === "tire" ? (
                                  <>
                                    <span className={"pr-3"}>
                                      Price :{" "}
                                      <Dollor
                                        value={
                                          (service.tierSize && service.tierSize.length
                                            ? service.tierSize[0].cost
                                            : null) || 0
                                        }
                                      />
                                    </span>{" "}
                                    <span className={"pr-3"}>
                                      QTY : {service.qty}
                                    </span>{" "}
                                  </>
                                ) : (
                                  ""
                                )}
                                {/* <span className={"pr-3"}>QTY : {service.qty}</span> */}
                                <span>
                                  Discount : {service.discount.value || 0}
                                </span>
                                <span className={"pull-right ml-auto"}>
                                  Sub Total :{" "}
                                  <Dollor value={servicesSubTotal} />
                                </span>
                              </div>
                            ) : (
                              <div className={"d-flex pl-2 pr-2 entity"}>
                                {service.serviceType === "labor" &&
                                service.permission &&
                                service.permission.isShowHours ? (
                                  <span className={"pr-3"}>
                                    Hours : {service.hours || 0}
                                  </span>
                                ) : (
                                  ""
                                )}
                                <span className={"pr-3"}>
                                  Rate :{" "}
                                  {service.rate ? service.rate.hourlyRate : 1}
                                </span>
                                <span>
                                  Discount : {service.discount.value || 0}
                                </span>
                                <span className={"pull-right ml-auto"}>
                                  {" "}
                                  Sub Total : <Dollor value={calSubTotal} />
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    : ""}
                  <div
                    className={"d-flex justify-content-end pl-2 pr-2 pt-3 pb-3"}
                  >
                    <div className={"pr-3"}>
                      EPA :{" "}
                      <span className={"value"}>
                        <span className="dollar-price">
                          <i className="fa fa-dollar dollar-icon" />
                          {parseFloat(epa || 0).toFixed(2)}
                        </span>
                      </span>
                    </div>

                    <div className={"pr-3"}>
                      Discount :{" "}
                      <Dollor value={parseFloat(discount || 0).toFixed(2)} />
                    </div>
                    <div className={"pr-2"}>
                      Tax : <Dollor value={parseFloat(tax || 0).toFixed(2)} />
                    </div>
                    <div className={"w-25 text-right"}>
                      Service Total :{" "}
                      <Dollor
                        value={!isNaN(serviceTotal) ? serviceTotal : 0.0}
                      />
                    </div>
                  </div>
                  {/* <span className={"d-none"}>{orderGandTotal += parseFloat(serviceTotal) || 0}</span>
                <span className={"d-none"}>{totalTax += parseFloat(epa) + parseFloat(tax) || 0}</span>
                <span className={"d-none"}>{totalDiscount += parseFloat(discount) || 0}</span> */}
                </div>
              );
            })
          ) : (
            <h4 className={"pt-4 pb-4 text-center"}>
              Currently there is no any Serice Addded
            </h4>
          )}
          {serviceData && serviceData.length ? (
            <>
              <div
                className={"w-50 text-right pull-right pr-2 order-total-block"}
              >
                <div>
                  Total Parts :{" "}
                  <Dollor value={serviceCal.totalParts.toFixed(2)} />
                </div>
                <div>
                  Total Tires :{" "}
                  <Dollor value={serviceCal.totalTires.toFixed(2)} />
                </div>
                <div>
                  Total Labor :{" "}
                  <Dollor value={serviceCal.totalLabor.toFixed(2)} />
                </div>
                <div className={"pt-2 border-top mt-2"}>
                  Sub Total:{" "}
                  <Dollor value={serviceCal.orderSubTotal.toFixed(2)} />
                </div>
                <div>
                  Total Tax : +{" "}
                  <Dollor value={serviceCal.totalTax.toFixed(2)} />
                </div>
                <div>
                  Total Discount : -{" "}
                  <Dollor value={serviceCal.totalDiscount.toFixed(2)} />
                </div>
                {fleetStatus ? (
                  <div>
                    Fleet Discount : -{" "}
                    <Dollor value={serviceCal.fleetDiscount.toFixed(2)} />
                  </div>
                ) : null}
                <div className={"pt-2 border-top mt-2 grand-total"}>
                  Grand Total :{" "}
                  <Dollor value={serviceCal.orderGrandTotal.toFixed(2)} />
                </div>
              </div>
              <div className={"clearfix"} />
            </>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

export default OrderSummary;
