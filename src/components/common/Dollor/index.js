import React, { Component } from "react";

class Dollor extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
        <span className="dollar-price">
        <i className="fa fa-dollar dollar-icon"></i>{this.props.value}
        </span>
    )
  }
}
export default Dollor