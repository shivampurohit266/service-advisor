import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import {
  getAllServiceListRequest,
  getSingleUserRequest,
  getAppointments,
  getAppointmentDetails,
  modelOpenRequest,
  getTechinicianTimeLogRequest,
  editUser
} from "../../../actions";
import { withRouter } from "react-router-dom";
import { UserOrders } from "./userOrders";
import { UserAppointments } from "./userAppointment";
import { UserTimelogs } from "./userTimelogs";
import { UserDetails } from "./userDetails";
import qs from "query-string";
import Loader from "../../../containers/Loader/Loader";
import { AppRoutes } from "../../../config/AppRoutes";
const UserInfoTab = React.lazy(() => import("./userInfoTab"));

const UserInfoTabs = [
  {
    name: "Orders"
  },
  {
    name: "Appointments"
  },
  {
    name: "Time Logs"
  },
  {
    name: "Technician  Info"
  }
];
class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      userId: ""
    };
  }
  componentDidMount = () => {
    const query = qs.parse(this.props.location.search);
    const userId = this.props.match.params.id;
    this.props.getAllServiceListRequest({
      technicianId: this.props.match.params.id
    });
    this.props.getSingleUserRequest({ id: this.props.match.params.id });
    this.props.getAppointments({ technicianId: this.props.match.params.id });
    this.props.getTechinicianTimeLogRequest({
      technicianId: this.props.match.params.id
    });
    this.setState({
      userId: userId,
      activeTab: query.tab
        ? UserInfoTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
        : 0
    });
  };
  componentDidUpdate = ({ location, userReducer }) => {
    if (this.props.location.search !== location.search) {
      const query = qs.parse(this.props.location.search);
      this.setState({
        activeTab: query.tab
          ? UserInfoTabs.findIndex(
              d => d.name === decodeURIComponent(query.tab)
            )
          : 0
      });
    }
    if (
      userReducer.userData &&
      this.props.userReducer.userData &&
      userReducer.userData.isEditSuccess !==
        this.props.userReducer.userData.isEditSuccess
    ) {
      this.props.getSingleUserRequest({ id: this.props.match.params.id });
    }
  };
  onTabChange = activeTab => {
    this.props.redirectTo(
      `${AppRoutes.STAFF_MEMBERS_DETAILS.url.replace(
        ":id",
        this.state.userId
      )}?tab=${encodeURIComponent(UserInfoTabs[activeTab].name)}`
    );
  };
  render() {
    const { activeTab } = this.state;
    const {
      userReducer,
      orderReducer,
      appoitmentReducer,
      getAppointmentDetails,
      appointmentDetailsReducer,
      modelOperate,
      modelInfoReducer,
      timelogReducer,
      updateUser
    } = this.props;
    let { technicianData } = userReducer;
    if (!technicianData) {
      technicianData = {};
    }
    return (
      <div className={"p-3"}>
        <div className={"pb-3"}>
          <h3>
            {technicianData
              ? `${technicianData.firstName} ${" "} ${technicianData.lastName}`
              : null}
          </h3>
          {
            <div>
              <i className={"fa fa-phone"} />{" "}
              {technicianData.phone || "Not Added"}
            </div>
          }{" "}
          <div>
            <i className={"fa fa-envelope"} />{" "}
            {technicianData && technicianData.email ? (
              technicianData.email
            ) : (
              <span className={"text-muted"}>Email is not updated</span>
            )}
          </div>
        </div>
        <div className={"position-relative"}>
          <Suspense fallback={"Loading.."}>
            <UserInfoTab
              tabs={UserInfoTabs}
              activeTab={activeTab}
              onTabChange={this.onTabChange}
            />
          </Suspense>
        </div>
        <Suspense fallback={<Loader />}>
          <React.Fragment>
            {activeTab === 0 ? (
              <UserOrders
                technicianOrder={orderReducer.technicianOrders}
                orderReducer={orderReducer}
                {...this.props}
              />
            ) : null}
            {activeTab === 1 ? (
              <UserAppointments
                appoitmentData={appoitmentReducer.technicianAppoitment}
                isLoading={appoitmentReducer.isLoading}
                getAppointmentDetails={getAppointmentDetails}
                appointmentDetailsReducer={appointmentDetailsReducer}
                modelInfoReducer={modelInfoReducer}
                modelOperate={modelOperate}
                {...this.props}
              />
            ) : null}
            {activeTab === 2 ? (
              <UserTimelogs
                timelogData={timelogReducer.technicianTime}
                {...this.props}
              />
            ) : null}
            {activeTab === 3 ? (
              <UserDetails
                technicianData={technicianData}
                onUpdate={updateUser}
                modelInfoReducer={modelInfoReducer}
                modelOperate={modelOperate}
                {...this.props}
              />
            ) : null}
          </React.Fragment>
        </Suspense>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  modelInfoReducer: state.modelInfoReducer,
  orderReducer: state.orderReducer,
  userReducer: state.usersReducer,
  appoitmentReducer: state.appointmentReducer,
  appointmentDetailsReducer: state.appointmentDetailsReducer,
  timelogReducer: state.timelogReducer
});
const mapDispatchToProps = dispatch => ({
  getAllServiceListRequest: data => {
    dispatch(getAllServiceListRequest(data));
  },
  getSingleUserRequest: data => {
    dispatch(getSingleUserRequest(data));
  },
  getAppointments: data => {
    dispatch(getAppointments(data));
  },
  getAppointmentDetails: data => {
    dispatch(getAppointmentDetails(data));
  },
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  getTechinicianTimeLogRequest: data => {
    dispatch(getTechinicianTimeLogRequest(data));
  },
  updateUser: (id, data) => {
    dispatch(editUser({ id, data }));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserInfo));
