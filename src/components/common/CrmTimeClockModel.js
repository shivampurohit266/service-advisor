import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  FormFeedback
} from "reactstrap";
import Select from "react-select";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "../../scss/timeclock.scss"
import moment from "moment";
import TimeInput from 'react-time-input';
import * as classnames from "classnames";
import chroma from 'chroma-js';
import { calculateDurationFromSeconds } from "../../helpers/Sum"
// import CrmTimeMaridonBtn from "../common/CrmTimeMaridonBtn";

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

export class CrmTimeClockModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      timetype: "AM",
      timeIn: '00:00',
      timeOut: '00:00',
      duration: "0",
      selectedTechnician: {
        label: "Select technician",
        value: ""
      },
      technicianData: "",
      notes: "",
      isError: false,
      seconds: 0,
      isEditTimeClock: false,
      activityOptions: [],
      selectedActivity: {
        label: "Select one technician",
        value: ""
      }
    };
  }
  componentDidUpdate = ({ timeLogEle, openTimeClockModal }) => {
    if (openTimeClockModal !== this.props.openTimeClockModal) {
      this.removeAllState();
    }
    if (timeLogEle !== this.props.timeLogEle) {
      const {
        date,
        startDateTime,
        endDateTime,
        duration,
        technicianId,
        notes
      } = this.props.timeLogEle
      const startDateTime1 = moment.utc(startDateTime).format("HH:mm")
      const endDateTime1 = moment.utc(endDateTime).format("HH:mm")
      const calDuration = calculateDurationFromSeconds(duration >= 0 ? duration : 0)

      this.setState({
        date,
        timeIn: startDateTime1,
        timeOut: endDateTime1,
        duration: calDuration,
        technicianData: technicianId,
        selectedTechnician: {
          label: technicianId ? `${technicianId.firstName} ${technicianId.lastName}` : "Select technician",
          value: technicianId ? technicianId._id : ""
        },
        notes,
        isEditTimeClock: true,
        seconds: duration >= 0 ? duration : 0
      })
    }
  }
  async removeAllState() {
    this.setState({
      date: new Date(),
      timetype: "AM",
      timeIn: '00:00',
      timeOut: '00:00',
      duration: "0",
      selectedTechnician: {
        label: "Select technician",
        value: ""
      },
      technicianData: "",
      notes: "",
      isError: false,
      seconds: 0,
      isEditTimeClock: false,
      activityOptions: [],
      selectedActivity: {
        label: "Select one technician",
        value: ""
      }
    });
  }
  onTimeInChangeHandler = (value) => {
    this.setState({
      timeIn: value
    });
    if (this.state.timeOut !== "00:00") {
      this.handleTimeDuration();
    }
  };
  onTimeOutChangeHandler = value => {
    this.setState({
      timeOut: value
    });
    if (this.state.timeIn !== "00:00") {
      this.handleTimeDuration();
    }
  }
  handleChange = e => {
    const { value } = e.target;
    this.setState({
      notes: value
    })
  }
  handleTimeDuration = () => {
    const { timeIn, timeOut } = this.state;
    let startTime = timeIn.split(":");
    let endTime = timeOut.split(":");
    var ts1 = moment(`06/26/2019 ${timeIn}`, "M/D/YYYY HH:mm").valueOf();
    var ts2 = moment(`${startTime[0] > endTime[0] ? '06 / 27 / 2019' : startTime[0] === endTime[0] && startTime[1] > endTime[1] ? '06 / 27 / 2019' : '06 / 26 / 2019'} ${timeOut}`, "M/D/YYYY HH:mm").valueOf();
    var Seconds = moment
      .duration(moment(ts2)
        .diff(moment(ts1))
      ).asSeconds()

    const duration = calculateDurationFromSeconds(Seconds >= 0 ? Seconds : 0)

    this.setState({
      duration: duration,
      seconds: Seconds >= 0 ? Seconds : 0
    })
  }
  handleClickTimeType = (value) => {
    this.setState({
      timeType: value
    })
  }
  handleTechnicianAdd = (e) => {
    if (e && e.value) {
      this.setState({
        selectedTechnician: {
          label: e.label,
          value: e.value
        },
        technicianData: e.technician
      })
      if (this.props.isTimeClockData) {
        const options = this.getAllServiceOptions(e.technician)
        this.setState({
          activityOptions: options
        })
      }
    } else {
      this.setState({
        selectedTechnician: {
          label: "Select technician",
          value: ""
        },
        activityOptions: []
      })
    }
  }
  handleAddTimeLogs = () => {
    const { selectedTechnician, timeIn, timeOut, duration, technicianData, date, notes, seconds, selectedActivity, isEditTimeClock } = this.state
    if (!timeIn || !timeOut || !duration || !selectedTechnician.value || (!isEditTimeClock && this.props.isTimeClockData && selectedActivity.value === '')) {
      this.setState({
        isError: true
      })
      return
    } else {
      const { orderReducer, timeLogEle, isTimeClockData, activity, orderId } = this.props;
      const calDuration = parseFloat(seconds) / 3600
      const totalValue = parseFloat(calDuration) * parseFloat(technicianData.rate);
      const payload = {
        type: "Manual",
        technicianId: selectedTechnician.value,
        startDateTime: timeIn,
        endDateTime: timeOut,
        activity:
          isEditTimeClock ?
            activity :
            !isTimeClockData ?
              orderReducer.orderItems &&
                orderReducer.orderItems.orderId ?
                `Order (#${orderReducer.orderItems ? orderReducer.orderItems.orderId : ""}) ${orderReducer.orderItems.orderName || 'N/A'}` :
                "General" :
              selectedActivity.orderData &&
                selectedActivity.orderData.orderId ?
                `Order (#${selectedActivity.orderData.orderId}) ${selectedActivity.orderData.orderName || 'Unanamed Order'}` : "General",
        duration: duration,
        date: date,
        orderId: isEditTimeClock ? orderId : !isTimeClockData ? orderReducer.orderItems._id : selectedActivity.orderId,
        total: totalValue >= 0 ? totalValue : 0,
        notes: notes,
        _id: timeLogEle ? timeLogEle._id : null,
        isTimeClockData: isTimeClockData ? true : false
      }
      if (isEditTimeClock) {
        this.props.editTimeLogRequest(payload)
      } else {
        this.props.addTimeLogRequest(payload)
      }
    }
  }
  /*
  /*  
  */
  getAllServiceOptions = (users) => {
    const { serviceData } = this.props;
    let optionsData = []
    let defaultOptions = [
      {
        label: "General",
        value: "general"
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
  /*
  /*  
  */
  handleOrderSelect = (e) => {
    if (e && e.value !== "") {
      this.setState({
        selectedActivity: {
          label: e.label,
          value: e.value,
          orderData: e.orderData,
          orderId: e.orderId,
          serviceData: e.serviceData
        }
      });
    } else {
      this.setState({
        selectedActivity: {
          label: "",
          value: ""
        }
      });
    }
  }
  /*
  /*  
  */
  render() {
    const { openTimeClockModal, handleTimeClockModal, orderReducer, isTimeClockData, userData, isWholeTimeClock, /*activity,*/timeLogEle } = this.props;
    const { timeIn, timeOut, selectedTechnician, duration, isError, isEditTimeClock, notes, activityOptions, selectedActivity } = this.state
    let technicianData = []
    if (orderReducer.orderItems && orderReducer.orderItems.serviceId && orderReducer.orderItems.serviceId.length && !isTimeClockData) {
      orderReducer.orderItems.serviceId.map((serviceData, index) => {
        if (serviceData.serviceId.technician && serviceData.serviceId.technician._id) {
          technicianData.push({
            label: `${serviceData.serviceId.technician.firstName} ${serviceData.serviceId.technician.lastName}`,
            value: serviceData.serviceId.technician._id,
            technician: serviceData.serviceId.technician
          })
        }
        return true
      })
    }
    if (isTimeClockData && userData && userData.length) {
      userData.map((data) => {
        technicianData.push({
          label: `${data.firstName} ${data.lastName}`,
          value: data._id,
          technician: data
        })
        return true
      })
    }


    return (
      <>
        <Modal
          isOpen={openTimeClockModal}
          toggle={handleTimeClockModal}
          className="customer-modal custom-form-modal modal-lg time-clock-modal"
          backdrop={"static"}
        >
          <ModalHeader toggle={handleTimeClockModal}>
            {
              isEditTimeClock ? "Update Time Logs" : "Add Time Manually"
            }
          </ModalHeader>
          <ModalBody>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Technician <span className="asteric">*</span>
                </Label>
                <div className={"input-block"}>
                  <Select
                    placeholder={"Type to select technician from the list"}
                    className={classnames("w-100 form-select", {
                      "is-invalid":
                        isError && !selectedTechnician.value
                    })}
                    isClearable={selectedTechnician.value !== '' ? true : false}
                    value={selectedTechnician}
                    options={technicianData}
                    onChange={e => this.handleTechnicianAdd(e)}
                    noOptionsMessage={() => "Technician not assigned"}
                    isOpen={true}
                  />
                  {
                    isError && !selectedTechnician.value ?
                      <FormFeedback>Technician is required</FormFeedback> :
                      null
                  }
                </div>
              </FormGroup>
            </Col>
            <Col md="12" className={"p-0"}>
              <Row className={"m-0"}>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Time In <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <TimeInput
                        initTime={timeIn}
                        ref="TimeInputWrapper"
                        className={classnames("form-control", {
                          "is-invalid":
                            isError && !timeIn
                        })}
                        //mountFocus='true'
                        name={"timeIn"}
                        onTimeChange={this.onTimeInChangeHandler}
                      />
                      {
                        isError && !timeIn ?
                          <FormFeedback>Time in is required</FormFeedback> :
                          null
                      }
                    </div>
                    {/* <CrmTimeMaridonBtn handleClickTimeType={this.handleClickTimeType} timeType={timeType} /> */}
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Time Out <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <TimeInput
                        initTime={timeOut}
                        ref="TimeInputWrapper"
                        className={classnames("form-control", {
                          "is-invalid":
                            isError && !timeOut
                        })}
                        //mountFocus='true'
                        name={"timeOut"}
                        onTimeChange={this.onTimeOutChangeHandler}
                      />
                      {
                        isError && !timeOut ?
                          <FormFeedback>Time out is required</FormFeedback> :
                          null
                      }
                    </div>
                    {/* <CrmTimeMaridonBtn handleClickTimeType={this.handleClickTimeType} timeType={timeType} /> */}
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup>
                    <Label htmlFor="name" className="customer-modal-text-style">
                      Duration <span className="asteric">*</span>
                    </Label>
                    <div className={"input-block"}>
                      <Input
                        type="text"
                        name="hourRate"
                        value={duration}
                        placeholder="0"
                        id="make"
                        disabled
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Row className={"m-0"}>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Activity <span className="asteric">*</span>
                  </Label>
                  <div className={"input-block"}>
                    {
                      (isTimeClockData && isEditTimeClock) || (!isTimeClockData && !isEditTimeClock) ?

                        <Input
                          value={
                            !isWholeTimeClock ?
                              orderReducer.orderItems ? `Order (#${orderReducer.orderItems.orderId}) ${orderReducer.orderItems.orderName || 'N/A'}` : "" :
                              timeLogEle.activity
                          }
                          disabled
                        /> :

                        <Select
                          options={activityOptions}
                          placeholder={activityOptions && !activityOptions.length ? "Select one technician" : "Select service for technician"}
                          isClearable={true}
                          className={classnames("w-100 form-select", {
                            "is-invalid":
                              isError && selectedActivity.value === ''
                          })}
                          isDisabled={activityOptions && !activityOptions.length ? true : false}
                          //menuIsOpen={true}
                          value={(selectedActivity.value !== "" && selectedActivity) ? selectedActivity : ""}
                          onChange={e => this.handleOrderSelect(e)}
                          type="select"
                          styles={colourStyles}
                        />
                    }
                    {
                      isError && selectedActivity.value === "" ?
                        <FormFeedback>Activity is required</FormFeedback> :
                        null
                    }
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Date <span className="asteric">*</span>
                  </Label>
                  <div className={"input-block"}>
                    <SingleDatePicker
                      date={moment(this.state.date)} // momentPropTypes.momentObj or null
                      onDateChange={date => this.setState({ date })} // PropTypes.func.isRequired
                      id="Date" // PropTypes.string.isRequired,
                      focused={this.state.focused} // PropTypes.bool
                      onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                      isOutsideRange={() => false}
                      numberOfMonths={1}
                      hideKeyboardShortcutsPanel
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Notes
                </Label>
                <div className={"input-block"}>
                  <Input value={notes} onChange={this.handleChange} type={"textarea"} cols={"10"} rows={"3"} maxLength={"1000"} />
                </div>
              </FormGroup>
            </Col>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleAddTimeLogs}>
              {isEditTimeClock ? "Update Time Log" : "Add Time Log"}
            </Button>{" "}
            <Button color="secondary" onClick={handleTimeClockModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
