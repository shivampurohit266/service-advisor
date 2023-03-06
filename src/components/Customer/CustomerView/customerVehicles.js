import React, { Component } from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import VehicleIcons from "../../../containers/Icons/Vehicles"
import { CrmVehicleModal } from "../../common/Vehicles/CrmVehicleModal";
export class CustomerVehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleVehicleModal = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: !modelDetails.vehicleModel,
      vehicleEditModel: false
    };
    this.props.modelOperate(data);
  }
  submitCreateVehicle = data => {
    const payload = {
      ...data,
      isCustomerDetails: true,
      customerId: this.props.customerId,
      isSingleCustomer: true
    }
    this.props.vehicleAddAction(payload);
  };
  handleVehicleDetails = (vehicleId) => {
    const vehicleUrl = "/vehicles/details/:id"
    this.props.redirectTo(
      `${vehicleUrl.replace(
        ":id",
        vehicleId
      )}`
    );
  }

  render() {
    const { customerVehicles, modelInfoReducer, getVehicleMakeModalReq, getVehicleModalReq } = this.props
    const { modelDetails } = modelInfoReducer;
    return (
      <>
        <Row>
          {
            customerVehicles ? customerVehicles.map((vehicle, index) => {
              return (
                <Col key={index} md={"4"}>
                  <Card>
                    <CardBody className={"d-flex justify-content-center cursor_pointer vehicle-details"}>
                      <div>
                        <h5>{vehicle.year}{" "}{vehicle.make}{" "}{vehicle.modal}</h5>
                        <div className={"vehicle-type-img d-inline-block d-flex justify-content-center"}>
                          <VehicleIcons
                            type={vehicle.type.value}
                            color={vehicle.color.color}
                          />
                        </div>
                      </div>
                      <div className={"overlay"} onClick={() => { this.handleVehicleDetails(vehicle._id) }}>
                        <span>View Details <i className="fa fa-angle-right"></i></span>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )
            }) : null
          }
          <Col md={"4"}>
            <Card>
              <CardBody className={"d-flex justify-content-center add-vehicle cursor_pointer"}>
                <div onClick={this.handleVehicleModal}>
                  <div>
                    <h5><small><i className={"icon-plus icons"} /></small>{" "}Add new vehicle</h5>
                  </div>
                  <div className={"vehicle-type-img d-inline-block d-flex justify-content-center"}>
                    <VehicleIcons
                      type={"sedan"}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <CrmVehicleModal
          vehicleModalOpen={modelDetails.vehicleModel}
          handleVehicleModal={this.handleVehicleModal}
          submitCreateVehicleFun={this.submitCreateVehicle}
          getVehicleMakeModalReq={getVehicleMakeModalReq}
          getVehicleModalReq={getVehicleModalReq}
        />
      </>
    );
  }
}
