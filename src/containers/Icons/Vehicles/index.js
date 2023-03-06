import React, { Component } from "react";
import Bicycle from "./Bicycle";
import Sedan from "./Sedan";
import Truck from "./Truck";
import Trailer from "./Trailer";
import Convertible from "./Convertible";
import Coupe from "./Coupe";
import Hatchback from "./Hatchback";
import SUV from "./SUV";
import Van from "./Van";
import Wagon from "./Wagon";

class VehicleIcons extends Component {
  renderIcon = () => {
    const { type, color, size } = this.props;
    switch (type) {
      case "bicycle":
        return <Bicycle color={color || '#000'} size={size} />;
      case "sedan":
        return <Sedan color={color || '#000'} size={size}/>;
      case "truck":
        return <Truck color={color || '#000'} size={size}/>;
      case "trailer":
        return <Trailer color={color || '#000'} size={size}/>;
      case "convertible":
        return <Convertible color={color || '#000'} size={size}/>;
      case "coupe":
        return <Coupe color={color || '#000'} size={size}/>;
      case "hatchback":
        return <Hatchback color={color || '#000'} size={size}/>;
      case "suv":
        return <SUV color={color || '#000'} size={size}/>;
      case "van":
        return <Van color={color || '#000'} size={size}/>;
      case "wagon":
        return <Wagon color={color || '#000'} size={size}/>;
      default:
        return <>-</>;
    }
  };
  render() {
    return <div>{this.renderIcon()}</div>;
  }
}

export default VehicleIcons;
