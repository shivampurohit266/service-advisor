import { connect } from "react-redux";
import React, { Component } from "react";

import { loginRequest, getSiteSettingReq } from "../../../actions";
import LoginPage from "../../../components/LoginPage";

class Login extends Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    } else {
      this.props.getSiteSetting();
    }
  }
  render() {
    const { onLogin, siteSettingDetailsReducer } = this.props;
    return <LoginPage onLogin={onLogin} settingData={siteSettingDetailsReducer} {...this.props} />;
  }
}
const mapStateToProps = state => ({
  siteSettingDetailsReducer: state.siteSettingDetailsReducer
});
const mapDispatchToProps = dispatch => {
  return {
    onLogin: data => {
      dispatch(loginRequest(data));
    },
    getSiteSetting: data => {
      dispatch(getSiteSettingReq(data));
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
