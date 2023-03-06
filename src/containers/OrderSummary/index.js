import React, { Component } from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  verifyLinkRequest,
  sendMessage,
  updateOrderDetailsRequest,
  newMsgSend
} from "../../actions";
import * as qs from "query-string";
import OrderSummary from "../../components/OrderSummary";
import Message from "../../components/Orders/Message";

class OrderSummaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: "",
      query: "",
      orderStatus: false
    };
  }
  componentDidMount = () => {
    const query = qs.parse(this.props.location.search);
    // if is summary true to check payload
    this.setState({
      query
    });
    this.props.verifyLinkRequest(query);
  };
  componentDidUpdate = ({ summaryReducer }) => {
    const propData = this.props.summaryReducer;
    if (summaryReducer.orderData.status !== propData.orderData.status) {
      this.setState({
        orderStatus: propData.orderData.status
      });
    }
  };
  authorizStatus = customerId => {
    const { summaryReducer } = this.props;
    const payload = {
      status: true,
      _id: summaryReducer.orderData._id,
      authorizerId: customerId,
      query: this.state.query,
      isSummary: true
    };
    this.props.updateOrderDetailsRequest(payload);
  };

  scrollTomessage = () => {
    var elmnt = document.getElementById("message-warp");
    elmnt.scrollIntoView();
  };

  getPdf = () => {
    const { summaryReducer } = this.props;
    let filename =
      summaryReducer && summaryReducer.orderData
        ? summaryReducer.orderData.invoiceURL
        : "";
    let pdfWindow = window.open("");
    pdfWindow.document.body.style.margin = "0px";
    pdfWindow.document.body.innerHTML =
      "<html><title>Invoice</title><embed width='100%' height='100%' name='plugin' data='pdf' type='application/pdf' src='" +
      filename +
      "'></embed></body></html>";
  };

  render() {
    const {
      summaryReducer,
      sendMessage,
      updateOrderDetailsRequest,
      newMsgSend
    } = this.props;
    const { orderStatus } = this.state;
    const customerInfo = summaryReducer
      ? summaryReducer.orderData.customerId
      : "";
    return (
      <div className={"summary-warp-body pt-4 pb-2"}>
        <div className={"btn-block"}>
          <Button
            color={"warning"}
            className={"mr-1"}
            size={""}
            onClick={this.scrollTomessage}
          >
            Send Message
          </Button>
          {!orderStatus ? (
            <Button
              color={"success"}
              className={"mr-1"}
              size={""}
              onClick={e => this.authorizStatus(customerInfo._id)}
            >
              Authorize Work
            </Button>
          ) : (
            <Button color={"success"} className={"mr-1 disabled"} size={""}>
              <i className={"fas fa-check"} /> Work is Authorize
            </Button>
          )}
          <Button
            color={"primary"}
            className={"mr-1"}
            size={""}
            onClick={this.getPdf}
          >
            Print
          </Button>
        </div>
        <div className={"summary-warp  border"}>
          <OrderSummary
            summaryReducer={summaryReducer}
            updateOrderDetailsRequest={updateOrderDetailsRequest}
          />

          <div className="p-1 border-top mb-2" />
          <Message
            messagesList={summaryReducer.messageData}
            summaryReducer={summaryReducer}
            customerSummryData={summaryReducer.orderData.customerId}
            profileSummary={summaryReducer.companyData}
            isSummary={true}
            sendMessage={sendMessage}
            query={this.state.query}
            newMsgSend={newMsgSend}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orderReducer: state.orderReducer,
  summaryReducer: state.summaryReducer,
  inspectionReducer: state.inspectionReducer
});

const mapDispatchToProps = dispatch => ({
  verifyLinkRequest: data => {
    dispatch(verifyLinkRequest(data));
  },
  sendMessage: data => {
    dispatch(sendMessage(data));
  },
  updateOrderDetailsRequest: data => {
    dispatch(updateOrderDetailsRequest(data));
  },
  newMsgSend: data => dispatch(newMsgSend(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OrderSummaryView));
