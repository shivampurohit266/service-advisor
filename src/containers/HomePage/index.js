import React, { Component } from "react";
import { connect } from 'react-redux';
import HomePageComponent from "../../components/HomePage";
import {
   getHomePageReq,
   profileInfoRequest,
   getSiteSettingReq,
   logOutRequest,
   redirectTo,
   modelOpenRequest,
   enquiryRequest
} from "../../actions";
class HomePage extends Component {
   componentDidMount() {
      this.props.getHomePage();
      this.props.getSiteSetting();
      if (localStorage.getItem("token")) {
         this.props.profileInfoAction();
      }
   }
   signOut() {
      this.props.logoutUser();
   }
   render() {
      const {
         homePageDetailsReducer,
         modelInfoReducer,
         siteSettingDetailsReducer,
         profileInfoReducer,
         modelOperate,
         enquiryRequest
      } = this.props;
      const { modelDetails } = modelInfoReducer;
      const { enquiryModalOpen } = modelDetails
      return (
         <>
            <HomePageComponent
               pageData={homePageDetailsReducer}
               modelOperate={modelOperate}
               settingData={siteSettingDetailsReducer}
               onGoPage={this.props.onGoPage}
               profileInfoReducer={profileInfoReducer}
               modelInfoReducer={modelInfoReducer}
               enquiryModalOpen={enquiryModalOpen}
               enquiryRequest={enquiryRequest}
               onLogout={e => this.signOut(e)} />
         </>
      )
   }
}
const mapStateToProps = state => ({
   homePageDetailsReducer: state.homePageDetailsReducer,
   siteSettingDetailsReducer: state.siteSettingDetailsReducer,
   profileInfoReducer: state.profileInfoReducer,
   modelInfoReducer: state.modelInfoReducer,
});

const mapDispatchToProps = dispatch => ({
   getHomePage: data => {
      dispatch(getHomePageReq(data));
   },
   getSiteSetting: data => {
      dispatch(getSiteSettingReq(data));
   },
   onGoPage: data => {
      dispatch(redirectTo({ path: data }));
   },
   profileInfoAction: () => dispatch(profileInfoRequest()),
   logoutUser: () => dispatch(logOutRequest()),
   modelOperate: (data) => dispatch(modelOpenRequest({ modelDetails: data })),
   enquiryRequest: (data) => dispatch(enquiryRequest(data))
});
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(HomePage);