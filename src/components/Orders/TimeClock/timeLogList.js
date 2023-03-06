import React, { Component } from "react";
import {
  // Col,
  // Input,
  // FormGroup,
  // InputGroup,
  // Row,
  Button,
  UncontrolledTooltip,
  // Form,
  // Label,
  Table,
} from "reactstrap";
import NoDataFound from "../../common/NoFound"
import { AppConfig } from "../../../config/AppConfig";
import moment from "moment";
import { CrmTimeClockModal } from "../../common/CrmTimeClockModel";
import { calculateDurationFromSeconds } from "../../../helpers/Sum"
import { ConfirmBox } from "../../../helpers/SweetAlert";
import Dollor from "../../common/Dollor"

class TimeLogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      timeLogEle: ""
    };
  }

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

  handleTimeLogdelete = async (timeLogId, orderId) => {
    const { value } = await ConfirmBox({
      text: "You want to delete this time log?"
    });
    if (!value) {
      return;
    }
    const paylod = {
      isDeleted: true,
      orderId: orderId,
      _id: timeLogId
    }
    this.props.editTimeLogRequest(paylod)
  }

  render() {
    const {
      timeLogData,
      handleTimeClockModal,
      getUserData,
      orderReducer,
      orderId,
      editTimeLogRequest,
      modelInfoReducer, } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockEditModalOpen } = modelDetails;
    const { page, timeLogEle } = this.state
    return (
      <div>
        {/* <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  <InputGroup className="mb-2">
                    <input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      className="form-control"
                      value={"search"}
                      aria-describedby="searchUser"
                      placeholder="Search by Labor description"
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
                    value={"sort"}
                  >
                    <option className="form-control" value={""}>
                      Sort
                    </option>
                    <option value={"createddesc"}>Last Created</option>
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
        </div> */}
        <Table responsive className={"time-log-table"}>
          <thead>
            <tr>
              <th width='50px'>S No.</th>
              <th width={"80px"}>Type</th>
              <th width={"150px"}><i className="fa fa-user"></i> Technician</th>
              {/* <th>Vehicle</th> */}
              <th> Start Date Time</th>
              <th> End Date Time</th>
              <th> Duration</th>
              {/* <th>Activity</th> */}
              <th width={"100px"}>Tech Rate/<small>Hrs</small></th>
              <th width={"80"}>Total</th>
              <th width={"90"} className={"text-center"}>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              timeLogData && timeLogData.length ? timeLogData.map((timeLog, index) => {
                return (
                  <tr key={index}>
                    <td>{(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}</td>
                    <td className={"text-capitalize"}>{timeLog.type}</td>
                    <td className={"text-capitalize"}>{`${timeLog.technicianId.firstName} ${timeLog.technicianId.lastName}`}</td>
                    {/* <td>{timeLog.orderId && timeLog.orderId.vehicleId ? `${timeLog.orderId.vehicleId.make} ${timeLog.orderId.vehicleId.modal}` : "-"}</td> */}
                    <td>{moment.utc(timeLog.startDateTime).format("MM/DD/YYYY  HH:mm")}</td>
                    <td>{moment.utc(timeLog.endDateTime).format("MM/DD/YYYY HH:mm")}</td>
                    <td>{`${calculateDurationFromSeconds(timeLog.duration)}`}</td>
                    {/* <td>{timeLog.activity}</td>  */}
                    <td><Dollor value={`${(timeLog.technicianId.rate).toFixed(2)}`} /></td>
                    <td><Dollor value={`${parseFloat(timeLog.total).toFixed(2)}`} /></td>
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
                        onClick={() => this.handleTimeLogdelete(timeLog._id, timeLog.orderId._id)}
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
                  <td className={"text-center"} colSpan={9}>
                    <NoDataFound showAddButton message={"Currently there are no time logs added."} noResult={false} onAddClick={handleTimeClockModal} />
                  </td>
                </tr>
            }
          </tbody>
        </Table>
        <CrmTimeClockModal
        orderId={orderId}
          openTimeClockModal={timeClockEditModalOpen}
          getUserData={getUserData}
          timeLogEle={timeLogEle}
          handleTimeClockModal={this.handleEditTimeClockModal}
          orderReducer={orderReducer}
          isWholeTimeClock={false}
          isTimeClockData={true}
          editTimeLogRequest={editTimeLogRequest}
        />
      </div>
    );
  }
}

export default TimeLogList;
