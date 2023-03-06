import React, { Component } from "react";
import { Row, Button } from "reactstrap";
import { CrmSubPaymentModalModel } from "../../components/common/CrmSubPaymentModal";
import "../../scss/subscription.scss";
import * as classnames from "classnames";
import Dollor from "../common/Dollor";

// import { redirectTo } from "../../actions";
// import { ConfirmBox } from "../../helpers/SweetAlert";
export class CrmSubscriptionModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionData: [],
      planId: ""
    };
  }
  componentDidMount = () => {
    // this.props.getSubscriptionPlanRequest();
  };
  componentDidUpdate = ({ subscriptionReducer }) => {
    if (
      subscriptionReducer.subscriptionPlanData !==
      this.props.subscriptionReducer.subscriptionPlanData
    ) {
      this.setState({
        subscriptionData: this.props.subscriptionReducer
          .subscriptionPlanData
      });
    }
  };
  handleSubPaymentModal = async planId => {
    const {
      modelOperate,
      openSubPayementModel,
      openSubUpgradeModel,
      isProfile
    } = this.props;
    await this.setState({
      planId: planId
    });
    if (!isProfile) {
      modelOperate({
        openSubPayementModel: !openSubPayementModel
      });
    } else {
      modelOperate({
        openSubUpgradeModel: !openSubUpgradeModel
      });
    }
  };
  /**
   */
  handleRedirect2 = () => {
    console.log("handleRedirect2");
  }
  handleRedirect = async () => {
    //  await ConfirmBox({
    //    text: "",
    //    title: "To continue, log in to Service Advisor.",
    //    customClass: {
    //      icon: "pricing-alert-icon",
    //      popup: "pricing-alert-inner",
    //      container: "pricing-alert",
    //      header: "pricing-alert-head"
    //    },
    //    html:
    //      "<div><div class='pb-2'><button class='btn' onClick='handleRedirect2'>Login</button></div><div class='pb-3 pt-3'>OR</div><h2 class='swal2-title'>Don't have an account?</h2><div class='pb-2 pt-2'><button class='btn '>Sign Up</button></div></div>",
    //    showCancelButton: false,
    //    confirmButtonText: "Ok",
    //    showConfirmButton: false
    //  });
    this.props.redirectTo(`/login?isShowMsg=${true}`);
  };
  /**
   */
  handleLogout = () => {
    this.props.logOutRequest();
  };

  render() {
    const {
      openSubPayementModel,
      openSubUpgradeModel,
      addSubscriptionRequest,
      isProfile,
      currentPlanId,
      renewSuscription,
      isInTrialPeriod,
      isuserLogin
    } = this.props;
    const { subscriptionData, planId } = this.state;

    return (
      <>
        {/* <Modal
          isOpen={openSubscriptionModel}
          className="customer-modal custom-form-modal modal-lg"
          backdrop={"static"}
        > */}
        {/* <ModalHeader toggle={this.toggle}>
            Subscription Plans
            {isProfile ? (
              <Button
                className="close"
                color={""}
                onClick={this.props.handleSubscriptionModel}
              >
                <span aria-hidden="true">×</span>
              </Button>
            ) : null}
          </ModalHeader> */}
        {/* <ModalBody>
            <h5 className={"subscription-head-line"}>
              Get a monthly Subscription for uninterrupted access.
            </h5> */}
        <Row>
          <div
            className={classnames(
              "subscription-card-wrap d-flex justify-content-center",
              {
                " pricing-page ": renewSuscription,
                " pricing-page-main ": !isuserLogin
              }
            )}
          >
            <div
              className={classnames("subscription-card", {
                currentplan: isInTrialPeriod
              })}
            >
              <h4 className={"text-center"}>
                Trial Plan
                       <span className={"plan-status text-success"}>
                  {isInTrialPeriod ? "Activated Plan" : ""}
                </span>
              </h4>
              <div className={"subscription-card-inner"}>
                <h3 className={"text-center plan-price"}>
                  <Dollor value={0} />
                  <small>/mo</small>
                </h3>
                <div className={"text-center pt-4 pb-4 user-count"}>
                  1 User License
                       </div>
                {/* <div className={"notes"}>
                         Pay $10/user and add more users
                       </div> */}
              </div>
              <div className={"text-center"}>
                {isuserLogin ? (
                  <Button color={""} className={"text-center"} disabled>
                    {isInTrialPeriod ? "Active" : "Expired"}
                  </Button>
                ) : (
                    <Button
                      color={""}
                      className={"text-center"}
                      onClick={this.handleRedirect}
                    >
                      Select Plan
                         </Button>
                  )}
              </div>
            </div>
            {subscriptionData && subscriptionData.length
              ? subscriptionData.map((plan, index) => {
                return (
                  <div
                    className={classnames("subscription-card", {
                      currentplan: currentPlanId === plan._id
                    })}
                    key={index}
                  >
                    <h4 className={"text-center"}>
                      {plan.name}
                      <span className={"plan-status text-success"}>
                        {currentPlanId === plan._id
                          ? "Activated Plan"
                          : ""}
                      </span>
                    </h4>
                    <div className={"subscription-card-inner"}>
                      <h3 className={"text-center plan-price"}>
                        <Dollor value={plan.amount} />
                        <small>/mo</small>
                      </h3>
                      <div
                        className={"text-center pt-4 pb-4 user-count"}
                      >
                        {plan.facilities.noOfLiscence} User License
                               </div>
                      {/* <div className={"notes"}>
                                 Pay $10/user and add more users
                               </div> */}
                    </div>
                    <div className={"text-center"}>
                      {isuserLogin ? (
                        <Button
                          color={""}
                          onClick={() =>
                            this.handleSubPaymentModal(plan._id)
                          }
                          className={"text-center"}
                        >
                          {currentPlanId === plan._id
                            ? "Cancel Subscription"
                            : "Change Plan"}
                        </Button>
                      ) : (
                          <Button
                            color={""}
                            className={"text-center"}
                            onClick={this.handleRedirect}
                          >
                            Select Plan
                          </Button>
                        )}
                    </div>
                  </div>
                );
              })
              : null}
          </div>
        </Row>
        {/* {isPlanExpiered && isuserLogin ? (
                 <div className={"font-weight-bold text-center pt-3"}>
                   Click here to{" "}
                   <span
                     onClick={this.handleLogout}
                     className={
                       "pl-2 d-inline-flex align-items-center text-primary cursor_pointer"
                     }
                   >
                     <i className="icons icon-logout mr-2" /> Logout
                   </span>
                 </div>
               ) : null} */}
        {/* <br />
          </ModalBody> */}

        {/* </Modal> */}
        <CrmSubPaymentModalModel
          openSubPayementModel={
            !isProfile ? openSubPayementModel : openSubUpgradeModel
          }
          handleSubPaymentModal={this.handleSubPaymentModal}
          planId={planId}
          addSubscriptionRequest={addSubscriptionRequest}
        />
      </>
    );
  }
}
