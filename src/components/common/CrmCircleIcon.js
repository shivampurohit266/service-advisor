import React, { Component } from "react";

class CrmCircleIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { circleIconPass, cssPass } = this.props;

    return (
      <span style={cssPass ? cssPass : null} className="circle-icon-option">
        <i className={circleIconPass} />
      </span>
    );
  }
}

export default CrmCircleIcon;
