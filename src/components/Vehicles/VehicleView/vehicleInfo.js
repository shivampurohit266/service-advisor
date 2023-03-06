import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import MaskedInput from "react-maskedinput";
import { CrmEditVehicleModal } from "../../common/Vehicles/CrmEditVehicleModal"
export class VehicleInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedOption: null,
      year: "",
      make: "",
      modal: "",
      typeSelected: { value: "sedan", label: "Sedan", color: "#FF8B00", icons: "sedan.svg" },
      colorSelected: "",
      miles: "",
      licensePlate: "",
      unit: "",
      vin: "",
      subModal: "",
      engineSize: "",
      productionDate: "",
      transmissionSelected: "automatic",
      drivetrainSelected: "2x4",
      notes: "",
      errors: {},
      prodMonthError: "",
      prodYearError: "",
      isLoading: false,
      vehicleData:{}
    };
  }

  componentDidMount = () => {
    this.props.vehicleGetRequest({ vehicleId: this.props.match.params.id, isGetVehicle: true });
  }
  componentDidUpdate(prevProps) {
    const { vehicleData } = this.props;
    if ((prevProps.vehicleData !== vehicleData) && vehicleData) {
      this.setState({
        year: vehicleData.year,
        make: vehicleData.make,
        modal: vehicleData.modal,
        typeSelected: vehicleData.type ? vehicleData.type : { value: "sedan", label: "Sedan", color: "#FF8B00", icons: "sedan.svg" },
        colorSelected: vehicleData.color,
        miles: vehicleData.miles,
        licensePlate: vehicleData.licensePlate,
        unit: vehicleData.unit,
        vin: vehicleData.vin,
        subModal: vehicleData.subModal,
        engineSize: vehicleData.engineSize,
        productionDate: vehicleData.productionDate,
        transmissionSelected: vehicleData.transmission,
        drivetrainSelected: vehicleData.drivetrain,
        notes: vehicleData.notes
      });
    }
  }
  toggleUpdateVehicle = () => {
    this.setState({
      vehicleData: this.props.vehicleData,
   });
   const { modelDetails } = this.props.modelInfoReducer;
   let data = {
    vehicleModel: false,
    vehicleEditModel: !modelDetails.vehicleEditModel
   };
   this.props.modelOperate(data);
  }
  toggleEditVehicle = () => {
    this.setState({
      vehicleData: {},
   });
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      vehicleModel: false,
      vehicleEditModel: !modelDetails.vehicleEditModel
    };
    this.props.modelOperate(data);
  }
  submitUpdateVehicle = (dataValue) => {
    dataValue.vehicleId = this.props.match.params.id;
    dataValue.isGetVehicle = true
    this.props.vehicleEditRequest(dataValue);
  }
  render() {
    const {
      year,
      make,
      modal,
      typeSelected,
      colorSelected,
      miles,
      licensePlate,
      unit,
      vin,
      //subModal,
      engineSize,
      productionDate,
      notes,
      transmissionSelected,
      drivetrainSelected
    } = this.state;
    const { vehicleData, modelInfoReducer, getVehicleMakeModalReq, getVehicleModalReq } = this.props
    const { modelDetails } = modelInfoReducer
    return (
      <div className={"custom-form-modal p-4"}>
        <Row className="justify-content-center">
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Year <span className={"asteric"}>*</span>
              </Label>
              <div className={"input-block"}>
                <Input
                  type="text"
                  placeholder="20XX"
                  id="year"
                  name="year"
                  disabled
                  value={year}
                />
              </div>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Make <span className={"asteric"}>*</span>
              </Label>
              <div className={"input-block"}>
                <Input
                  type="text"
                  placeholder="Honda"
                  name="make"
                  value={make}
                  disabled
                  maxLength="25"
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Model <span className={"asteric"}>*</span>
              </Label>
              <div className={"input-block"}>
                <Input
                  type="text"
                  className="customer-modal-text-style"
                  id="type"
                  placeholder="Accord OR Q3 Or WR..."
                  name="modal"
                  value={modal}
                  disabled
                  maxLength="25"
                />
              </div>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Type
              </Label>
              <Input
                className="form-control"
                disabled
                value={typeSelected.label}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Miles
              </Label>
              <div className={"input-block"}>
                <Input
                  type="text"
                  disabled
                  placeholder="100,00"
                  name="miles"
                  value={miles}
                  maxLength={15}
                />
              </div>
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Color
              </Label>
              <Input
                value={colorSelected.label}
                disabled
                className={"form-control"}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Licence Plate
              </Label>
              <Input
                type="text"
                placeholder="AUM 100"
                name="licensePlate"
                disabled
                value={licensePlate}
                maxLength={18}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Unit #
              </Label>
              <Input
                type="text"
                placeholder="BA1234"
                name="unit"
                disabled
                value={unit}
                maxLength={15}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="">
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                VIN
              </Label>
              <Input
                type="text"
                placeholder="19UAYF3158T0000"
                name="vin"
                disabled
                value={vin}
                maxLength={17}
              />
            </FormGroup>
          </Col>
          <Col md="6">
            {/* <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Sub Model
              </Label>
              <div className={"input-block"}>
                <Input
                  type="text"
                  placeholder="Sub Model"
                  name="subModal"
                  disabled
                  value={subModal}
                />
              </div>
            </FormGroup> */}
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Production Date
              </Label>
              <div className={"input-block"}>
                <MaskedInput
                  name="productionDate"
                  mask="11/1111"
                  disabled
                  placeholder="MM/YYYY"
                  value={productionDate}
                  className={"form-control"}
                />
              </div>
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Engine Size
              </Label>
              <div className={"input-block"}>
                <Input
                  type="text"
                  disabled
                  name="engineSize"
                  placeholder="Engine Size"
                  id="rate"
                  value={engineSize}
                />
              </div>
            </FormGroup>
          </Col>
          <Col md="6">
          <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Drivetrain
              </Label>
              <Input
                type="text"
                disabled
                name="drivetrainSelected"
                value={drivetrainSelected}
                id="matrixId"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="6">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Transmission
              </Label>
              <Input
                type="text"
                disabled
                value={transmissionSelected}
                name="transmissionSelected"
                id="matrixId"
              />
            </FormGroup>
          </Col>
          <Col md="6">

          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="12">
            <FormGroup>
              <Label htmlFor="name" className="customer-modal-text-style">
                Notes
              </Label>
              <Input
                name="notes"
                type="textarea"
                disabled
                placeholder="Enter a note..."
                id="name"
                maxLength={"1000"}
                value={notes}
              />
            </FormGroup>
          </Col>
        </Row>
        <div className={"text-center"}>
          <Button
            onClick={this.toggleUpdateVehicle}
            color={""}
            className={"btn-theme"}
          >
            Edit Vehicle Details
          </Button>
        </div>
        {vehicleData ? (
          <CrmEditVehicleModal
            vehicleEditModalOpen={modelDetails.vehicleEditModel}
            handleEditVehicleModal={this.toggleEditVehicle}
            submitUpdateVehicleFun={this.submitUpdateVehicle}
            vehicleData={this.state.vehicleData}
            getVehicleMakeModalReq={getVehicleMakeModalReq}
            getVehicleModalReq={getVehicleModalReq}
          />
        ) : null}
      </div>
    );
  }
}
