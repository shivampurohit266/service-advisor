import React, { Component } from "react";
import { connect } from 'react-redux';
import FaqPageComponent from "../../components/Faq";
import {
   getFaqPageReq,
   getSiteSettingReq,
   logOutRequest,
   profileInfoRequest,
   redirectTo
} from "../../actions";
class FaqPage extends Component {
   componentDidMount() {
      this.props.getFaqPage();
      this.props.getSiteSetting();
      if (localStorage.getItem("token")) {
         this.props.profileInfoAction();
      }
   }
   signOut() {
      this.props.logoutUser();
   }
   render() {
      const { faqPageReducer, siteSettingDetailsReducer, profileInfoReducer } = this.props;
      return (
         <>
            <FaqPageComponent
               faqData={faqPageReducer}
               settingData={siteSettingDetailsReducer}
               profileInfoReducer={profileInfoReducer}
               onLogout={e => this.signOut(e)}
            />
         </>
      )
   }
}
const mapStateToProps = state => ({
   faqPageReducer: state.faqPageReducer,
   siteSettingDetailsReducer: state.siteSettingDetailsReducer,
   profileInfoReducer: state.profileInfoReducer,
});

const mapDispatchToProps = dispatch => ({
   getFaqPage: data => {
      dispatch(getFaqPageReq(data));
   },
   getSiteSetting: data => {
      dispatch(getSiteSettingReq(data));
   },
   onGoPage: data => {
      dispatch(redirectTo({ path: data }));
   },
   profileInfoAction: () => dispatch(profileInfoRequest()),
   logoutUser: () => dispatch(logOutRequest()),
});
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(FaqPage);