import React, { Component}  from "react";
import moment from 'moment';
import {
  Badge
} from "reactstrap";

export default class LastUpdated extends Component {
    render() {
      return(
          <div className="last-updated-block">
            <div><b>Last Updated </b></div>
            <div>
              <Badge color={"secondary"}>
              {this.props.updatedAt ? moment(this.props.updatedAt).format("MMM Do YYYY, h:mm A") : null}
              </Badge>
            </div>
          </div>
      )
    }
}

