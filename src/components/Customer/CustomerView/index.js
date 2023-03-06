import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import {
  getCustomerDetailsSuccess,
  customerGetRequest,
  modelOpenRequest,
  vehicleAddRequest,
  getOrderDetailsRequest,
  getMatrixList,
  getRateStandardListRequest,
  setRateStandardListStart,
  customerEditRequest,
  getCustomerFleetListRequest,
  addOrderRequest,
  getVehicleMakeModalReq,
  getVehicleModalReq,
} from "../../../actions";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import Loader from "../../../containers/Loader/Loader";
import { CustomerOrders } from "./customerOrder";
import { CustomerVehicles } from "./customerVehicles";
import { CustomerInfo } from "./customerInfo";

const CustomerTab = React.lazy(() => import("./customerTab"));

const CustomerTabs = [
  {
    name: "Orders"
  },
  {
    name: "Vehicles"
  },
  {
    name: "Customer Info"
  }
];
class CustomerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerData: [],
      customerId: "",
      activeTab: 0,
      phoneToggle: false
    };
  }
  componentDidMount = () => {
    this.props.getCustomerDetailsSuccess();
    this.props.customerGetRequest({ customerId: this.props.match.params.id });
    const query = qs.parse(this.props.location.search);
    const customerId = this.props.match.params.id;
    this.props.getOrderDetailsRequest({ customerId: customerId });
    this.setState({
      customerId: this.props.match.params.id,
      activeTab: query.tab
        ? CustomerTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
        : 0
    });
  };
  componentDidUpdate = ({ customerListReducer, location }) => {
    if (
      (customerListReducer.getCustomerDetails !==
        this.props.customerListReducer.getCustomerDetails &&
        this.props.customerListReducer.customers.length) ||
      customerListReducer.customers !== this.props.customerListReducer.customers
    ) {
      // this.props.customerGetRequest({ customerId: this.props.match.params.id })
      this.setState({
        customerData: this.props.customerListReducer.customers
      });
    }
    if (this.props.location.search !== location.search) {
      const query = qs.parse(this.props.location.search);
      this.setState({
        activeTab: query.tab
          ? CustomerTabs.findIndex(
            d => d.name === decodeURIComponent(query.tab)
          )
          : 0
      });
    }
  };
  onTabChange = activeTab => {
    const customerDetailsUrl = "/customers/details/:id";
    this.props.redirectTo(
      `${customerDetailsUrl.replace(
        ":id",
        this.state.customerId
      )}?tab=${encodeURIComponent(CustomerTabs[activeTab].name)}`
    );
  };

  handlePhoneToggle = () => {
    this.setState({
      phoneToggle: !this.state.phoneToggle
    });
  };

  render() {
    const { customerData, activeTab, phoneToggle } = this.state;
    const {
      modelOperate,
      modelInfoReducer,
      vehicleAddAction,
      orderReducer,
      matrixListReducer,
      rateStandardListReducer,
      getMatrix,
      customerFleetReducer,
      customerListReducer,
      profileInfoReducer,
      setLabourRateDefault,
      getCustomerFleetListActions,
      updateCustomer,
      getStdList,
      addOrderRequest,
      getVehicleMakeModalReq,
      getVehicleModalReq,
    } = this.props;
    const { customerOrders } = orderReducer;
    let customerDetails = customerData;
    return (
      <>
        <div className={"p-3"}>
          <h3 className={"text-capitalize"}>
            {customerDetails[0]
              ? `${customerDetails[0].firstName} ${" "} ${
              customerDetails[0].lastName
              }`
              : null}
          </h3>
          <div className={"d-flex"}>
            <div className={"pr-3"}>
              {customerDetails[0] ? (
                <div>
                  <span>
                    <i className={"fa fa-phone"} />{" "}
                  </span>
                  {customerDetails[0].phoneDetail[0].value}
                </div>
              ) : null}
              {phoneToggle ? (
                <div>
                  {customerDetails[0]
                    ? customerDetails[0].phoneDetail.map((phone, index) => {
                      return (
                        <div key={index}>
                          <i className={"fa fa-phone"} /> {phone.value}
                        </div>
                      );
                    })
                    : null}
                </div>
              ) : null}
              <span
                className={"btn btn-link"}
                id={"customerAllPhoneNo"}
                onClick={this.handlePhoneToggle}
              >
                {phoneToggle ? "View Less" : "View More"}
              </span>
            </div>
            <div>
              {customerDetails[0] && customerDetails[0].email ? <span><i className={"fa fa-envelope"}/>{" "}</span> : null}
              {customerDetails[0] && customerDetails[0].email ? (
                customerDetails[0].email
              ) : (
                  // <span className={"text-muted"}>Email is not updated</span>
                  null
                )}
            </div>
          </div>
        </div>
        <div className={"p-3 position-relative"}>
          <div className={"position-relative"}>
            <Suspense fallback={"Loading.."}>
              <CustomerTab
                tabs={CustomerTabs}
                activeTab={activeTab}
                onTabChange={this.onTabChange}
              />
            </Suspense>
          </div>
          <Suspense fallback={<Loader />}>
            <React.Fragment>
              {activeTab === 0 ? (
                <CustomerOrders
                  customerOrders={customerOrders}
                  orderReducer={orderReducer}
                  customerDetails={
                    customerDetails && customerDetails[0]
                      ? customerDetails[0]
                      : null
                  }
                  addOrderRequest={addOrderRequest}
                  {...this.props}
                />
              ) : null}
              {activeTab === 1 ? (
                <CustomerVehicles
                  customerVehicles={
                    customerDetails[0] ? customerDetails[0].vehicles : []
                  }
                  modelOperate={modelOperate}
                  modelInfoReducer={modelInfoReducer}
                  vehicleAddAction={vehicleAddAction}
                  customerId={
                    customerDetails[0] ? customerDetails[0]._id : null
                  }
                  getVehicleMakeModalReq={getVehicleMakeModalReq}
                  getVehicleModalReq={getVehicleModalReq}
                  {...this.props}
                />
              ) : null}
              {activeTab === 2 ? (
                <CustomerInfo
                  customerDetails={
                    customerDetails && customerDetails[0]
                      ? customerDetails[0]
                      : null
                  }
                  customerGetRequest={this.props.customerGetRequest}
                  modelOperate={modelOperate}
                  modelInfoReducer={modelInfoReducer}
                  matrixListReducer={matrixListReducer}
                  rateStandardListReducer={rateStandardListReducer}
                  getMatrix={getMatrix}
                  updateCustomer={updateCustomer}
                  customerFleetReducer={customerFleetReducer}
                  profileInfoReducer={profileInfoReducer}
                  getStdList={getStdList}
                  customerListReducer={customerListReducer}
                  setLabourRateDefault={setLabourRateDefault}
                  getCustomerFleetListActions={getCustomerFleetListActions}
                  {...this.props}
                />
              ) : null}
            </React.Fragment>
          </Suspense>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => ({
  customerListReducer: state.customerListReducer,
  modelInfoReducer: state.modelInfoReducer,
  orderReducer: state.orderReducer,
  matrixListReducer: state.matrixListReducer,
  profileInfoReducer: state.profileInfoReducer,
  rateStandardListReducer: state.rateStandardListReducer,
  customerFleetReducer: state.fleetReducer
});
const mapDispatchToProps = dispatch => ({
  getCustomerDetailsSuccess: () => {
    dispatch(getCustomerDetailsSuccess());
  },
  customerGetRequest: data => {
    dispatch(customerGetRequest(data));
  },
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  vehicleAddAction: data => {
    dispatch(vehicleAddRequest(data));
  },
  getOrderDetailsRequest: data => {
    dispatch(getOrderDetailsRequest(data));
  },
  getMatrix: data => {
    dispatch(getMatrixList(data));
  },
  getStdList: data => {
    dispatch(getRateStandardListRequest(data));
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  updateCustomer: data => {
    dispatch(customerEditRequest(data));
  },
  getCustomerFleetListActions: () => {
    dispatch(getCustomerFleetListRequest());
  },
  addOrderRequest: data => {
    dispatch(addOrderRequest(data));
  },
  getVehicleMakeModalReq: data => {
    dispatch(getVehicleMakeModalReq(data));
  },
  getVehicleModalReq: data => {
    dispatch(getVehicleModalReq(data));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CustomerView));
