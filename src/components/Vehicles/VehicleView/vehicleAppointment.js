import React, { Component } from "react";
import AppointmentDetails from "../../Appointments/AppointmentDetails";
import { Table, Button, UncontrolledTooltip } from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import NoDataFound from "../../common/NoFound";
import { AppConfig } from "../../../config/AppConfig";
import moment from "moment";
import { AppRoutes } from "../../../config/AppRoutes";
export class VehicleAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      editData: {},
      selectedDate: null,
    };
  }
  /*
  /*  
  */
  handleOrderDetails = (orderId) => {
    this.props.redirectTo(
      `${AppRoutes.WORKFLOW_ORDER.url.replace(
        ":id",
        orderId
      )}`
    );
  }
  /*
  /*  
  */
 handleTechnicianDetails = (technicianId) => {
    this.props.redirectTo(
      `${AppRoutes.STAFF_MEMBERS_DETAILS.url.replace(
        ":id",
        technicianId
      )}`
    );
  }
  /*
  /*  
  */
  handleCustomerDetails = (customerId) => {
    this.props.redirectTo(
      AppRoutes.CUSTOMER_DETAILS.url.replace(
        ":id",
        `${customerId}`
      ))
  }
  /*
  /*  
  */
  onEventClick = eventId => {
    this.props.getAppointmentDetails({
      eventId
    });
    this.toggleAppointDetailsModal();
  };
  /*
  /*  
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
  /*
  /*  
  */
  render() {
    const {
      vehicleAppointment,
      isLoading,
      modelInfoReducer,
      appointmentDetailsReducer,
    } = this.props
    const { page } = this.state
    const { modelDetails } = modelInfoReducer;
    const {
      showAppointmentDetailModal,
    } = modelDetails;
    return (
      <>
        <Table responsive>
          <thead>
            <tr>
              <th width="20">
                S No.
              </th>
              <th width={"100"}>
                Appoitment Title
              </th>
              <th width={"50"}>
                Appointment Date
              </th>
              <th width={"50"}>
                Start Time
              </th>
              <th width={"50"}>
                Customer Name
              </th>
              <th width={"50"}>
                Technician Name
              </th>
              <th width={"50"}>
                Order Id
              </th>
              <th width={"50"}>
                Order Title
              </th>
              <th width={"50"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              vehicleAppointment && vehicleAppointment.length ? (
                vehicleAppointment.map((appoitment, index) => {
                  return (
                    <tr key={index}>
                      <td >
                        {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                      </td>
                      <td>
                        {appoitment.appointmentTitle || "Unnammed"}
                      </td>
                      <td>
                        {moment(appoitment.appointmentDate).format("MM/DD/YYYY")}
                      </td>
                      <td>
                        {moment(appoitment.startTime).format("hh:mm A")}
                      </td>
                      <td onClick={() => { this.handleCustomerDetails(appoitment.customerId._id) }} id={`customer-details-${appoitment._id}`} className={"text-primary cursor_pointer"}>
                        {
                          appoitment.customerId ?
                            `${appoitment.customerId.firstName}${" "}${appoitment.customerId.lastName}` :
                            null

                        }
                      </td>
                      <UncontrolledTooltip target={`customer-details-${appoitment._id}`}>
                        View Customer
                      </UncontrolledTooltip>
                      <td>
                        {
                          appoitment.techinicians && appoitment.techinicians.length ?
                            appoitment.techinicians.map((techinician, index) => {
                              return (
                                <React.Fragment key={index}>
                                  <div onClick={() => { this.handleTechnicianDetails(techinician._id) }} id={`technician-details-${techinician._id}`} className={"cursor_pointer text-primary"}>
                                    {`${techinician.firstName}${" "}${techinician.lastName}`}
                                  </div>
                                  <UncontrolledTooltip target={`technician-details-${techinician._id}`}>
                                    View Technician
                                  </UncontrolledTooltip>
                                </React.Fragment>
                              )
                            })
                            : "Not Assigned"
                        }

                      </td>
                      <td>
                        {
                          appoitment.orderId ?
                            `#${appoitment.orderId.orderId}` :
                            "Not Assigned"
                        }
                      </td>
                      <td>
                        {
                          appoitment.orderId ?
                            <>
                              <div onClick={() => this.handleOrderDetails(appoitment.orderId._id)} id={`order-${appoitment.orderId.orderId}`} className={"text-primary cursor_pointer"}>
                                {appoitment.orderId.orderName || "Unnamed"}
                              </div>
                              <UncontrolledTooltip target={`order-${appoitment.orderId.orderId}`}>
                                View order
                            </UncontrolledTooltip>
                            </> :
                            "Not Assigned"
                        }
                      </td>
                      <td className={"text-center"}>
                        <span className="mr-2">
                          <Button
                            className={"btn-theme-transparent"}
                            size={"sm"}
                            onClick={() => { this.onEventClick(appoitment._id) }}
                            id={`appoitment-details-${appoitment._id}`}
                          >
                            <i className="fas fa-eye" />
                          </Button>
                          <UncontrolledTooltip target={`appoitment-details-${appoitment._id}`}>
                            View Appointment
                          </UncontrolledTooltip>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={12}>
                      <NoDataFound
                        showAddButton={false}
                        message={
                          "Currently there are no customer appoitment added."
                        }

                      />
                    </td>
                  </tr>
                )
            ) : (
                <tr>
                  <td className={"text-center"} colSpan={12}>
                    <Loader />
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
        <AppointmentDetails
          isOpen={showAppointmentDetailModal}
          toggle={this.toggleAppointDetailsModal}
          isLoading={appointmentDetailsReducer.isLoading}
          data={appointmentDetailsReducer.data}
          toggleEditAppointModal={this.toggleEditAppointModal}
          orderClick={this.handleOrderDetails}
          onCustomerClick={this.handleCustomerDetails}
          onVehicleClick={this.handleVehicleDetails}
          isTechnicianData={true}
        />
      </>
    );
  }
}
