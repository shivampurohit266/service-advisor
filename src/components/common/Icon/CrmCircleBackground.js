import React, { Component } from "react";
// import Select, { components } from "react-select";


export class CrmCircleBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  render() {
    const {width, height,backColor} = this.props;
    let styleDisplay = {
      display: "inline-block",
      borderRadius: "50%",
      overFlow: "hidden",
      width: width ? width: "15px",
      height: height ? height: "15px",
      backgroundColor: backColor,
      marginRight: "5px"
    }
    //const { defaultOptions } = this.props;   
    return (
      <>
        <span style={styleDisplay}></span>
      </>
    );
  }
}


export default CrmCircleBackground;