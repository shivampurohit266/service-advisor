import { Row, Col, Input, Button } from "reactstrap";
import classNames from "classnames";
import React, { Component } from "react";

import { logger, SecondsToHHMMSS } from "../../../helpers";

import "./index.scss";
import moment from "moment";

class Timers extends Component {
  timer;
  constructor(props) {
    super(props);
    this.state = {
      selectedServices: [],
      showSwitchTask: [],
      duration: [],
      total: []
    };
    this.timer = [];
  }
  /**
   *
   */
  componentDidMount() {
    logger(this.props);
  }
  /**
   *
   */
  onServiceChange = ({ target }, index) => {
    const { selectedServices } = this.state;
    selectedServices[index] = target.value;
    console.log(target.value,"target.value")
    if (target.value !== "Select Service"){
      this.setState({ selectedServices });
    }
    else{
      this.setState({ selectedServices: []});
    }
  };
  /**
   *
   */
  startTimer = (index, tech, orderId) => {
    const { selectedServices } = this.state;
    const serviceId = selectedServices[index];
    this.props.startTimer({
      serviceId,
      technicianId: tech && tech._id ? tech._id : null,
      orderId
    });
  };
  /**
   *
   */
  stopTimer = (index, tech, orderId) => {
    const { selectedServices } = this.state;
    this.props.stopTimer({
      serviceId: selectedServices[index],
      technicianId: tech && tech._id ? tech._id : null,
      orderId
    });
  };
  /**
   *
   */
  toggleSwitchTask = index => {
    const { showSwitchTask } = this.state;
    showSwitchTask[index] = !showSwitchTask[index];
    this.setState({ showSwitchTask });
  };
  /**
   *
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
  /**
   *
   */
  render() {
    const { props, state } = this;
    let { orderItems, orderId, switchTimer } = props;
    if (!orderItems) {
      orderItems = [];
    }
    const technicians = [];
    const services = [];

    orderItems.forEach(service => {
      if (!service.serviceId.technician) {
        service.serviceId.technician = {};
      }
      const ind = technicians.findIndex(
        d => service.serviceId.technician && service.serviceId.technician._id ? d._id === service.serviceId.technician._id : null
      );
      if (ind === -1 && service.serviceId.technician._id) {
        technicians.push(service.serviceId.technician);
      }
      services.push(service.serviceId);
    });
    const { selectedServices, showSwitchTask, duration } = state;
    return (
      <>
        <h4>Timers</h4>
        <div className={"timeclock-container"}>
          {technicians && technicians.length && technicians[0] !== null
            ? technicians.map((tech, index) => {
              const technicianServices = services.filter(d =>
                tech && tech._id ? d.technician._id === tech._id : null
              );
              const isWorking =
                tech && tech.currentlyWorking && tech.currentlyWorking.orderId
                  ? true
                  : false;
              const workingId = isWorking
                ? technicianServices[
                technicianServices.findIndex(
                  d => d._id === tech.currentlyWorking.serviceId
                )
                ]
                : null;
              const startTime =
                workingId &&
                  workingId.technician &&
                  workingId.technician.currentlyWorking &&
                  workingId.technician.currentlyWorking.startTime
                  ? workingId.technician.currentlyWorking.startTime
                  : false;
              return (
                <Row
                  key={index}
                  className={classNames("timeclock-row", {
                    "work-in-progress": isWorking
                  })}
                >
                  <Col sm={"4"}>
                    <div className={"technician-name text-capitalize"}>
                      <span className={"mr-2"}><i className={"fas fa-user"}></i></span>
                      {[tech.firstName, tech.lastName].join(" ")}
                    </div>
                  </Col>
                  <Col sm={"4"}>
                    <div className={"service-name-dropdown"}>
                      {!isWorking ? (
                        <Input
                          type="select"
                          value={selectedServices[index]}
                          onChange={e => this.onServiceChange(e, index)}
                        >
                          <option>Select Service</option>
                          {technicianServices.map((service, ind) => {
                            return (
                              <option
                                key={`${index}-${ind}`}
                                value={service._id}
                              >
                                {service.serviceName}
                              </option>
                            );
                          })}
                        </Input>
                      ) : workingId ? (
                        <>
                          {showSwitchTask[index] ? (
                            <>
                              <Input
                                type="select"
                                value={selectedServices[index]}
                                onChange={e => this.onServiceChange(e, index)}
                                className={"switch-select-box"}
                              >
                                <option value="">Select Service</option>
                                {technicianServices.map((service, ind) => {
                                  return (
                                    <React.Fragment key={`${index}-${ind}`}>
                                      {workingId._id !== service._id ? (
                                        <option value={service._id}>
                                          {service.serviceName}
                                        </option>
                                      ) : null}
                                    </React.Fragment>
                                  );
                                })}
                              </Input>
                              &nbsp;&nbsp;
                                <a
                                href={"/"}
                                onClick={e => {
                                  e.preventDefault();
                                  this.toggleSwitchTask(index);
                                  const serviceId = selectedServices[index];
                                  switchTimer({
                                    serviceId,
                                    technicianId:
                                      tech && tech._id ? tech._id : null,
                                    orderId,
                                    oldService: workingId._id
                                  });
                                }}
                              >
                                Update
                                </a>
                              &nbsp;&nbsp;
                                <a
                                href={"/"}
                                onClick={e => {
                                  e.preventDefault();
                                  this.toggleSwitchTask(index);
                                }}
                              >
                                Cancel
                                </a>
                            </>
                          ) : (
                              <>
                                {workingId.serviceName} &nbsp;&nbsp;
                                <a
                                  href={"/"}
                                  onClick={e => {
                                    e.preventDefault();
                                    this.toggleSwitchTask(index);
                                  }}
                                >
                                  Switch
                                </a>
                              </>
                            )}
                        </>
                      ) : null}
                    </div>
                  </Col>
                  <Col sm={"2"} className={"text-right"}>
                    <div className={"timer-running-time"}>
                      <span className={"mr-2"}>
                        <i className={"fa fa-clock-o"}></i>
                      </span>
                      {isWorking ? (
                        <>
                          {this.startTempTimer(index, startTime)}
                          {SecondsToHHMMSS(
                            duration[index] ||
                            moment().diff(moment(startTime), "seconds")
                          )}
                        </>
                      ) : <span className={"timer-running-manually"}>--:--:--</span>}
                    </div>
                  </Col>
                  <Col sm={"2"} className={"text-right"}>
                    <div className={"clock-button"}>
                      {!isWorking ? (
                        <Button
                          color={"secondary"}
                          onClick={() =>
                            this.startTimer(index, tech, orderId)
                          }
                          disabled={!this.state.selectedServices[index]}
                        >
                          Clock In
                          </Button>
                      ) : (
                          <Button
                            color={"danger"}
                            onClick={() => this.stopTimer(index, tech, orderId)}
                          >
                            Clock Out
                          </Button>
                        )}
                    </div>
                  </Col>
                </Row>
              );
            })
            : null}
        </div>
      </>
    );
  }
}

export default Timers;
