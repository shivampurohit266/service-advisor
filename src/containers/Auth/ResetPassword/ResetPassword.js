import * as qs from "query-string";
import React, { Component } from "react";

import { connect } from "react-redux";
import { validateResetToken, resetPasswordRequest } from "../../../actions";
import ResetPasswordPage from "../../../components/ResetPasswordPage";
class ResetPassword extends Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    }
    const { token, user, verification } = qs.parse(this.props.location.search);
    if (!token || !user || !verification) {
      this.props.redirectTo("/404");
    }
    this.props.validateResetToken({ token, user, verification });
  }
  render() {
    const { token, user, verification } = qs.parse(this.props.location.search);
    return (
      <ResetPasswordPage
        requestChangePassword={this.props.requestChangePassword}
        token={token}
        user={user}
        verification={verification}
      />
    );
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return {
    validateResetToken: data => {
      dispatch(validateResetToken(data));
    },
    requestChangePassword: data => {
      dispatch(resetPasswordRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
