import React, { Component } from "react";
import {
  Table,
} from "reactstrap";
import NoDataFound from "../../common/NoFound"
import { AppConfig } from "../../../config/AppConfig";
import moment from "moment";
import Dollor from "../../common/Dollor";
import { calculateDurationFromSeconds } from "../../../helpers/Sum"
export class UserTimelogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }
  render() {
    const { timelogData } = this.props
    const { page } = this.state
    return (
      <>
        <Table responsive className={"time-log-table"}>
          <thead>
            <tr>
              <th width='50px'>S No.</th>
              <th>Type</th>
              <th><i className="fa fa-user"></i> Technician</th>
              {/* <th>Vehicle</th> */}
              <th> Start Date Time</th>
              <th> End Date Time</th>
              <th> Duration</th>
              {/* <th>Activity</th> */}
              <th>Tech Rate/<small>Hrs</small></th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
              timelogData && timelogData.length ? timelogData.map((timeLog, index) => {
                return (
                  <tr key={index}>
                    <td>{(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}</td>
                    <td className={"text-capitalize"}>{timeLog.type}</td>
                    <td className={"text-capitalize"}>{`${timeLog.technicianId.firstName} ${timeLog.technicianId.lastName}`}</td>
                    <td>{moment(timeLog.startDateTime).format("MM/DD/YYYY  hh:mm A")}</td>
                    <td>{moment(timeLog.endDateTime).format("MM/DD/YYYY hh:mm A")}</td>
                    <td>{`${calculateDurationFromSeconds(timeLog.duration)}`}</td>
                    {/* <td>{timeLog.activity}</td>  */}
                    <td><Dollor value={`${(timeLog.technicianId.rate).toFixed(2)}`} /></td>
                    <td><Dollor value={`${parseFloat(timeLog.total).toFixed(2)}`} /></td>
                  </tr>
                )
              }) :
                <tr>
                  <td className={"text-center"} colSpan={8}>
                    <NoDataFound showAddButton={false} message={"Currently there are no time logs added."} noResult={false} />
                  </td>
                </tr>
            }
          </tbody>
        </Table>
      </>
    );
  }
}
