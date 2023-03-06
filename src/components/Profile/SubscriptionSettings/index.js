import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import "../../../scss/subscription.scss";
import { CrmSubscriptionModel } from "../../common/CrmSubscriptionModal";
import moment from "moment";


class SubscriptionSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: "",
      firstName: "",
      lastName: "",
      openSubscriptionUpdateModel: null
    };
  }

  componentDidMount = () => {
    this.props.getSubscriptionPlanRequest("dfds");
    if (
      this.props.profileData.profileInfo &&
      this.props.openSubscriptionUpdateModel
      ) {
      const { firstName, lastName } = this.props.profileData.profileInfo;
      const { openSubscriptionUpdateModel } = this.props;
      this.setState({
        firstName,
        lastName,
        openSubscriptionUpdateModel
      });
    }
  };

  componentDidUpdate = ({ profileData }) => {
    if (profileData.profileInfo !== this.props.profileData.profileInfo) {
       this.props.getSubscriptionPlanRequest();
      const { firstName, lastName } = this.props.profileData.profileInfo;
      this.setState({
        firstName,
        lastName
      });
      
    }
  };

  handleSubscriptionModel = () => {
    const { openSubscriptionUpdateModel } = this.state;
    this.setState({
      openSubscriptionUpdateModel: !openSubscriptionUpdateModel
    });
  };

  render() {
    const { openSubscriptionUpdateModel } = this.state;
    const {
      profileData,
      subscriptionReducer,
      addSubscriptionRequest,
      getSubscriptionPlanRequest,
      openSubUpgradeModel,
      modelOperate,
      logOutRequest
    } = this.props;
    const planId = profileData.profileInfo.planId
      ? profileData.profileInfo.planId._id
      : "" || "Trial Plan";
    const planName = profileData.profileInfo.planId
      ? profileData.profileInfo.planId.name
      : "" || "Trial Plan";
    const expirationDate = profileData.profileInfo.planExiprationDate;
    const isInTrialPeriod = profileData.profileInfo.isInTrialPeriod;
    const isuserLogin = localStorage.getItem("token") ? true : false;
    const profileId = profileData.profileInfo._id || null
 
    return (
      <div>
        <Row className={"mb-4"}>
          <Col lg={"12"} md={"12"} className={"custom-form-modal"}>
            <h3 className={"pb-3 text-center pt-3"}>Subscription Details</h3>

            <div
              className={
                "d-flex subscription-plan align-items-center text-center"
              }
            >
              <div className={"d-flex flex-column w-100"}>
                <h4>
                  Currently <b className={"text-success"}>"{planName}"</b> plan
                  has been activated.
                </h4>
                <p className={"mb-1"}>
                  {isInTrialPeriod ? "Your Subscription will be expire on " : "Your next Subscription payment will be on "}
                  <b>{moment(expirationDate || "").format("MMM Do YYYY")}</b>.
                </p>
                <p className={"text-muted"}>
                  You can upgrade your Subscription at any time.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <CrmSubscriptionModel
          handleSubscriptionModel={this.handleSubscriptionModel}
          openSubscriptionModel={openSubscriptionUpdateModel}
          modelOperate={modelOperate}
          openSubUpgradeModel={openSubUpgradeModel}
          getSubscriptionPlanRequest={getSubscriptionPlanRequest}
          subscriptionReducer={subscriptionReducer}
          addSubscriptionRequest={addSubscriptionRequest}
          isProfile={true}
          currentPlanId={planId}
          logOutRequest={logOutRequest}
          renewSuscription={false}
          isInTrialPeriod={isInTrialPeriod}
          isuserLogin={isuserLogin}
          profileId={profileId}
          {...this.props}
        />
      </div>
    );
  }
}

export default SubscriptionSettings;
