import React, { Component } from "react";
import { connect } from "react-redux";
import { forgetPasswordRequest } from "../../../actions";

import ForgotpasswordPage from "../../../components/ForgotpasswordPage";

class ForGotPassword extends Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    }
  }

  render() {
    return <ForgotpasswordPage onRequest={this.props.onRequest} />;
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return {
    onRequest: data => {
      dispatch(forgetPasswordRequest(data));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ForGotPassword);
