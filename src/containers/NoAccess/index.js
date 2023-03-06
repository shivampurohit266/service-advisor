import React, { Component } from "react";
import { Button, Card, CardHeader, CardBody } from "reactstrap";
import { AppRoutes } from "../../config/AppRoutes";
import LockIcon from "./../../assets/img/lock.png";
class NoAccess extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <h4>403 Access Forbidden</h4>
        </CardHeader>
        <CardBody className={"text-center"}>
          <img src={LockIcon} alt={"lock-icon"} style={{ maxWidth: 250 }} />
          <h5>
            You tried to access a page that you didn't have prior authorization
            for.
            <br />
            Please contact admin more info.
          </h5>
          <br />
          <Button
            color={"primary"}
            onClick={() => this.props.redirectTo(AppRoutes.DASHBOARD.url)}
          >
            Back to Dashboard
          </Button>
        </CardBody>
      </Card>
    );
  }
}

export default NoAccess;
