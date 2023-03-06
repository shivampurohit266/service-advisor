import React, { Component } from "react";
import {
  Label,
  CustomInput
} from "reactstrap";
import "./index.scss"
export class SendEmailAndSMS extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { headingTitle, handleReminder, isEmail, isSms, email, phone } = this.props
    return (
      <div className="text-center email-sms-section p-2">
        <div className={"bell-block"}>
          <i className="icons d-block cui-bell" />
        </div>
        <h4 className={"pb-2 pt-2"}>{headingTitle}</h4>
        {/* <img src={"/assets/img/email.svg"} width={"70"} alt={"Email"} /> */}
        <p className={"text-muted"}>
          Allow sent messages on Email or SMS.
          Click any of one option or both to sent notification.
          </p>
        <div className={"d-flex notification-block"}>
          <div className={"notifiction-option"}>
            <Label for={"Email-check"} className={"lable-new"}>
              <i className="icons cui-envelope-open" />
              Email
            </Label>
            <CustomInput
              checked={isEmail}
              name={"isEmail"}
              onChange={e => handleReminder(e)}
              disabled={!email}
              id={"Email-check"}
              type={"checkbox"}
            />
          </div>
          <div className={"notifiction-option"}>
            <Label for={"SMS-check"} className={"lable-new"}>
              <i className="icons cui-speech" /> SMS
            </Label>
            <CustomInput
              id={"SMS-check"}
              name={"isSms"}
              disabled={!phone}
              onChange={e => handleReminder(e)}
              checked={isSms}
              type={"checkbox"}
            />
          </div>
        </div>
      </div>
    );
  }
}
