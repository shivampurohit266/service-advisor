import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { generatePassword, verifyGeneratePasswordLink } from "../../../actions";
import GeneratePasswordPage from "../../../components/GeneratePasswordPage";

class GeneratePassword extends Component {
  componentDidMount() {
    if (localStorage.getItem("token")) {
      this.props.redirectTo("/dashboard");
    }
    const { activationCode, userId } = this.props.match.params;
    if (!activationCode || !userId) {
      this.props.redirectTo("/404");
    }
    this.props.verifyCode({ activeValue: activationCode, userId });
  }
  generatePassword = password => {
    const { activationCode, userId } = this.props.match.params;
    this.props.generatePassword({
      password,
      userId,
      activeValue: activationCode,
    });
  };
  render() {
    return <GeneratePasswordPage onGenerate={this.generatePassword} />;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  verifyCode: data => {
    dispatch(verifyGeneratePasswordLink(data));
  },
  generatePassword: data => {
    dispatch(generatePassword(data));
  },
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GeneratePassword)
);
