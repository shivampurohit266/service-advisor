import React, { Component } from "react";

import { connect } from "react-redux";
import { Card, CardBody, Button, UncontrolledTooltip } from "reactstrap";
import { withRouter } from "react-router-dom";
import Appointments from "../../components/Appointments";
import AddAppointment from "../../components/Appointments/AddAppointment";
import { logger } from "../../helpers";
import {
  customerGetRequest,
  vehicleGetRequest,
  getOrderListForSelect,
  addAppointmentRequest,
  getAppointments,
  getAppointmentDetails,
  updateAppointmentRequest,
  getUsersList,
  vehicleAddRequest,
  customerAddRequest,
  addOrderRequest,
  redirectTo,
} from "../../actions";
import Loader from "../Loader/Loader";
import AppointmentDetails from "../../components/Appointments/AppointmentDetails";
import { AppRoutes } from "./../../config/AppRoutes";
import qs from "query-string";

class Calender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: null,
      editData: {},
      filter: ""
    };
  }
  /**
   *
   */
  componentDidMount() {
    const { location } = this.props;
    const { search } = location;
    let filter = qs.parse(search)
    this.setState({ filter });
    this.props.getAppointments({ technicianId: null, vehicleId: null });
    this.props.getUserData();
  }
  /**
   *
   */
  toggleAddAppointModal = (e, selectedDate) => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { showAddAppointmentModal } = modelDetails;
    this.props.modelOperate({
      showAddAppointmentModal: !showAddAppointmentModal
    });
    if (selectedDate) {
      this.setState({
        selectedDate
      });
    } else {
      this.setState({
        selectedDate: new Date()
      });
    }
    this.setState({
      editData: {}
    });
  };
  /**
   *
   */
  onEventClick = eventId => {
    this.props.getAppointmentDetails({
      eventId
    });
    this.toggleAppointDetailsModal();
  };
  /**
   *
   */
  toggleAppointDetailsModal = () => {
    const { modelInfoReducer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { showAppointmentDetailModal } = modelDetails;
    if (!showAppointmentDetailModal) {
      this.setState({
        editData: {}
      });
    }
    this.props.modelOperate({
      showAppointmentDetailModal: !showAppointmentDetailModal
    });
  };
  /**
   *
   */
  toggleEditAppointModal = editData => {
    this.toggleAddAppointModal();
    this.setState({
      editData
    });
  };
  /**
   *
   */
  onOrderClick = orderId => {
    window.open(
      `${AppRoutes.WORKFLOW_ORDER.url.replace(":id", orderId)}`,
      "_blank"
    );
  };
  /**
   *
   */
  onCustomerClick = customerId => {
    window.open(
      `${AppRoutes.CUSTOMER_DETAILS.url.replace(":id", customerId)}`,
      "_blank"
    );
  };
  /**
   *
   */
  onVehicleClick = vehicleId => {
    window.open(
      `${AppRoutes.VEHICLES_DETAILS.url.replace(":id", vehicleId)}`,
      "_blank"
    );
  };
  /**
   *
   */
  render() {
    const {
      modelInfoReducer,
      getCustomerData,
      getVehicleData,
      getOrders,
      addAppointment,
      appointmentReducer,
      appointmentDetailsReducer,
      updateAppointment,
      getUserData,
      modelOperate,
      addCustomer,
      profileInfoReducer,
      customerFleetReducer,
      addVehicle,
      customerInfoReducer,
      vehicleAddInfoReducer,
      addOrderRequest,
      orderReducer,
      userReducer,
      onGoPage
    } = this.props;
    const { isLoading, data } = appointmentReducer;
    const { modelDetails } = modelInfoReducer;
    const {
      showAddAppointmentModal,
      showAppointmentDetailModal
    } = modelDetails;
    logger("Show Add Modal", showAddAppointmentModal);
    const { selectedDate, editData, filter } = this.state;
    return (
      <div className="animated fadeIn">
        <Card className="white-card position-relative">
          <div className={"invt-add-btn-block"}>
            <Button
              color="primary"
              id="add-Appointment"
              onClick={this.toggleAddAppointModal}
            >
              <i className={"fa fa-plus"} />
              &nbsp; Create New
            </Button>
            <UncontrolledTooltip target={"add-Appointment"}>
              Create New Appointment
            </UncontrolledTooltip>
          </div>
          <CardBody className={"custom-card-body inventory-card position-relative"}>
            {isLoading ? (
              <Loader />
            ) : (
                <Appointments
                  addAppointment={this.toggleAddAppointModal}
                  data={data}
                  onEventClick={this.onEventClick}
                  onGoPage={onGoPage}
                  filter={filter}
                  userReducer={userReducer}
                />
              )}
          </CardBody>
        </Card>
        <AddAppointment
          isOpen={showAddAppointmentModal}
          toggleAddAppointModal={this.toggleAddAppointModal}
          getCustomerData={getCustomerData}
          getVehicleData={getVehicleData}
          date={selectedDate}
          getOrders={getOrders}
          addAppointment={addAppointment}
          updateAppointment={updateAppointment}
          editData={editData}
          getUserData={getUserData}
          profileInfoReducer={profileInfoReducer}
          modelInfoReducer={modelInfoReducer}
          modelOperate={modelOperate}
          addCustomer={addCustomer}
          addVehicle={addVehicle}
          customerFleetReducer={customerFleetReducer}
          customerInfoReducer={customerInfoReducer}
          vehicleAddInfoReducer={vehicleAddInfoReducer}
          addOrderRequest={addOrderRequest}
          orderReducer={orderReducer}
        />
        <AppointmentDetails
          isOpen={showAppointmentDetailModal}
          toggle={this.toggleAppointDetailsModal}
          isLoading={appointmentDetailsReducer.isLoading}
          data={appointmentDetailsReducer.data}
          toggleEditAppointModal={this.toggleEditAppointModal}
          orderClick={this.onOrderClick}
          onCustomerClick={this.onCustomerClick}
          onVehicleClick={this.onVehicleClick}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  appointmentReducer: state.appointmentReducer,
  appointmentDetailsReducer: state.appointmentDetailsReducer,
  customerFleetReducer: state.fleetReducer,
  modelInfoReducer: state.modelInfoReducer,
  profileInfoReducer: state.profileInfoReducer,
  customerInfoReducer: state.customerInfoReducer,
  vehicleAddInfoReducer: state.vehicleAddInfoReducer,
  orderReducer: state.orderReducer,
  userReducer: state.usersReducer,
});

const mapDispatchToProps = dispatch => ({
  getUserData: data => dispatch(getUsersList(data)),
  getAppointments: data => dispatch(getAppointments(data)),
  getAppointmentDetails: data => dispatch(getAppointmentDetails(data)),
  getCustomerData: data => dispatch(customerGetRequest(data)),
  getVehicleData: data => dispatch(vehicleGetRequest(data)),
  getOrders: data => dispatch(getOrderListForSelect(data)),
  addAppointment: data => dispatch(addAppointmentRequest(data)),
  updateAppointment: data => dispatch(updateAppointmentRequest(data)),
  addCustomer: data => dispatch(customerAddRequest(data)),
  addVehicle: data => dispatch(vehicleAddRequest(data)),
  addOrderRequest: data => dispatch(addOrderRequest(data)),
  onGoPage: data => {
    dispatch(redirectTo({ path: data }))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Calender));
