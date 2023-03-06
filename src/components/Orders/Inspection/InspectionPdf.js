import React, { Component } from "react";
import moment from "moment";
import "../../../scss/inspectPdf.scss";

class InspectionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //+ Items.color || "-"
  getInspectItems = item => {
    const rows = [];
    const style = {
      display: "inline-block",
      width: "15px",
      height: "15px",
      borderRadius: '50%',
      marginLeft: '3px',
      marginTop: '5px'
    },
      tdStyle = {
        verticalAlign: 'top'
      }
      ;
    let colorStatus;
    for (let j = 0; j < item.length; j++) {
      var Items = item[j];
      switch (Items.color) {
        default:
          colorStatus = "Default";
          style.background = 'rgb(204, 204, 204)';
          break;
        case "default":
          colorStatus = "Orange"
          style.background = 'rgb(248, 188, 24)';
          break;
        case "danger":
          colorStatus = "Red";
          style.background = 'rgb(243, 65, 65)';
          break;
        case "success":
          colorStatus = "Green";
          style.background = 'rgb(53, 230, 91)';
      }

      rows.push(
        <tr>
          <td style={tdStyle} width={100}> {Items.name || "Untitled Item"}</td>
          <td style={tdStyle} width={150}>{Items.note || "-"}</td>
          <td style={tdStyle}>
            <div>{Items.aprovedStatus ? "Approved" : "Unapproved"}</div>
            <div>
              <span>{colorStatus}</span>
              <span style={style} />
            </div>
          </td>
          <td style={tdStyle} width={200}>
            {(this.getInspectImage(Items.itemImage))}
          </td>
        </tr>
      );
    }
    return rows;
  };
  getInspectImage = imgArray => {
    const imageArray = [];
    const style = {
      margin: "4px",
      display: 'inline-block',
    };
    for (let k = 0; k < imgArray.length; k++) {
      imageArray.push(
        <span style={style}>
          {/* <img src={imgArray[k]} alt={"inspect"} width={50} /> */}
        </span>
      );
    }
    return imageArray;
  };

  render() {
    const {
      inspectData,
      orderReducer,
      customerData,
      vehicleData,
      profileReducer
    } = this.props;

    const headerStyle = {
      marginLeft: "8px",
      marginRight: "8px"
    },
      invoceTableTitle = {
        fontSize: "12px"
      };

    const orderData = orderReducer ? orderReducer.orderItems : '';
    const orderId = orderReducer.orderId || "";
    const orderDate = moment(orderData.createdAt || "").format("MMM Do YYYY");
    const comapnyInfo = profileReducer ? profileReducer.profileInfo : "";
    const companyName = comapnyInfo.companyName;
    const fullName = customerData
      ? customerData.firstName + " " + customerData.lastName
      : "";
    const email = customerData ? customerData.email : "";
    const vehilceInfo = vehicleData
      ? vehicleData.year + " " + vehicleData.make + " " + vehicleData.modal
      : "";
    const invoiceTableInner = [];
    let inspectId;

    for (let index = 0; index < inspectData.length; index++) {
      inspectId = inspectData[index];
      invoiceTableInner.push(
        <div className={"invoceTableDesign"} key={index}>
          <div className={"invoceTableTitle"} style={invoceTableTitle}>
            {inspectId.inspectionName}
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
                  Item Title
                </th>
                <th>Note</th>
                <th>Status</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {(this.getInspectItems(inspectId.items))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div id={"invoicePDF"} className={"pdf-container"}>
        <div id="pageHeader" style={headerStyle}>
          <div>
            <div className="invoice">
              <div className="invoice-name">Inspection : #{orderId}</div>
              <div className="invoice-date">Created : {orderDate}</div>
            </div>
            <div className="company-name">
              <div>{companyName}</div>
            </div>
            <div className="clearfix" />
          </div>
          <div className="user-details">
            <div className="width-50">
              <div className="user-details-left">
                <div className={"text-capitalize"}>{fullName}</div>
                <div className="user-email">{email}</div>
              </div>
            </div>
            <div className="width-50">
              <div className="user-details-right">{vehilceInfo}</div>
            </div>
            <div className="clearfix" />
          </div>
        </div>
        {invoiceTableInner}

        <div id="pageFooter">Default footer</div>
      </div>
    );
  }
}
export default InspectionTable;