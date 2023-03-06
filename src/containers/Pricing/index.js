import React, { Component} from "react";
import { connect } from "react-redux";
import { CrmSubscriptionModel } from "../../components/common/CrmSubscriptionModal";
import { Row, Col} from "reactstrap";
import moment from "moment";
import {
  getSubscriptionPlanRequest,
  profileInfoRequest,
  modelOpenRequest,
  addSubscriptionRequest,
  logOutRequest
} from "../../actions";
import HomeHeader from "../../components/HomePage/homeHeader";
import HomeFooter from "../../components/HomePage/homeFooter";

class Pricing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  componentDidMount = () => {
    this.props.getSubscriptionPlanRequest();
    if (localStorage.getItem("token")) {
      this.props.profileInfoAction();
    }
    //this.props.profileInfoAction();
  };

  signOut() {
    this.props.logoutUser();
  }

  render() {
    const {
      profileInfoReducer,
      modelOperate,
      addSubscriptionRequest,
      modelInfoReducer
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { openSubUpgradeModel, openSubscriptionUpdateModel } = modelDetails;
    const planExiprationDate = profileInfoReducer
      ? profileInfoReducer.profileInfo.planExiprationDate
      : null;
    const planId = profileInfoReducer.profileInfo.planId
      ? profileInfoReducer.profileInfo.planId._id
      : "" || "Trial Plan";
    const isInTrialPeriod = profileInfoReducer.profileInfo.isInTrialPeriod;
    const isPlanExpiered = moment(planExiprationDate).isSameOrBefore(
      new Date(),
      "day"
    );
    const isuserLogin = localStorage.getItem("token") ? true : false;

    return (
      <>
        <HomeHeader
          profileInfoReducer={profileInfoReducer}
          onLogout={e => this.signOut(e)}
        />
        <div className={"price-page-container pt-4 pb-4"}>
          <Row className={"mb-4"}>
            <Col lg={"12"} md={"12"} className={"custom-form-modal"}>
              <h3 className={"pb-3 text-center pt-3"}>Subscription Plans</h3>

              <div
                className={
                  "d-flex subscription-plan align-items-center text-center"
                }
              >
                <div className={"d-flex flex-column w-100"}>
                  <h4>Get a monthly Subscription for uninterupted access.</h4>
                  <p className={"text-muted"}>
                    You can upgrade your Subscription at any time.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
          <CrmSubscriptionModel
            subscriptionReducer={this.props.subscriptionReducer}
            openSubUpgradeModel={openSubUpgradeModel}
            openSubscriptionUpdateModel={openSubscriptionUpdateModel}
            renewSuscription={true}
            isProfile={isuserLogin ? true : false}
            isPlanExpiered={isPlanExpiered}
            isInTrialPeriod={isInTrialPeriod}
            currentPlanId={planId}
            isuserLogin={isuserLogin}
            addSubscriptionRequest={addSubscriptionRequest}
            modelOperate={modelOperate}
            {...this.props}
          />
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = state => ({
  subscriptionReducer: state.subscriptionReducer,
  profileInfoReducer: state.profileInfoReducer,
  modelInfoReducer: state.modelInfoReducer
});

const mapDispatchToProps = dispatch => ({
  getSubscriptionPlanRequest: () => dispatch(getSubscriptionPlanRequest()),
  profileInfoAction: () => dispatch(profileInfoRequest()),
  modelOperate: data => dispatch(modelOpenRequest({ modelDetails: data })),
  addSubscriptionRequest: data => dispatch(addSubscriptionRequest(data)),
  logoutUser: () => dispatch(logOutRequest())
});

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Pricing);