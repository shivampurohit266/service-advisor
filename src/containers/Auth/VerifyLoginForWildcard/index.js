import React, { Component } from "react";
import { logger } from "../../../helpers/Logger";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { verifyWorkspaceLogin } from "../../../actions";
import * as qs from "query-string";
class VerifyLoginForWildcard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    logger(this.props.location);
    const { user, key, verification } = qs.parse(this.props.location.search);
    this.props.verifyUserLogin({ user, key, verification });
  }
  render() {
    return <div>Redirecting...</div>;
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return {
    verifyUserLogin: data => {
      dispatch(verifyWorkspaceLogin(data));
    }
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(VerifyLoginForWildcard)
);
