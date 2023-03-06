import React, { Component } from "react";
import {
  Button
} from "reactstrap";
import { connect } from "react-redux";
import * as qs from "query-string";
import TechnicianTimer from "../../components/TimeClock/technicianTimer";
import { CrmTimeClockModal } from "../../components/common/CrmTimeClockModel";
import {
  modelOpenRequest,
  getUsersList,
  addTimeLogRequest,
  updateTimeLogRequest,
  startTimer,
  stopTimer,
  getOrderDetailsRequest,
  getAllServiceListRequest,
  getAllTimeLogRequest,
  timmerStartForTechnician,
  timmerStopForTechnician,
  addNewUser
} from "../../actions"
import TimeLogList from "../../components/TimeClock/timeLogList";
import { isEqual } from "../../helpers/Object";
import { CrmUserModal } from "../../components/common/CrmUserModal";

class TimeClocks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: ""
    };
  }
  componentDidMount() {
    this.props.getUserData({ page: 1 })
    const currQuery = qs.parse(this.props.location.search);
    this.props.getAllTimeLogRequest({ ...currQuery, page: currQuery.page || 1 });
  }
  componentDidUpdate = ({ userReducer, location }) => {
    const userData = this.props.userReducer.users
    if ((userReducer.users !== userData) && (userData.length) && (userData[0].currentlyWorking)) {
      const orderId = userData[0].currentlyWorking && userData[0].currentlyWorking.orderId ? userData[0].currentlyWorking.orderId._id : null
      this.props.getAllServiceListRequest()
      if (userData[0].currentlyWorking.orderId && userData[0].currentlyWorking.orderId._id) {
        this.props.getOrderDetailsRequest({ _id: orderId })
      }
    }
    if (
      userReducer.userData &&
      this.props.userReducer.userData &&
      this.props.userReducer.userData.isSuccess !==
      userReducer.userData.isSuccess
    ) {
      if (this.props.userReducer.userData.isSuccess) {
        this.props.getUserData({ page: 1 });
      }
    }
    if (
      userReducer.userData &&
      this.props.userReducer.userData &&
      userReducer.userData.isEditSuccess !==
      this.props.userReducer.userData.isEditSuccess
    ) {
      if (this.props.userReducer.userData.isEditSuccess) {
        this.props.getUserData({ page: 1 });
      }
    }
    if (location) {
      const prevQuery = qs.parse(location.search);
      const currQuery = qs.parse(this.props.location.search);
      if (!isEqual(prevQuery, currQuery)) {
        this.props.getAllTimeLogRequest({ ...currQuery, page: currQuery.page || 1 });
      }
    }
  }
  handleTimeClockModal = () => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    modelOperate({
      timeClockModalOpen: !timeClockModalOpen
    });
  };
  /* 
  */
  handleUserModel = () => {
    this.props.modelOperate({
      addUserModal: !this.props.modelInfoReducer.modelDetails.addUserModal
    });
  }
  stopTimer = (data) => {
    const { location } = this.props;
    const lSearch = location.search;
    const { page } = qs.parse(lSearch);
    this.props.stopTimer({ ...data, page: page || 1 });
  }
  updateTimeLogRequest = (data) => {
    const { location } = this.props;
    const lSearch = location.search;
    const { page } = qs.parse(lSearch);
    this.props.updateTimeLogRequest({ ...data, page: page || 1 });
  }
  addTimeLogRequest = (data) => {
    const { location } = this.props;
    const lSearch = location.search;
    const { page } = qs.parse(lSearch);
    this.props.addTimeLogRequest({ ...data, page: page || 1 });
  }
  /* 
  */
  usersDetails = (userData) => {
    this.setState({
      userData
    })
  }
  render() {
    const {
      modelInfoReducer,
      getUserData,
      orderReducer,
      // addTimeLogRequest,
      userReducer,
      startTimer,
      // stopTimer,
      serviceReducers,
      timelogReducer,
      // updateTimeLogRequest,
      timmerStartForTechnician,
      timmerStopForTechnician,
      profileInfoReducer,
      addUser
    } = this.props;
    const {
      userData,
    } = this.state
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen, addUserModal } = modelDetails;
    const companyName = profileInfoReducer.profileInfo.companyName;
    return (
      <div className={"pl-3"}>
        <div className={"d-flex justify-content-between"}>
          <h3 className={"pb-2"}>Time Clocks</h3>
          <div className={"pr-2"}>
            <Button onClick={this.handleTimeClockModal} className={"btn-theme btn btn-round"}>+ Add Time Manually</Button>
          </div>
        </div>
        <TechnicianTimer
          userReducer={userReducer}
          technicianTodayData={timelogReducer.technicianTodayData}
          technicianWeekData={timelogReducer.technicianWeekData}
          technicianMonthData={timelogReducer.technicianMonthData}
          startTimer={startTimer}
          usersDetails={this.usersDetails}
          stopTimer={this.stopTimer}
          serviceData={serviceReducers.serviceDataList}
          timmerStartForTechnician={timmerStartForTechnician}
          timmerStopForTechnician={timmerStopForTechnician}
          onAddClick={this.handleUserModel}
        />
        <TimeLogList
          timeLogData={timelogReducer.allTimeData}
          totalDuration={timelogReducer.totalDuration}
          totalTimeLogs={timelogReducer.totalTimeLogs}
          handleTimeClockModal={this.handleTimeClockModal}
          getUserData={getUserData}
          orderReducer={orderReducer}
          modelInfoReducer={modelInfoReducer}
          isSuccess={timelogReducer.isSuccess}
          editTimeLogRequest={this.updateTimeLogRequest}
          {...this.props}
        />
        <CrmTimeClockModal
          openTimeClockModal={timeClockModalOpen}
          getUserData={getUserData}
          orderReducer={orderReducer}
          userData={userData}
          serviceData={serviceReducers.serviceDataList}
          handleTimeClockModal={this.handleTimeClockModal}
          addTimeLogRequest={this.addTimeLogRequest}
          isTimeClockData={true}
        />

        <CrmUserModal
          userModalOpen={addUserModal}
          handleUserModal={this.handleUserModel}
          addUser={addUser}
          companyName={companyName}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  modelInfoReducer: state.modelInfoReducer,
  orderReducer: state.orderReducer,
  timelogReducer: state.timelogReducer,
  userReducer: state.usersReducer,
  serviceReducers: state.serviceReducers,
  profileInfoReducer: state.profileInfoReducer
});

const mapDispatchToProps = dispatch => ({
  modelOperate: data => dispatch(modelOpenRequest({ modelDetails: data })),
  getUserData: data => dispatch(getUsersList(data)),
  addTimeLogRequest: data => dispatch(addTimeLogRequest(data)),
  updateTimeLogRequest: data => dispatch(updateTimeLogRequest(data)),
  startTimer: data => dispatch(startTimer(data)),
  stopTimer: data => dispatch(stopTimer(data)),
  getOrderDetailsRequest: data => dispatch(getOrderDetailsRequest(data)),
  getAllServiceListRequest: data => dispatch(getAllServiceListRequest(data)),
  getAllTimeLogRequest: (data) => dispatch(getAllTimeLogRequest(data)),
  timmerStartForTechnician: data => dispatch(timmerStartForTechnician(data)),
  timmerStopForTechnician: data => dispatch(timmerStopForTechnician(data)),
  addUser: data => dispatch(addNewUser(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeClocks);