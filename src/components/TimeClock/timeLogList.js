import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Col,
  Input,
  FormGroup,
  InputGroup,
  Row,
  Button,
  UncontrolledTooltip,
  Form,
  Label,
  Table,
  Card
} from "reactstrap";
import NoDataFound from "../common/NoFound"
import { AppConfig } from "../../config/AppConfig";
import moment from "moment";
import { CrmTimeClockModal } from "../common/CrmTimeClockModel";
import { calculateDurationFromSeconds } from "../../helpers/Sum"
import { ConfirmBox } from "../../helpers/SweetAlert";
import Dollor from "../common/Dollor"
import Loader from "../../containers/Loader/Loader";
import PaginationHelper from "../../helpers/Pagination";
import * as qs from "query-string";
import { AppRoutes } from "../../config/AppRoutes";

class TimeLogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      timeLogEle: "",
      search: "",
      sort: ""
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.windowScroll);
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort } = qs.parse(lSearch);
    let filterApplied = false;
    if (search || sort) {
      filterApplied = true;
    }
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      search: search || "",
      filterApplied
    })
  }

  windowScroll = () => {
    let featureDiv = document.getElementById(`timeLog10`);
    if (featureDiv) {
      let scrollY = featureDiv.getBoundingClientRect().top;
      let scrollEle = document.getElementById("btn-scroll-top");
      if (scrollY <= window.scrollY) {
        scrollEle.style.display = "block";
      } else {
        scrollEle.style.display = "none";
      }
    }
  }
  scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  };
  handleEditTimeClockModal = (timeLogs) => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockEditModalOpen } = modelDetails;
    this.setState({
      timeLogEle: timeLogs
    })
    modelOperate({
      timeClockEditModalOpen: !timeClockEditModalOpen
    });
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }
  /* 
  /*
  */
  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
    });
    const { search, sort } = this.state;
    const query = {
      page: 1,
      search,
      sort
    };
    this.setState({
      filterApplied: true,
      page: 1
    });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(query)].join("?"))
  };
  /* 
  /*
  */
  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      sort: "",
      filterApplied: false
    });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo(`${pathname}`);
  };
  /* 
  /*
  */
  handleTimeLogdelete = async (timeLogId, orderId) => {
    const { value } = await ConfirmBox({
      text: "You want to delete this time log?"
    });
    if (!value) {
      return;
    }
    const paylod = {
      isDeleted: true,
      orderId: orderId ? orderId : null,
      _id: timeLogId,
      isTimerClock: true,
      page: this.state.page || 1
    }
    this.props.editTimeLogRequest(paylod)
  }
  /* 
  */
  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join('?')
    );
  };

  render() {
    const {
      timeLogData,
      handleTimeClockModal,
      getUserData,
      orderReducer,
      editTimeLogRequest,
      modelInfoReducer,
      totalDuration,
      totalTimeLogs,
      isSuccess } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockEditModalOpen } = modelDetails;
    const { page, timeLogEle, search, sort } = this.state
    let activity, orderId
    return (
      <div>
        <div className={""}>
          <Row>
            <Col md={"3"}>
              <Card className={"p-3"}>
                <div className={"d-flex"}>
                  <div className={"pt-2"}>
                    <div className={"time-clock-icon"}>
                      <i className={"fa fa-clock-o"} />
                    </div>
                  </div>
                  <div className={"pt-3 pl-3"}>
                    <span className={"text-uppercase"}>HOURS TRACKED</span>
                  </div>
                  <div className={"pl-4"}>
                    <span className={"hours-tracked"}>{
                      !isNaN((totalDuration / 3600).toFixed(2)) ? (totalDuration / 3600).toFixed(2) : 0.00}
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  <InputGroup className="mb-2">
                    <Input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      className="form-control"
                      value={search}
                      aria-describedby="searchUser"
                      placeholder="Search by Technician"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  <Input
                    type="select"
                    name="sort"
                    id="SortFilter"
                    onChange={this.handleChange}
                    value={sort}
                  >
                    <option className="form-control" value={""}>
                      All
                    </option>
                    <option value={"today"}>Today</option>
                    <option value={"thisWeek"}>This Week</option>
                    <option value={"thisMonth"}>This Month</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <div className="filter-btn-wrap">
                  <Label className="height17 label" />
                  <div className="form-group mb-0">
                    <span className="mr-2">
                      <Button
                        type="submit"
                        className="btn btn-theme-transparent"
                        id="Tooltip-1"
                      >
                        <i className="icons cui-magnifying-glass" />
                      </Button>
                      <UncontrolledTooltip target="Tooltip-1">
                        Search
                      </UncontrolledTooltip>
                    </span>
                    <span className="">
                      <Button
                        type="button"
                        className="btn btn-theme-transparent"
                        id="Tooltip-2"
                        onClick={this.onReset}
                      >
                        <i className="icon-refresh icons" />
                      </Button>
                      <UncontrolledTooltip target={"Tooltip-2"}>
                        Reset all filters
                      </UncontrolledTooltip>
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive className={"time-log-table"}>
          <thead>
            <tr>
              <th width='50px'>S No.</th>
              <th width={"80px"}>Type</th>
              <th width={"150px"}><i className="fa fa-user"></i> Technician</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th> Start Date Time</th>
              <th> End Date Time</th>
              <th> Duration</th>
              <th>Activity</th>
              <th width={"100px"}>Tech Rate/<small>Hrs</small></th>
              <th width={"80"}>Total</th>
              <th width={"90"} className={"text-center"}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isSuccess ?
              timeLogData && timeLogData.length ? timeLogData.map((timeLog, index) => {
                activity = timeLog.activity
                orderId = timeLog.orderId && timeLog.orderId.length ? timeLog.orderId[0]._id : null
                return (
                  <tr key={index} id={`timeLog${index}`}>
                    <td>{(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}</td>
                    <td className={"text-capitalize"}>{timeLog.type}</td>
                    <td className={"text-capitalize"}>{timeLog.technicianId ?
                      <Link to={AppRoutes.STAFF_MEMBERS_DETAILS.url.replace(":id", timeLog.technicianId._id)} target="_blank"
                        className={
                          "cursor_pointer text-primary text-capitalize"
                        }>
                        {`${timeLog.technicianId.firstName} ${timeLog.technicianId.lastName}`}
                      </Link>
                      : "-"}
                    </td>
                    <td className={"text-capitalize"}>{timeLog.customerId && timeLog.customerId.length ?
                      <Link to={AppRoutes.CUSTOMER_DETAILS.url.replace(":id", timeLog.customerId[0]._id)} target="_blank"
                        className={
                          "cursor_pointer text-primary text-capitalize"
                        }>
                        {`${timeLog.customerId[0].firstName} ${timeLog.customerId[0].lastName}`}
                      </Link>
                      : "-"}</td>
                    <td>{timeLog.vehicleId && timeLog.vehicleId.length ?
                      <Link to={AppRoutes.VEHICLES_DETAILS.url.replace(":id", timeLog.vehicleId[0]._id)} target="_blank"
                        className={
                          "cursor_pointer text-primary text-capitalize"
                        }>
                        {`${timeLog.vehicleId[0].make} ${timeLog.vehicleId[0].modal}`}
                      </Link>
                      : "-"}</td>
                    <td>{moment(timeLog.startDateTime).isValid() ? moment.utc(timeLog.startDateTime).format("MM/DD/YYYY  HH:mm") : moment.utc().format("MM/DD/YYYY  HH:mm")}</td>
                    <td>{moment(timeLog.endDateTime).isValid() ? moment.utc(timeLog.endDateTime).format("MM/DD/YYYY HH:mm") : moment.utc().format("MM/DD/YYYY HH:mm")}</td>
                    <td>{`${calculateDurationFromSeconds(timeLog.duration)}`}</td>
                    <td>{timeLog.activity && timeLog.activity !== "General" && timeLog.orderId && timeLog.orderId.length && timeLog.orderId[0]._id ?
                      <Link to={AppRoutes.WORKFLOW_ORDER.url.replace(":id", timeLog.orderId[0]._id)} target="_blank"
                        className={
                          "cursor_pointer text-primary text-capitalize"
                        }>
                        {timeLog.activity}
                      </Link> : timeLog.activity ? timeLog.activity : "General"}</td>
                    <td><Dollor value={timeLog.technicianId && timeLog.technicianId.rate ? `${(timeLog.technicianId.rate).toFixed(2)}` : 0.00} /></td>
                    <td><Dollor value={timeLog.total && !isNaN(timeLog.total) && (timeLog.total) >= 0 ? `${parseFloat(timeLog.total).toFixed(2)}` : 0.00} /></td>
                    <td className={"text-center"}>
                      {
                        timeLog.type !== "timeclock" ?
                          <span>
                            <Button
                              size={"sm"}
                              onClick={() => this.handleEditTimeClockModal(timeLog)}
                              id={`edit-${timeLog._id}`}
                              className={"btn-theme-transparent"}
                            >
                              <i className={"icons cui-pencil"} />
                            </Button>{" "}
                            <UncontrolledTooltip target={`edit-${timeLog._id}`}>
                              Edit
                            </UncontrolledTooltip>
                          </span> :
                          null
                      }
                      &nbsp;
                      <Button
                        size={"sm"}
                        id={`delete-${timeLog._id}`}
                        onClick={() => this.handleTimeLogdelete(timeLog._id, timeLog.orderId && timeLog.orderId.length ? timeLog.orderId[0]._id : null)}
                        className={"btn-theme-transparent"}
                      >
                        <i className={"icons cui-trash"} />
                      </Button>
                      <UncontrolledTooltip target={`delete-${timeLog._id}`}>
                        Delete
                      </UncontrolledTooltip>
                    </td>
                  </tr>
                )
              }) :
                <tr>
                  <td className={"text-center"} colSpan={12}>
                    <NoDataFound showAddButton message={"Currently there are no time logs added."} noResult={false} onAddClick={handleTimeClockModal} />
                  </td>
                </tr> :
              (
                <tr>
                  <td className={"text-center"} colSpan={10}>
                    <Loader />
                  </td>
                </tr>
              )
            }
          </tbody>
        </Table>
        {timeLogData && timeLogData.length && isSuccess ?
          <Button
            color={""}
            size={"sm"}
            className={"text-white btn-theme btn-scroll-top"}
            onClick={this.scrollToTop}
            id={"btn-scroll-top"}
            style={{ display: "none" }}
          >
            <i className={"fa fa-chevron-up"}></i>
          </Button> : null}
        {totalTimeLogs && isSuccess ? (
          <PaginationHelper
            totalRecords={totalTimeLogs}
            onPageChanged={page => {
              this.setState({ page });
              this.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}
        <CrmTimeClockModal
          openTimeClockModal={timeClockEditModalOpen}
          getUserData={getUserData}
          timeLogEle={timeLogEle}
          handleTimeClockModal={this.handleEditTimeClockModal}
          orderReducer={orderReducer}
          activity={activity}
          isWholeTimeClock={true}
          isTimeClockData={true}
          orderId={orderId}
          editTimeLogRequest={editTimeLogRequest}
        />
      </div>
    );
  }
}

export default TimeLogList;
