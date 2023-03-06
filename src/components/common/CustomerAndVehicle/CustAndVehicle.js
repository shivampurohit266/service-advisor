import React, { Component } from "react";
import { connect } from "react-redux";

import { CrmCustomerModal } from "../CrmCustomerModal";
import {
  customerAddRequest,
  getMatrixList,
  getRateStandardListRequest,
  setRateStandardListStart,
  getCustomerFleetListRequest,
  customerEditRequest,
  vehicleAddRequest,
  customerAddSuccess,
  getVehicleMakeModalReq,
  getVehicleModalReq
} from "../../../actions";
import { CrmVehicleModal } from "../Vehicles/CrmVehicleModal";
import { CrmEditCustomerModal } from "../CrmEditCustomerModal";

class CustAndVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.getStdList("");
    this.props.setLabourRateDefault();
    this.props.getCustomerFleetList();
  }
  loadTypeRate = input => {
    this.props.getStdList(input);
  };
  onTypeHeadStdFun = data => {
    this.props.getStdList(data);
  };

  onStdAdd = () => {
    this.props.getStdList();
  };
  handleModal = () => {
    this.props.toggleModal();
  };
  handlAddCustomerAndVehicleAdd = e => {
    e.preventDefault();
  };
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };
  openCustomerForm = () => {
    this.props.modelOperate({
      custAndVehicleCustomer: true,
      custAndVehicleVehicle: false
    });
  };
  updateCustomerForm = data => {
    const { customerInfoReducer } = this.props;
    const { customerAddInfo } = customerInfoReducer;
    this.props.updateCustomer({
      data: { ...data, customerId: customerAddInfo._id }
    });
  };
  toggleModal = () => {
    this.props.resetCustomerInfo();
    this.props.toggleModal();
  };
  submitCreateVehicleFun = data => {
    const { customerInfoReducer } = this.props;
    const { customerAddInfo } = customerInfoReducer;

    this.props.vehicleAddAction({
      ...data,
      customerId: customerAddInfo._id
    });
  };
  hanleAddCustomer = (customerData) => {
    const payload = {
      ...customerData,
      workFlowCustomer: true
    }
    this.props.addCustomer(payload);
  }
  render() {
    const {
      matrixListReducer,
      rateStandardListReducer,
      customerFleetReducer,
      // addCustomer,
      profileInfoReducer,
      modelInfoReducer,
      customerInfoReducer,
      isCustVehiclemodal,
      getVehicleMakeModalReq,
      getVehicleModalReq
    } = this.props;
    const { customerAddInfo } = customerInfoReducer;
    const { modelDetails } = modelInfoReducer;
    const { custAndVehicleCustomer, custAndVehicleVehicle } = modelDetails;
    return (
      <>
        {customerAddInfo && customerAddInfo._id ? (
          <CrmEditCustomerModal
            customerModalOpen={custAndVehicleCustomer}
            handleCustomerModalFun={this.toggleModal}
            addCustomerFun={this.updateCustomerForm}
            profileInfo={this.props.profileInfoReducer}
            matrixListReducerData={matrixListReducer}
            rateStandardListData={rateStandardListReducer}
            onTypeHeadStdFun={this.onTypeHeadStdFun}
            onStdAdd={this.onStdAdd}
            editMode={true}
            customer={customerAddInfo}
            getCustomerFleetList={customerFleetReducer.customerFleetData}
            setDefaultRate={this.setDefaultRate}
            loadTypeRate={this.loadTypeRate}
            isCustVehiclemodal={isCustVehiclemodal}
          />
        ) : (
            <CrmCustomerModal
              customerModalOpen={custAndVehicleCustomer}
              handleCustomerModalFun={this.toggleModal}
              addCustomerFun={this.hanleAddCustomer}
              profileInfo={profileInfoReducer}
              matrixListReducerData={matrixListReducer}
              rateStandardListData={rateStandardListReducer}
              onTypeHeadStdFun={this.onTypeHeadStdFun}
              onStdAdd={this.onStdAdd}
              getCustomerFleetList={customerFleetReducer.customerFleetData}
              setDefaultRate={this.setDefaultRate}
              loadTypeRate={this.loadTypeRate}
              isCustVehiclemodal={isCustVehiclemodal}
            />
          )}
        <CrmVehicleModal
          vehicleModalOpen={custAndVehicleVehicle}
          handleVehicleModal={this.openCustomerForm}
          isCustVehiclemodal={isCustVehiclemodal}
          submitCreateVehicleFun={this.submitCreateVehicleFun}
          getVehicleMakeModalReq={getVehicleMakeModalReq}
          getVehicleModalReq={getVehicleModalReq}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  userReducer: state.usersReducer,
  matrixListReducer: state.matrixListReducer,
  profileInfoReducer: state.profileInfoReducer,
  modelInfoReducer: state.modelInfoReducer,
  customerListReducer: state.customerListReducer,
  rateStandardListReducer: state.rateStandardListReducer,
  customerFleetReducer: state.fleetReducer,
  customerInfoReducer: state.customerInfoReducer
});

const mapDispatchToProps = dispatch => ({
  addCustomer: data => {
    dispatch(customerAddRequest({ ...data, showAddVehicle: true }));
  },
  vehicleAddAction: data => {
    dispatch(vehicleAddRequest(data));
  },
  getMatrix: () => {
    dispatch(getMatrixList());
  },
  getStdList: data => {
    dispatch(getRateStandardListRequest(data));
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  getCustomerFleetList: () => {
    dispatch(getCustomerFleetListRequest());
  },
  updateCustomer: data => {
    dispatch(customerEditRequest({ ...data, showAddVehicle: true }));
  },
  resetCustomerInfo: () => {
    dispatch(
      customerAddSuccess({
        customerAddInfo: {}
      })
    );
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
)(CustAndVehicle);
