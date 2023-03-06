import React, { Component } from "react";
import { Row, Col, Input, Table, Button } from "reactstrap";
import { DayPickerRangeController } from "react-dates";
import CalendarIcon from "./../../assets/calendar.svg";
import Loader from "../../containers/Loader/Loader";
import { notExist } from "../../config/Constants";
import { AppRoutes } from "../../config/AppRoutes";
import moment from "moment";
import NoDataFound from "../common/NoFound";
import qs from "query-string";
class DashboardAppointments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: "today",
      startDate: null,
      endDate: null,
      start: null,
      end: null,
      openDatePicker: false,
      focusedInput: "startDate"
    };
  }
  /**
   *
   */
  componentDidUpdate({ type: oldType }) {
    const { type } = this.props;
    if (oldType !== type) {
      this.setState({
        selectedFilter: type
      });
    }
  }
  /**
   *
   */
  onFilterChange = e => {
    const { value } = e.target;
    if (value !== "custom") {
      this.setState({
        start: null,
        end: null
      });
    }
    this.setState(
      {
        selectedFilter: value,
        openDatePicker: value === "custom"
      },
      () => {
        if (!this.state.openDatePicker) {
          this.props.onFilterChange(value);
        }
      }
    );
  };
  /**
   *
   */
  onDatesChange = ({ startDate, endDate }) => {
    if (this.state.focusedInput === "endDate") {
      this.setState({
        focusedInput: "startDate"
      });
    }
    this.setState(
      {
        startDate,
        endDate,
        start: startDate ? startDate.format("MM-DD-YYYY") : null,
        end: endDate ? endDate.format("MM-DD-YYYY") : null
      },
      () => {
        if (startDate && endDate) {
          this.setState({
            openDatePicker: false,
            startDate: null,
            endDate: null
          });
          this.props.onFilterChange(
            "custom",
            startDate.format("YYYY-MM-DD"),
            endDate.format("YYYY-MM-DD")
          );
        }
      }
    );
  };
  /**
   *
   */
  onFocusChanged = focusedInput => {
    if (!focusedInput) {
      return;
    }
    this.setState({
      focusedInput
    });
  };
  /**
   *
   */
  toggleCalendar = () =>
    this.setState({ openDatePicker: !this.state.openDatePicker });
  /**
   *
   */
  render() {
    const {
      selectedFilter,
      openDatePicker,
      startDate,
      endDate,
      focusedInput,
      start,
      end
    } = this.state;
    const { appointments, redirectTo } = this.props;

    const { isLoading, data } = appointments;
    return (
      <div className={"dashboard-block-container chart-container"}>
        <Row className={"mb-1 pb-2 border-bottom ml-0 mr-0 align-items-center"}>
          <Col sm={"3"} className="pr-0 pl-0  d-flex align-items-center">
            <h3 className={" d-flex align-items-center mb-0"}>Appointments</h3>
          </Col>
          <Col sm={"3"}>
            <Input
              type={"select"}
              className={"form-control"}
              value={selectedFilter}
              onChange={this.onFilterChange}
            >
              <option value={"today"}>Today</option>
              <option value={"week"}>This week</option>
              <option value={"month"}>This month</option>
              <option value={"quarter"}>This quarter</option>
              <option value={"all"}>All</option>
              <option value={"custom"}>Custom</option>
            </Input>
          </Col>
          <Col sm={"4"} className="pr-0">
            {selectedFilter === "custom" && start && end ? (
              <div>{[start + " / " + end]}</div>
            ) : (
              ""
            )}
          </Col>
          <Col sm={"2"} className={"chart-datepicker-container"}>
            <div
              onClick={this.toggleCalendar}
              className={"calendar-icon-container"}
            >
              <img src={CalendarIcon} alt={""} />
            </div>
            {openDatePicker ? (
              <DayPickerRangeController
                startDate={startDate}
                endDate={endDate}
                focusedInput={focusedInput}
                onDatesChange={this.onDatesChange}
                onFocusChange={this.onFocusChanged}
                numberOfMonths={1}
                onOutsideClick={this.toggleCalendar}
                weekDayFormat="ddd"
                hideKeyboardShortcutsPanel
              />
            ) : null}
          </Col>
        </Row>
        <br />
        <Row className={"m-0"}>
          <Col sm={"12"}>
            {isLoading ? (
              <Loader />
            ) : (
              <Table bordered>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Note</th>
                    <th>Customer</th>
                    <th>Appointment Date Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length ? (
                    data.map((appointment, index) => {
                      return (
                        <tr key={index}>
                          <td>{appointment.appointmentTitle}</td>
                          <td>{appointment.note || notExist}</td>
                          <td>
                            {appointment.customerId.firstName ? (
                              <a
                                href="/"
                                onClick={e => {
                                  e.preventDefault();
                                  redirectTo(
                                    `${AppRoutes.CUSTOMER_DETAILS.url.replace(
                                      ":id",
                                      appointment.customerId._id
                                    )}`
                                  );
                                }}
                              >
                                {[
                                  appointment.customerId.firstName,
                                  appointment.customerId.lastName
                                ]
                                  .join(" ")
                                  .trim()}
                              </a>
                            ) : (
                              notExist
                            )}
                          </td>
                          <td>
                            {moment(appointment.appointmentDate).format("LL")}
                            <br />
                            {moment(appointment.startTime).format(
                              "hh:ssa"
                            )} - {moment(appointment.endTime).format("hh:ssa")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className={"text-center"}>
                        <NoDataFound message={"No Appointments"} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
            <Button
              className={"float-right btn-theme"}
              color={""}
              size={"sm"}
              onClick={() => {
                redirectTo(
                  `${AppRoutes.CALENDER.url}?${qs.stringify({
                    search: selectedFilter
                  })}`
                );
              }}
            >
              View All <i className="icon-arrow-right icons" />
            </Button>
            <div className={"clearfix"} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default DashboardAppointments;
