import React, { Component } from "react";

class Avtar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    const avtarValue = this.props.value
    const classNames = this.props.class
    return <span className={classNames !== '' ? `text-capitalize ${classNames}` : ""}>{avtarValue.slice(0, 1)}</span>;
  }
}
export default Avtar