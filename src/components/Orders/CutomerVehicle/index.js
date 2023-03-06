import React, { Component } from "react";
import { Col, Row, FormGroup, Label, FormFeedback, Button } from "reactstrap";
import Async from "react-select/lib/Async";
import * as classnames from "classnames";
import serviceUser from "../../../assets/service-user.png";
import serviceTyre from "../../../assets/service-car.png";
import { CrmCustomerModal } from "../../common/CrmCustomerModal";
import { CrmVehicleModal } from "../../common/Vehicles/CrmVehicleModal";
import chroma from 'chroma-js';

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma("#8157ef45");
    return {
      ...styles,
      backgroundColor: isDisabled
        ? "#ccc"
        : isSelected
          ? "#8157ef"
          : isFocused
            ? color.alpha(0.1).css()
            : null,
      "font-size": "13px",
      "padding-left": "17px",
      "font-weight": "500",
      color: isDisabled
        ? ""
        : isSelected
          ? chroma.contrast(color, 'black') > 2
            ? 'white'
            : '#0e0e0ea6'
          : data.color,
      cursor: isDisabled ? 'not-allowed' : 'pointer',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled && (isSelected ? "white" : color.alpha(0.3).css()),
      },
    };
  },
  groupHeading: (styles) => {
    return {
      ...styles,
      color: "#0e0e0e",
      cursor: "not-allowed",
      display: "block",
      "font-size": "13px",
      "font-weight": "500",
      "margin-bottom": "0.25em",
      "padding-left": "6px",
      "padding-right": "12px",
      "text-transform": "capitalize",
      "box-sizing": "border-box",
      "background": "#efefee",
      padding: "5px 5px 6px 4px"
    }
  },
  group: (styles) => {
    return {
      ...styles,
      "padding-top": "0px",
      "padding-bottom": "0px",
    }
  },
  input: styles => ({ ...styles }),
  placeholder: styles => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles }),
};


class CutomerVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: "",
      vehicleId: "",
      selectedCustomer: {
        lable: "Type to select customer",
        value: ""
      },
      selectedVehicle: {
        lable: "Type to select vehicle",
        value: ""
      },
      customerInput: "",
      vehicleInput: "",
      isCustomerVehicleUpdate: false,
      isCustomerSelected: false,
      defaultOptionsVehicle: [
        {
          label: "+ Add New Vehicle",
          value: ""
        }
      ],
      defaultOptionsCustomers: [
        {
          label: "+ Add New Customer",
          value: ""
        }
      ]
    };
  }
  /*
  /*  
  */
  componentDidMount = () => {
    this.props.getCustomerDetailsRequest({ limit: 50 });
    this.props.getVehicleData({ limit: 50 });
    if (
      this.props.orderReducer.orderItems && (this.props.orderReducer.orderItems.customerId ||
        this.props.orderReducer.orderItems.vehicleId)
    ) {
      const { customerId, vehicleId } = this.props.orderReducer.orderItems;
      if (customerId && customerId._id) {
        this.props.getCustomerDetailsRequest({ customerId: customerId._id });
      }
      this.setState({
        customerId,
        vehicleId,
        selectedCustomer: {
          label: customerId
            ? `${customerId.firstName} ${customerId.lastName}`
            : "Type to select customer",
          value: customerId ? customerId._id : ""
        },
        selectedVehicle: {
          label: vehicleId
            ? `${vehicleId.make} ${vehicleId.modal}`
            : "Type to select vehicle",
          value: vehicleId ? vehicleId._id : ""
        }
      });
    }
  }
  /*
  /*  
  */
  componentDidUpdate = ({ orderReducer, customerInfoReducer, vehicleAddInfoReducer, customerListReducer, vehicleListReducer }) => {
    if (this.props.vehicleListReducer && this.props.vehicleListReducer.vehicleList && this.props.vehicleListReducer.vehicleList.length && vehicleListReducer && vehicleListReducer.vehicleList && this.props.vehicleListReducer.vehicleList !== vehicleListReducer.vehicleList) {
      let vehicleData = [{
        label: "All Vehicles",
        value: "",
        isDisabled: true
      }];
      const options = this.props.vehicleListReducer.vehicleList.map(vehicle => ({
        label: `${vehicle.make} ${vehicle.modal}`,
        value: vehicle._id,
        data: vehicle
      }));
      this.setState({
        defaultOptionsVehicle: options.length ? vehicleData.concat(options).concat({
          label: "+ Add New Vehicle",
          value: ""
        }) : [{
          label: "Type to select vehicle",
          value: "",
          isDisabled: true
        },]
      })
    }
    if (orderReducer.orderItems !== this.props.orderReducer.orderItems) {
      if (
        this.props.orderReducer.orderItems.customerId ||
        this.props.orderReducer.orderItems.vehicleId
      ) {
        const { customerId, vehicleId } = this.props.orderReducer.orderItems;
        this.setState({
          customerId,
          vehicleId,
          selectedCustomer: {
            label: customerId
              ? `${customerId.firstName} ${customerId.lastName}`
              : "Type to select customer",
            value: customerId ? customerId._id : ""
          },
          selectedVehicle: {
            label: vehicleId
              ? `${vehicleId.make} ${vehicleId.modal}`
              : "Type to select vehicle",
            value: vehicleId ? vehicleId._id : ""
          }
        });
      }
    }
    if (customerInfoReducer.customerAddInfo !== this.props.customerInfoReducer.customerAddInfo && this.props.customerInfoReducer.customerAddInfo.firstName) {
      const customerId = this.props.customerInfoReducer.customerAddInfo
      this.setState({
        customerId,
        selectedCustomer: {
          label: customerId
            ? `${customerId.firstName} ${customerId.lastName}`
            : "Type to select customer",
          value: customerId ? customerId._id : ""
        }
      });
      this.props.customerVehicleData(customerId, this.state.vehicleId, true);
      this.props.getCustomerDetailsRequest({ customerId: customerId._id });
    }
    if (vehicleAddInfoReducer.vehicleAddInfo !== this.props.vehicleAddInfoReducer.vehicleAddInfo && this.props.vehicleAddInfoReducer.vehicleAddInfo.make) {
      const vehicleId = this.props.vehicleAddInfoReducer.vehicleAddInfo
      this.setState({
        vehicleId,
        selectedVehicle: {
          label: vehicleId
            ? `${vehicleId.make} ${vehicleId.modal}`
            : "Type to select vehicle",
          value: vehicleId ? vehicleId._id : ""
        }
      });
      this.props.customerVehicleData(this.state.customerId, vehicleId, true);
      const { selectedCustomer } = this.state;
      if (selectedCustomer && selectedCustomer.value && selectedCustomer.value !== "") {
        this.props.getCustomerDetailsRequest({ customerId: selectedCustomer.value });
      }
    }
    if (this.props.customerListReducer && this.props.customerListReducer.customers && this.props.customerListReducer.customers.length && this.props.customerListReducer.customers !== customerListReducer.customers) {
      this.handleDefaultOptionCustomers();
      // let defaultOptionsVehicle = [...this.state.defaultOptionsVehicle];
      if (this.props.customerListReducer.customers[0].vehicles && this.props.customerListReducer.customers[0].vehicles.length) {
        const { selectedCustomer } = this.state;
        if (selectedCustomer && selectedCustomer.value && selectedCustomer.value !== "") {
          const options1 = [{ label: "Current Vehicles", value: "", isDisabled: true }]
          let options = this.props.customerListReducer.customers[0].vehicles.map(vehicle => ({
            label: `${vehicle.make} ${vehicle.modal}`,
            value: vehicle._id,
            data: vehicle
          }));
          options = options1.concat(options);
          this.setState({
            defaultOptionsVehicle: options.concat({
              label: "+ Add New Vehicle",
              value: ""
            }),
            isCustomerSelected: true
          });
        }
      } else {
        this.setState({
          defaultOptionsVehicle: [
            {
              label: "Type to select vehicle",
              value: "",
              isDisabled: true
            },
          ]
        })
      }
    }
  };
  /**
   * 
   */
  handleDefaultOptionCustomers = () => {
    if (this.props.customerListReducer && this.props.customerListReducer.customers && this.props.customerListReducer.customers.length) {
      let customerData = [{ label: "All Customers", value: "", isDisabled: true }]
      this.props.customerListReducer.customers.map((data) => {
        customerData.push({ label: `${data.firstName} ${data.lastName}`, value: data._id, data: data });
        return true;
      });
      this.setState({
        defaultOptionsCustomers: customerData.concat({
          label: "+ Add New Customer",
          value: ""
        })
      });
    }
  }
  /*
  /*  
  */
  loadCustomers = (input, callback) => {
    this.setState({
      customerInput: input.length > 1 ? input : null
    })
    this.props.getCustomerData({ input, callback, limit: 50 });
  };
  /*
  /*  
  */
  loadVehicles = (input, callback) => {
    this.setState({
      vehicleInput: input.length > 1 ? input : null
    })
    this.props.getVehicleData({ input, callback, limit: 50 });
  };
  /*
  /*  
  */
  handaleCustomerSelect = (e, name) => {
    const { customerId, vehicleId, isCustomerVehicleUpdate } = this.state;
    if (e && e.label === "+ Add New Customer") {
      this.handleCustomerModel()
    }
    if (e && e.value && name === "customer") {
      this.setState(
        {
          customerId: e,
          selectedCustomer: {
            label: e.label,
            value: e.value,
          },
          isCustomerVehicleUpdate: true
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
        }
      );
    } else {
      this.setState(
        {
          customerId: "",
          selectedCustomer: {
            label: "Type to select customer",
            value: ""
          },
          isCustomerVehicleUpdate: false,
          isCustomerSelected: false,
          defaultOptionsVehicle: [this.state.defaultOptionsVehicle[0]]
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
          this.props.getCustomerDetailsRequest({ limit: 50 });
          this.props.getVehicleData({ limit: 50 });
        }
      );
    }
  };
  /*
  /*  
  */
  handaleVehicleSelect = (e, name) => {
    const { customerId, vehicleId, isCustomerVehicleUpdate, selectedCustomer } = this.state;
    if (e && e.label === "+ Add New Vehicle") {
      this.handleVehicleModel()
    }
    if (e && e.value && name === "vehicle") {
      this.setState(
        {
          vehicleId: e,
          selectedVehicle: {
            label: e.label,
            value: e.value
          },
          isCustomerVehicleUpdate: true
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
        }
      );
    } else {
      this.setState(
        {
          vehicleId: "",
          selectedVehicle: {
            label: "Type to select vehicle",
            value: ""
          },
          isCustomerVehicleUpdate: false,
          isCustomerSelected: this.state.selectedCustomer.value !== "" ? true : false
        },
        () => {
          this.props.customerVehicleData(customerId, vehicleId, isCustomerVehicleUpdate);
          this.props.getCustomerDetailsRequest({ customerId: selectedCustomer.value, limit: 50 });
          // this.props.getVehicleData();
        }
      );
    }
  };
  /*
  /*  
  */
  handleCustomerModel = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      customerModel: !modelDetails.customerModel,
      customerEditModel: false
    };
    this.props.modelOperate(data);
  }
  /*
  /*  
  */
  handleCustomerCreate = (data) => {
    const payload = {
      ...data,
      workFlowCustomer: true
    }
    this.props.addCustomer(payload)
  }
  /*
  /*  
  */
  handleVehicleModel = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: !modelDetails.vehicleModel,
      vehicleEditModel: false
    };
    this.props.modelOperate(data);
  }
  /*
  /*  
  */
  handleVehicleCreate = (data) => {
    const payload = {
      ...data,
      workFlowVehicle: true,
      customerId: this.state.selectedCustomer.value ? this.state.selectedCustomer.value : null
    }
    this.props.addVehicle(payload)
  }
  /**
   * 
   */
  onBlur = () => {
    const { selectedCustomer } = this.state;
    if (selectedCustomer.value !== "") {
      this.setState({ isCustomerSelected: true });
      this.props.getCustomerDetailsRequest({ customerId: selectedCustomer.value, limit: 50 });
    } else {
      this.props.getCustomerDetailsRequest({ limit: 50 });
      this.props.getVehicleData({ limit: 50 });
    }
  }
  /**
   * 
   */
  onBlur1 = () => {
    const { selectedVehicle, selectedCustomer } = this.state;
    if (selectedVehicle && selectedVehicle.value === "" && selectedCustomer && selectedCustomer.value === "") {
      this.props.getVehicleData({ limit: 50 });
    } else {
      this.setState({ isCustomerSelected: true });
      this.props.getCustomerDetailsRequest({ customerId: selectedCustomer.value, limit: 50 });
    }
  }
  /*
  /*  
  */
  render() {
    const {
      selectedCustomer,
      selectedVehicle,
      customerId,
      vehicleId,
      defaultOptionsVehicle,
      // isCustomerSelected,
      defaultOptionsCustomers
    } = this.state;
    const { isError, customerFleetReducer, getVehicleMakeModalReq, getVehicleModalReq } = this.props;
    const { modelDetails } = this.props.modelInfoReducer;
    return (
      <>
        <Row className={"custom-form-modal"}>
          <Col md={"5"}>
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                <span className={"label-block "}>
                  <img
                    src={serviceUser}
                    alt={"serviceUser"}
                    width={"34"}
                    height={"34"}
                  />
                  <span className={"label-text position-relative"}>
                    Customer <span className={"asteric"}>*</span>
                  </span>
                </span>
              </Label>
              <div className={"input-block"}>
                <Async
                  placeholder={"Type Customer name"}
                  loadOptions={this.loadCustomers}
                  defaultOptions={selectedCustomer.value === "" ? defaultOptionsCustomers : null}
                  value={
                    selectedCustomer.value !== ""
                      ? selectedCustomer
                      : customerId
                  }
                  isClearable={true}
                  className={classnames("w-100 form-select", {
                    "is-invalid": isError && !customerId
                  })}
                  noOptionsMessage={() =>
                    this.state.customerInput && selectedCustomer.value === ""
                      ? "No customer found"
                      : "Type customer name"
                  }
                  onChange={e => {
                    this.setState(
                      {
                        customerId: e
                      },
                      () => {
                        this.handaleCustomerSelect(e, "customer");
                      }
                    );
                  }}
                  onBlur={this.onBlur}
                  styles={colourStyles}
                />
                {isError && !customerId ? (
                  <FormFeedback>Customer data is required.</FormFeedback>
                ) : null}
              </div>
            </FormGroup>
          </Col>
          <Col md={"5"}>
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                <span className={"label-block"}>
                  <img
                    src={serviceTyre}
                    alt={"serviceUser"}
                    width={"34"}
                    height={"34"}
                  />
                  <span className={"label-text position-relative"}>
                    Vehicle <span className={"asteric"}>*</span>
                  </span>
                </span>
              </Label>
              <div className={"input-block"}>
                <Async
                  placeholder={"Type Vehicle name"}
                  loadOptions={this.loadVehicles}
                  // menuIsOpen = {true}
                  defaultOptions={
                    defaultOptionsVehicle ? defaultOptionsVehicle : null
                  }
                  className={classnames("w-100 form-select", {
                    "is-invalid": isError && !vehicleId
                  })}
                  value={
                    selectedVehicle.value !== "" ? selectedVehicle : vehicleId
                  }
                  isClearable={true}
                  noOptionsMessage={() =>
                    this.state.vehicleInput
                      ? "No vehicle found"
                      : "Type vehicle name"
                  }
                  onChange={e => {
                    this.setState(
                      {
                        vehicleId: e
                      },
                      () => {
                        this.handaleVehicleSelect(e, "vehicle");
                      }
                    );
                  }}
                  onBlur={this.onBlur1}
                  styles={colourStyles}
                />
                {isError && !vehicleId ? (
                  <FormFeedback>Vehicle data is required.</FormFeedback>
                ) : null}
              </div>
            </FormGroup>
          </Col>
          <Col md={"2"}>
            <div id={`orderUpdated`}>
              <Button
                color={""}
                size={""}
                onClick={this.props.handleEditOrder}
                className={"browse-btn"}
              >
                <i className={"fa fa-repeat mr-2"}></i>
                Update Order
              </Button>
            </div>
          </Col>
        </Row>
        <CrmCustomerModal
          customerModalOpen={modelDetails.customerModel}
          handleCustomerModalFun={this.handleCustomerModel}
          addCustomerFun={this.handleCustomerCreate}
          profileInfo={this.props.profileInfoReducer}
          editMode={false}
          customer={""}
          getCustomerFleetList={customerFleetReducer.customerFleetData}
        />
        <CrmVehicleModal
          vehicleModalOpen={modelDetails.vehicleModel}
          handleVehicleModal={this.handleVehicleModel}
          submitCreateVehicleFun={this.handleVehicleCreate}
          getVehicleMakeModalReq={getVehicleMakeModalReq}
          getVehicleModalReq={getVehicleModalReq}
        />
      </>
    );
  }
}

export default CutomerVehicle;
