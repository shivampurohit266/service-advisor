import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { verifyUserAccount } from "../../../actions";

class VerifyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    }
    const { match, verifyUserAccount } = this.props;
    const { params } = match;
    const { userId, activationCode } = params;
    if (!userId || !activationCode) {
      this.props.redirectTo("/404");
      return;
    }
    verifyUserAccount({
      userId,
      activeValue: activationCode
    });
  }
  render() {
    return <div className="app flex-row align-items-center auth-page" />;
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return {
    verifyUserAccount: data => {
      dispatch(verifyUserAccount(data));
    }
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VerifyAccount)
);
