import React, { Component } from "react";
import { Card, CardBody, Col, Row, FormGroup, Label, Button } from "reactstrap";
import Avtar from "../common/Avtar";
import "./index.scss";
import Select from "react-select";
import moment from "moment";
import { SecondsToHHMMSS, calculateDurationFromSeconds } from "../../helpers";
import NoDataFound from "../common/NoFound"
import chroma from 'chroma-js';
import Loader from "../../containers/Loader/Loader";

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma("#8157ef45");
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
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

class TechnicianTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: [],
      userData: [],
      isTimerData: false
    };
    this.timer = [];
  }

  componentDidUpdate = ({ userReducer }) => {
    const userNewReducer = this.props.userReducer;
    const timer = userReducer.isStartTimer !== userNewReducer.isStartTimer;
    if (
      userNewReducer &&
      userNewReducer.users &&
      userNewReducer.users.length &&
      userReducer.users !== userNewReducer.users
    ) {
      userNewReducer.users.forEach(data => {
        this.state.userData.push({
          ...data,
          selectedOrder: {
            label: "",
            value: ""
          }
        });
        this.props.usersDetails(this.state.userData)
      });
    }
    if (timer) {
      this.setState(
        {
          userData: []
        },
        () => {
          userNewReducer.users.forEach(data => {
            this.state.userData.push({
              ...data,
              selectedOrder: {
                label: "",
                value: ""
              }
            });
            this.props.usersDetails(this.state.userData)
            return true;
          });
        }
      );
    }
  };
  startTimer = (techId, serviceId, index, orderId, orderData, serviceData) => {
    const users = [...this.state.userData]
    if (users[index] && users[index].currentlyWorking) {
      users[index].currentlyWorking.generalService = orderId ? false : true
      users[index].currentlyWorking.orderId = orderId ? orderData : null
      users[index].currentlyWorking.serviceId = serviceId ? serviceData : null
      users[index].currentlyWorking.startTime = new Date().toJSON()
    }
    this.props.timmerStartForTechnician(users)
    this.props.startTimer({
      technicianId: techId,
      orderId: orderId ? orderId : null,
      serviceId: serviceId ? serviceId : null,
      index: index,
      isMainTimeClock: true
    });
  };
  /*
  /*  
  */
  startTempTimer = (index, startTime) => {
    if (this.timer[index]) {
      clearInterval(this.timer[index]);
    }
    const { duration } = this.state;
    this.timer[index] = setInterval(() => {
      duration[index] = moment().diff(moment(startTime), "seconds");
      this.setState({
        duration
      });
    }, 1000);
  };
  /*
   *
   */
  stopTimer = (techId, orderId, serviceId, index) => {
    this.setState({
      isTimerData: true
    });
    if (this.timer[index]) {
      clearInterval(this.timer[index]);
    }
    const { duration } = this.state;
    duration[index] = 0;
    const users = [...this.state.userData]
    users[index].currentlyWorking = {
      generalService: false,
      startTime: new Date().toJSON(),
      _id: users[index].currentlyWorking._id
    }
    this.props.timmerStopForTechnician(users)
    this.setState({
      userData: users,
      duration
    })
    this.props.stopTimer({
      technicianId: techId,
      orderId,
      serviceId,
      isMainTimeClock: true
    });
  };
  /*
   *
   */
  handleOrderSelect = (e, index) => {
    if (e && e.value !== "") {
      const userData = [...this.state.userData];
      userData[index].selectedOrder.label = e.label;
      userData[index].selectedOrder.value = e.value;
      userData[index].selectedOrder.orderData = e.orderData;
      userData[index].selectedOrder.orderId = e.orderId;
      userData[index].selectedOrder.serviceData = e.serviceData;
      this.setState({
        userData
      });
    } else {
      const userData = [...this.state.userData];
      userData[index].selectedOrder.label = "General";
      userData[index].selectedOrder.value = "";
      this.setState({
        userData
      });
    }
  };
  /*
  /* 
  */
  getAllServiceOptions = (users) => {
    const { serviceData } = this.props;
    let optionsData = []
    let defaultOptions = [
      {
        label: "General",
        value: ""
      }
    ];
    const technicicanService = serviceData.filter(
      service => service.technician === users._id
    );
    technicicanService.map(data => {
      if (users._id === data.technician && data.orderId) {
        let serviceArray = []
        if ((data.orderId && data.orderId.serviceId)) {
          data.orderId.serviceId.map((service) => {
            if (users._id === service.serviceId.technician) {
              serviceArray.push(
                {
                  label: ` ${service.serviceId.serviceName}`,
                  value: service.serviceId._id,
                  serviceData: service.serviceId,
                  orderId: service.serviceId.orderId,
                  orderData: data.orderId
                }
              )
            }
            return true
          })
        }
        const dataObject = {
          label: `Order(#${data.orderId.orderId}) ${
            data.orderId.orderName
            }`,
          options: serviceArray,
          data: data.orderId
        };
        defaultOptions.push(dataObject);
      }
      return true;
    });
    defaultOptions.map((item) => {
      if (optionsData && optionsData.length) {

        let index = optionsData.findIndex(data => {
          return (
            (data.label === item.label)
          )
        })
        if (index === -1) {
          optionsData.push(item);
        }
      } else {
        optionsData.push(item);
      }
      return true
    })
    return optionsData
  }
  getTechnicianTimeData = (users) => {
    const { technicianTodayData, technicianWeekData, technicianMonthData } = this.props
    let technicianTodayTime, technicianWeekTime, technicianMonthTime
    technicianTodayData && technicianTodayData.length ?
      technicianTodayData.map((data) => {
        if (users._id === data._id) {
          technicianTodayTime = data.duration
        }
        return true
      }) :
      technicianTodayTime = "0.00"

    technicianWeekData && technicianWeekData.length ?
      technicianWeekData.map((data) => {
        if (users._id === data._id) {
          technicianWeekTime = data.duration
        }
        return true
      }) :
      technicianWeekTime = "0.00"

    technicianMonthData && technicianMonthData.length ?
      technicianMonthData.map((data) => {
        if (users._id === data._id) {
          technicianMonthTime = data.duration
        }
        return true
      }) :
      technicianMonthTime = "0.00"
    const timeData = {
      technicianTodayTime,
      technicianWeekTime,
      technicianMonthTime
    }
    return (timeData)
  }

  render() {
    const { userReducer } = this.props;
    const { isLoading } = userReducer;
    const { duration, userData } = this.state;
    const timer = userReducer.isStartTimer;
    return (
      <div>
        <Row>
          {!isLoading ? (
            userData && userData.length ? (
              userData.map((users, index) => {
                const timeData = this.getTechnicianTimeData(users)
                const isWorking =
                  users &&
                  users.currentlyWorking &&
                  (users.currentlyWorking.orderId ||
                    users.currentlyWorking.generalService ||
                    (timer && timer.length ? timer[index] : false));

                const startTime =
                  users &&
                    users.currentlyWorking &&
                    users.currentlyWorking.startTime
                    ? users.currentlyWorking.startTime
                    : false;

                const options = this.getAllServiceOptions(users)
                const defaultOrderSelect = {
                  label: "General",
                  value: ""
                };
                return (
                  <Col key={index} md={"3"}>
                    <Card className={"text-center timer-display"}>
                      <div className={isWorking ? "isWorking" : ""}>
                        <CardBody>
                          <div className={"pb-2"}>
                            <Avtar
                              value={users.firstName}
                              class={"avtar-component"}
                            />
                          </div>
                          <h5 className={"technician-name"}>
                            {users.firstName} {users.lastName}
                          </h5>
                          <h6>
                            {
                              isWorking ?
                                `Clocked in at ${moment(users.currentlyWorking.startTime).format("hh:mm a")}` :
                                `Clocked out at ${moment(users.currentlyWorking.startTime).startOf('seconds').fromNow()}`
                            }
                          </h6>
                          <div className={"pb-2"}>
                            {isWorking ? (
                              <div className={"timer-running-manually"}>
                                {this.startTempTimer(index, startTime)}
                                {SecondsToHHMMSS(
                                  (duration[index] ? duration[index] : 0) ||
                                  moment().diff(moment(startTime), "seconds")
                                )}
                              </div>
                            ) : (
                                <span className={"timer-running-manually"}>
                                  --:--:--
                            </span>
                              )}
                          </div>
                          <Card className={"pb-2"}>
                            <Row className={"m-0"}>
                              <div className={"task-area"}>
                                <span className={"text-day"}>Today</span>
                                <div>
                                  <span>{calculateDurationFromSeconds(!isNaN(timeData.technicianTodayTime) ? timeData.technicianTodayTime : "0.00")}</span>
                                </div>
                              </div>
                              <div className={"task-area"}>
                                <span className={"text-day"}>This Week</span>
                                <div>
                                  <span>{calculateDurationFromSeconds(!isNaN(timeData.technicianWeekTime) ? timeData.technicianWeekTime : "0.00")}</span>
                                </div>
                              </div>
                              <div className={"task-area"}>
                                <span className={"text-day"}>This Month</span>
                                <div>
                                  <span>{calculateDurationFromSeconds(!isNaN(timeData.technicianMonthTime) ? timeData.technicianMonthTime : "0.00")}</span>
                                </div>
                              </div>
                            </Row>
                          </Card>
                          <FormGroup className={"d-flex align-items-center"}>
                            <Label className={"mr-2 mb-0"}>Activity</Label>
                            <div className={"text-left w-100 form-select"}>
                              <Select
                                className={"w-100 form-select"}
                                options={options}
                                //menuIsOpen={true}
                                value={
                                  isWorking
                                    ? users.currentlyWorking.generalService
                                      ? defaultOrderSelect
                                      : {
                                        value: users.currentlyWorking.serviceId,
                                        label: users.currentlyWorking.serviceId ? `${users.currentlyWorking.serviceId.serviceName}` : ""
                                      }
                                    : users.selectedOrder.value !== "" ? users.selectedOrder : defaultOrderSelect
                                }
                                onChange={e => this.handleOrderSelect(e, index)}
                                type="select"
                                styles={colourStyles}
                              />
                            </div>
                          </FormGroup>
                          {!isWorking ? (
                            <Button
                              onClick={
                                users.selectedOrder.value !== ""
                                  ? () =>
                                    this.startTimer(
                                      users._id,
                                      users.selectedOrder.value,
                                      index,
                                      users.selectedOrder.orderId,
                                      users.selectedOrder.orderData,
                                      users.selectedOrder.serviceData
                                    )
                                  : () => this.startTimer(users._id, null, index, null, null, null)
                              }
                            >
                              Clock In
                          </Button>
                          ) : (
                              <Button
                                color={"danger"}
                                onClick={() =>
                                  this.stopTimer(
                                    users._id,
                                    users.currentlyWorking.orderId,
                                    users.currentlyWorking.serviceId,
                                    index
                                  )
                                }
                              >
                                Clock Out
                          </Button>
                            )}
                        </CardBody>
                      </div>
                    </Card>
                  </Col>
                );
              })
            ) : (
                <Col lg="12">
                  <div className={"text-center"}>
                    <NoDataFound
                      showAddButton
                      message={"Currently there are no technician added"}
                      onAddClick={this.props.onAddClick}
                    />
                  </div>
                </Col>
              )
          ) : (
              <Col lg="12">
                <div className={"text-center"} >
                  <Loader />
                </div>
              </Col>
            )}
        </Row>
      </div>
    );
  }
}

export default TechnicianTimer;
