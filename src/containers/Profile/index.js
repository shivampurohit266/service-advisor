import React, { Component, Suspense } from "react";
import { Card, CardBody } from "reactstrap";
import GenralSettings from "../../components/Profile/GeneralSettings";
import UpdatePassword from "../../components/Profile/UpdatePassword";
import CompanySettings from "../../components/Profile/CompanySettings";
import SubscriptionSettings from "../../components/Profile/SubscriptionSettings";
import { connect } from "react-redux";
import { AppRoutes } from "../../config/AppRoutes";
import qs from "query-string";
import "../../scss/profile.scss"
import {
  updatePasswordRequest,
  profileSettingUpdateRequest,
  updateCompanyLogo,
  addSubscriptionRequest,
  getSubscriptionPlanRequest,
  modelOpenRequest,
  logOutRequest
} from "../../actions";

const ProfileTab = React.lazy(() => import("../../components/Profile/ProfileTab"));
const ProfileTabs = [
  {
    name: "Company Profile",
    icon: "fa fa-institution"
  },
  {
    name: "Subscription",
    icon: "fa fa-dollar"
  },
  {
    name: "My Profile",
    icon: "fa fa-user"
  },
  {
    name: "Change Password",
    icon: "fa fa-lock"
  }
];

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  componentDidMount = () => {
    this.props.getSubscriptionPlanRequest();
      const query = qs.parse(this.props.location.search);
      this.setState({
        orderId: this.props.match.params.id,
        activeTab: query.tab
          ? ProfileTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
          : 0
      });
  };

  componentDidUpdate =({location})=>{
     if (this.props.location.search !== location.search) {
       const query = qs.parse(this.props.location.search);
       this.setState({
         activeTab: query.tab
           ? ProfileTabs.findIndex(
               d => d.name === decodeURIComponent(query.tab)
             )
           : 0
       });
        this.props.getSubscriptionPlanRequest();
     }
  }
  /**
   *
   */
  onTabChange = activeTab => {
    this.props.redirectTo(
      `${AppRoutes.PROFILE.url}?tab=${encodeURIComponent(ProfileTabs[activeTab].name)}`
    );
  };

  render() {
    const {activeTab} = this.state
    const {
      profileInfo,
      subscriptionReducer,
      modelInfoReducer,
      modelOperate,
      logoutUser,
      addSubscriptionRequest
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { openSubUpgradeModel, openSubscriptionUpdateModel } = modelDetails;
    const profileSetting =
      profileInfo.profileInfo.permissions.isAllowedCompanySettings;

    return (
      <Card className={"white-card"}>
        <CardBody className={"custom-card-body position-relative pl-0"}>
          <div className={"profile-setting-page"}>
            <div className={"profile-setting-nav"}>
              <h5 className={""}>Settings Panel</h5>
              <Suspense fallback={"Loading.."}>
                <ProfileTab
                  tabs={ProfileTabs}
                  activeTab={activeTab}
                  onTabChange={this.onTabChange}
                />
              </Suspense>
            </div>
            <div className={"flex-1 profile-setting-right"}>
              <Suspense fallback={"Loading..."}>
                {activeTab === 2 ? (
                  <>
                    <h3 className={"pb-3"}>Profile Settings</h3>
                    <GenralSettings
                      profileData={profileInfo}
                      updateProfileSetting={
                        this.props.profileSettingUpdateRequest
                      }
                      profileSetting={profileSetting}
                    />
                  </>
                ) : null}
                {activeTab === 3 ? (
                  <>
                    <h3 className={"pb-3"}>Change Password</h3>
                    <UpdatePassword
                      updatePassword={this.props.updatePasswordRequest}
                    />
                  </>
                ) : null}

                {profileSetting ? (
                  <>
                    {activeTab === 1 ? (
                      <SubscriptionSettings
                        profileData={profileInfo}
                        openSubscriptionModel={openSubscriptionUpdateModel}
                        modelOperate={modelOperate}
                        openSubUpgradeModel={openSubUpgradeModel}
                        getSubscriptionPlanRequest={getSubscriptionPlanRequest}
                        subscriptionReducer={subscriptionReducer}
                        addSubscriptionRequest={addSubscriptionRequest}
                        logOutRequest={logoutUser}
                      />
                    ) : null}
                    {activeTab === 0 ? (
                      <CompanySettings
                        profileData={profileInfo}
                        updateProfileSetting={
                          this.props.profileSettingUpdateRequest
                        }
                        onLogoUpdate={this.props.updateCompanyLogo}
                      />
                    ) : null}
                  </>
                ) : null}
              </Suspense>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  profileInfo: state.profileInfoReducer,
  subscriptionReducer: state.subscriptionReducer,
  modelInfoReducer: state.modelInfoReducer
});

const mapDispatchToProps = dispatch => ({
  updatePasswordRequest: data => {
    dispatch(updatePasswordRequest(data));
  },
  profileSettingUpdateRequest: data => {
    dispatch(profileSettingUpdateRequest(data));
  },
  updateCompanyLogo: data => dispatch(updateCompanyLogo(data)),
  modelOperate: data => dispatch(modelOpenRequest({ modelDetails: data })),
  getSubscriptionPlanRequest: () => dispatch(getSubscriptionPlanRequest()),
  addSubscriptionRequest: data => dispatch(addSubscriptionRequest(data)),
  logoutUser: () => dispatch(logOutRequest())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
