import React, { Component } from "react";
import { connect } from "react-redux";
import { resendRequest, signUpRequest, getSiteSettingReq } from "../../../actions";
import RegisterPage from "../../../components/RegisterPage";
class Register extends Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    }else{
      this.props.getSiteSetting();
    }
  }
  render() {
    const { siteSettingDetailsReducer } = this.props;
    return (
      <RegisterPage
        onSignup={this.props.onSignup}
        redirectTo={this.props.redirectTo}
        onResendLink={this.props.onResendLink}
        settingData={siteSettingDetailsReducer}
      />
    );
  }
}
const mapStateToProps = state => ({
  siteSettingDetailsReducer: state.siteSettingDetailsReducer
});
const mapDispatchToProps = dispatch => {
  return {
    onSignup: data => {
      dispatch(signUpRequest(data));
    },
    onResendLink: data => {
      dispatch(resendRequest(data));
    },
    getSiteSetting: data => {
      dispatch(getSiteSettingReq(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
