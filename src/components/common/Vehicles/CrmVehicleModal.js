import React, { Component } from "react";
import * as classnames from "classnames";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  FormFeedback,
  Label,
  Input
} from "reactstrap";
import Select from "react-select";
import Async from "react-select/lib/Async";
import {
  VehicleValidations,
  VehicleValidationMessage
} from "../../../validations";
import Validator from "js-object-validation";
import { ColorOptions, groupedOptions } from "../../../config/Color";
import { Transmission, Drivetrain } from "../../../config/Constants";
import MaskedInput from "react-maskedinput";
import { VehiclesData } from "../../../config/Constants";

class CustomOption extends Component {
  render() {
    const { data, innerProps } = this.props;
    let style = {
      backgroundColor: data.value
    };
    return (
      <div
        {...innerProps}
        className="cursor_pointer vehicles-select-color-block"
      >
        <span style={style} className="vehicles-select-color" />
        {data.label}
      </div>
    );
  }
}
const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center"
};

const formatGroupLabel = (data, innerRef, innerProps) => (
  <div {...innerProps} ref={innerRef} style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

export class CrmVehicleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      colorOptions: ColorOptions,
      selectedOption: null,
      year: "",
      make: "",
      makeInput: "",
      defaultOptionsMake: [],
      modal: "",
      modalInput: "",
      defaultOptionsModal: [],
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
      prodYearError: "",
      prodMonthError: "",
      isLoading: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.vehicleModalOpen !== this.props.vehicleModalOpen) {
      this.removeAllState();
      this.onBlurMake();
      this.onBlurModal();
    }
  }

  createVehicleFun = async () => {
    let yeardata = this.state.year === "" ? "" : this.state.year;
    const make = this.state.make;
    const modal = this.state.modal;
    let data = {
      year: yeardata,
      make: make.value,
      modal: modal.value,
      type: this.state.typeSelected ? this.state.typeSelected : { value: "sedan", label: "Sedan", color: "#FF8B00", icons: "sedan.svg" },
      color: this.state.colorSelected,
      miles: this.state.miles,
      licensePlate: this.state.licensePlate,
      unit: this.state.unit,
      vin: this.state.vin,
      subModal: this.state.subModal,
      engineSize: this.state.engineSize,
      productionDate: this.state.productionDate,
      transmission: this.state.transmissionSelected,
      drivetrain: this.state.drivetrainSelected,
      notes: this.state.notes
    };

    let validationData = {
      year: this.state.year && this.state.year.trim(),
      make: make && make.value.trim(),
      modal: modal && modal.value.trim(),
      licensePlate: this.state.licensePlate && this.state.licensePlate.trim(),
    };

    if (this.state.miles && this.state.miles.trim() !== "") {
      validationData.miles = this.state.miles.trim();
    }

    const { isValid, errors } = Validator(
      validationData,
      VehicleValidations,
      VehicleValidationMessage
    );
    try {
      const yearValidation = await this.yearValidation(this.state.year);

      if (!isValid || !yearValidation || this.state.prodMonthError || this.state.prodYearError) {
        this.setState(
          {
            errors: errors,
            isLoading: false
          },
          async () => {
            await this.yearValidation(this.state.year);
          }
        );
        return;
      }

      this.props.submitCreateVehicleFun(data);
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  _onInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    if ((name === "year" || name === "miles") && isNaN(value)) {
      return;
    }
    if (name === "productionDate") {
      const splitedDate = value.split("/")
      var d = new Date();
      var n = d.getFullYear();
      if (parseInt(splitedDate[0]) > 12 && splitedDate[0]) {
        this.setState({
          prodMonthError: "Enter valid month."
        })
      }
      else if (parseInt(splitedDate[1]) >= n && splitedDate[1]) {
        this.setState({
          prodYearError: "Production year should be less than current year",
          prodMonthError: null
        })
      }
      else {
        this.setState({
          prodYearError: null,
          prodMonthError: null
        })
      }
    }
    this.setState({
      [name]: value
    });
  };

  handleColor = selectedColor => {
    this.setState({ colorSelected: selectedColor });
  };

  handleType = selectedType => {
    this.setState({
      typeSelected: selectedType
    });
  };

  handleExpandForm = () => {
    this.setState({
      expandForm: !this.state.expandForm
    });
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };

  handleSelectedChange = selectedOption => {
    const { target } = selectedOption;
    const { name, value } = target;
    this.setState({
      [name]: value
    });
  };

  async removeAllState() {
    this.setState({
      expandForm: false,
      colorOptions: ColorOptions,
      selectedOption: null,
      year: "",
      make: "",
      makeInput: "",
      defaultOptionsMake: [],
      modal: "",
      modalInput: "",
      defaultOptionsModal: [],
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
      prodMonthError: "",
      prodYearError: "",
      errors: {}
    });
  }

  yearValidation = async year => {
    const text = /^[0-9]+$/;
    let errors = { ...this.state.errors };

    if (year) {
      if (year.length === 4) {
        if (year !== "" && !text.test(parseInt(year))) {
          errors["year"] = "Please Enter Numeric Values Only";
          this.setState({ errors });
          return false;
        }

        if (year.length !== 4) {
          errors["year"] = "Year is not proper. Please check";
          this.setState({ errors });
          return false;
        }

        const current_year = new Date().getFullYear();
        if (year < current_year - 101 || year > current_year) {
          errors["year"] = `Year should be in range ${current_year -
            101} to ${new Date().getFullYear()}`;
          this.setState({ errors });
          return false;
        }
        errors["year"] = "";
        this.setState({ errors });
        return true;
      } else {
        errors["year"] = "Year is not proper. Please check";
        this.setState({ errors });
        return false;
      }
    } else {
      errors["year"] = "Please enter year.";
      this.setState({ errors });
      return false;
    }
  };
  /**
   * 
   */
  handleMake = (selectedMake) => {
    if (selectedMake && selectedMake.label && selectedMake.value) {
      this.setState({
        make: {
          label: selectedMake && selectedMake.label ? selectedMake.label : "Honda",
          value: selectedMake && selectedMake.value ? selectedMake.value : ""
        },
        errors: {
          ...this.state.errors,
          make: null
        }
      })
    } else {
      this.setState({
        make: "",
        errors: {
          ...this.state.errors,
          make: null
        }
      })
      this.onBlurModal();
    }
    if (!selectedMake) {
      this.setState({
        makeInput: null
      })
    }
  }
  /**
   * 
   */
  handleModal = (selectedModal) => {
    if (selectedModal && selectedModal.label && selectedModal.value) {
      this.setState({
        modal: {
          label: selectedModal && selectedModal.label ? selectedModal.label : "Accord Or Q3 Or WRV...",
          value: selectedModal && selectedModal.value ? selectedModal.value : ""
        },
        errors: {
          ...this.state.errors,
          modal: null
        }
      })
    } else {
      this.setState({
        modal: "",
        errors: {
          ...this.state.errors,
          modal: null
        }
      })
      this.onBlurMake();
    }
    if (!selectedModal) {
      this.setState({
        modalInput: null
      })
    }
  }
  /**
   * 
   */
  onBlurMake = () => {
    let make = this.state.make;
    if (make.value && make.value !== "") {
      let vehicleModal = [];
      const regex = RegExp(`^${make.value}$`, 'i');
      let vehicle = VehiclesData.filter((item) => {
        return item.make.match(regex)
      });
      var myData = vehicle;
      vehicle = Array.from(new Set(myData.map(JSON.stringify))).map(JSON.parse);
      vehicle.sort((a, b) => (a['model'] || "").toString().localeCompare((b['model'] || "").toString()));
      vehicle.map((data) => {
        vehicleModal.push({
          label: data.model,
          value: data.model
        })
        return true
      })
      this.setState({
        defaultOptionsModal: vehicleModal
      })
    } else {
      let vehicleModal = [];
      let vehicle = VehiclesData.slice(0, 80);
      var myData1 = vehicle;
      vehicle = Array.from(new Set(myData1.map(JSON.stringify))).map(JSON.parse);
      vehicle.sort((a, b) => (a['model'] || "").toString().localeCompare((b['model'] || "").toString()));
      vehicle.map((data) => {
        vehicleModal.push({
          label: data.model,
          value: data.model
        })
        return true
      })
      this.setState({
        defaultOptionsModal: vehicleModal
      })
    }
    this.setState({
      makeInput: null
    })
  }
  /**
   * 
   */
  onBlurModal = () => {
    let modal = this.state.modal;
    if (modal.value && modal.value !== "") {
      let vehicleMake = [];
      const regex = RegExp(`^${modal.value}$`, 'i');
      let vehicle = VehiclesData.filter((item) => {
        return item.model.match(regex)
      });
      var myData = vehicle;
      vehicle = Array.from(new Set(myData.map(JSON.stringify))).map(JSON.parse);
      vehicle.sort((a, b) => (a['make'] || "").toString().localeCompare((b['make'] || "").toString()));
      vehicle.map((data) => {
        vehicleMake.push({
          label: data.make,
          value: data.make
        })
        return true
      })
      this.setState({
        defaultOptionsMake: vehicleMake
      })
    } else {
      let vehicleMake = [];
      let vehicle = VehiclesData.slice(0, 150);
      var myData1 = vehicle;
      function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
      }
      vehicle = Array.from(new Set(myData1.map(JSON.stringify))).map(JSON.parse);
      vehicle = getUniqueListBy(vehicle, 'make');
      vehicle.sort((a, b) => (a['make'] || "").toString().localeCompare((b['make'] || "").toString()));
      vehicle.map((data) => {
        vehicleMake.push({
          label: data.make,
          value: data.make
        })
        return true
      })
      this.setState({
        defaultOptionsMake: vehicleMake
      })
    }
    this.setState({
      modalInput: null
    })
  }
  /**
   * 
   */
  handleVehicleMake = (input, callback) => {
    const modal = this.state.modal;
    this.setState({
      makeInput: input.length > 1 ? input : null
    })
    this.props.getVehicleMakeModalReq({ input: input, callback: callback, isVehicleMake: true, modal: modal.value });
  }
  /**
   * 
   */
  handleVehicleModal = (input, callback) => {
    const make = this.state.make;
    this.setState({
      modalInput: input.length > 1 ? input : null
    })
    this.props.getVehicleModalReq({ input: input, callback: callback, make: make.value });
  }
  /**
   * 
   */
  render() {
    const {
      year,
      type,
      errors,
      miles,
      subModal,
      engineSize,
      productionDate,
      transmission,
      notes,
      prodMonthError,
      prodYearError,
      make,
      modal,
      defaultOptionsMake,
      defaultOptionsModal
    } = this.state;
    const { vehicleModalOpen, handleVehicleModal, isCustVehiclemodal } = this.props;
    const {
      expandForm,
      transmissionSelected,
      drivetrainSelected,
      typeSelected,
      colorSelected
    } = this.state;
    return (
      <>
        <Modal
          isOpen={vehicleModalOpen}
          toggle={handleVehicleModal}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={handleVehicleModal}>
            Create New Vehicle
            {isCustVehiclemodal ? (
              <div className={"step-align"}>Step 2/2</div>
            ) : null}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Year <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="20XX"
                      id="year"
                      name="year"
                      minLength="4"
                      maxLength="4"
                      /* onBlur={this.yearValidation}
                      onKeyPress={this.yearValidation} */
                      onChange={this._onInputChange}
                      value={year}
                      invalid={errors.year ? true : false}
                    />
                    <FormFeedback>
                      {(!(year.trim()) && errors.year) ||
                        errors.hasOwnProperty("year")
                        ? errors.year
                        : null}
                    </FormFeedback>
                    {/* <FormFeedback>
                      {errors.year ? errors.year : null}
                    </FormFeedback> */}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Make <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Async
                      placeholder="Honda"
                      value={make}
                      loadOptions={this.handleVehicleMake}
                      // defaultOptions={modal.value ? defaultOptionsMake : null}
                      defaultOptions={defaultOptionsMake}
                      onChange={(e) => this.handleMake(e)}
                      noOptionsMessage={() =>
                        this.state.makeInput
                          ? "No vehicle make found"
                          : "Type vehicle make name"
                      }
                      isClearable={make.value ? true : false}
                      onBlur={this.onBlurMake}
                      className={classnames("w-100 form-select", {
                        "is-invalid": errors.make
                      })}
                    />
                    <FormFeedback>
                      {errors.make ? errors.make : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Model <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Async
                      className={classnames("w-100 form-select", {
                        "is-invalid": errors.modal
                      })}
                      id="type"
                      value={modal}
                      placeholder="Accord Or Q3 Or WRV..."
                      loadOptions={this.handleVehicleModal}
                      // defaultOptions={make.value ? defaultOptionsModal : null}
                      defaultOptions={defaultOptionsModal}
                      onChange={(e) => this.handleModal(e)}
                      noOptionsMessage={() =>
                        this.state.modalInput
                          ? "No vehicle model found"
                          : "Type vehicle model name"
                      }
                      isClearable={modal.value ? true : false}
                      onBlur={this.onBlurModal}
                      invalid={errors.modal}
                    />

                    <FormFeedback>
                      {errors.modal
                        ? errors.modal
                        : null}
                    </FormFeedback>
                  </div>
                  {/* <div className="error-tool-tip">this field is </div> */}
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Type
                  </Label>
                  <div className={"input-block"}>
                    <Select
                      defaultValue={typeSelected}
                      options={groupedOptions}
                      formatGroupLabel={formatGroupLabel}
                      className="w-100 form-select"
                      classNamePrefix={"form-select-theme"}
                      onChange={this.handleType}
                    />
                    {!type && errors.type ? (
                      <p className="text-danger">{errors.type}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Miles
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="100,00"
                      name="miles"
                      value={miles}
                      onChange={this._onInputChange}
                      maxLength={15}
                      invalid={errors.miles}
                    />
                    <FormFeedback>
                      {errors.miles ? errors.miles : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Color
                  </Label>
                  <div className={"input-block"}>
                    <Select
                      value={colorSelected}
                      onChange={this.handleColor}
                      options={this.state.colorOptions}
                      className="w-100 form-select"
                      classNamePrefix={"form-select-theme"}
                      placeholder={"Pick a color"}
                      isClearable={true}
                      components={{ Option: CustomOption }}
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Licence Plate <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="AUM 100"
                      name="licensePlate"
                      onChange={this._onInputChange}
                      maxLength={18}
                      invalid={
                        errors.licensePlate && !(this.state.licensePlate.trim())
                      }
                    />
                    <FormFeedback>
                      {errors.licensePlate && !(this.state.licensePlate.trim())
                        ? errors.licensePlate
                        : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Unit #
                  </Label>
                  <Input
                    type="text"
                    placeholder="BA1234"
                    name="unit"
                    onChange={this._onInputChange}
                    maxLength={15}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row className="">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    VIN
                  </Label>
                  <Input
                    type="text"
                    placeholder="19UAYF3158T0000"
                    name="vin"
                    onChange={this._onInputChange}
                    maxLength={17}
                  />
                </FormGroup>
              </Col>
              {expandForm ? (
                <>
                  <Col md="6">
                    <FormGroup>
                      <Label
                        htmlFor="name"
                        className="customer-modal-text-style"
                      >
                        Sub Model
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          placeholder="Sub Model"
                          name="subModal"
                          onChange={this._onInputChange}
                        />
                        {!subModal && errors.subModal ? (
                          <p className="text-danger">{errors.subModal}</p>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </>
              ) : (
                  ""
                )}
            </Row>
            {/* <Row className="justify-content-center">
              <Col md="12 text-center">
                {!expandForm ? (
                  <span
                    onClick={this.handleExpandForm}
                    className="customer-anchor-text customer-click-btn"
                  >
                    Show More
                  </span>
                ) : (
                  ""
                )}
              </Col>
            </Row> */}
            {/* {expandForm ? (
              <> */}
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Engine Size
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      name="engineSize"
                      onChange={this._onInputChange}
                      placeholder="Engine Size"
                      id="rate"
                    />
                    {!engineSize && errors.engineSize ? (
                      <p className="text-danger">{errors.engineSize}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Production Date
                  </Label>
                  <div className={"input-block"}>
                    <MaskedInput
                      name="productionDate"
                      mask="11/1111"
                      placeholder="MM/YYYY"
                      onChange={this._onInputChange}
                      className={classnames("form-control", {
                        "is-invalid":
                          (prodMonthError || prodYearError) &&
                          productionDate
                      })}
                    />
                    <FormFeedback>
                      {prodYearError ? prodYearError : null}
                    </FormFeedback>
                    <FormFeedback>
                      {prodMonthError ? prodMonthError : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Transmission
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="select"
                      className=""
                      onChange={this.handleSelectedChange}
                      name="transmissionSelected"
                      id="matrixId"
                    >
                      <option value={""}>Select</option>
                      {Transmission.length
                        ? Transmission.map((item, index) => {
                          return (
                            <option
                              selected={item.key === transmissionSelected}
                              value={item.key}
                              key={index}
                            >
                              {item.text}
                            </option>
                          );
                        })
                        : null}
                    </Input>
                    {!transmission && errors.transmission ? (
                      <p className="text-danger">{errors.transmission}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Drivetrain
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="select"
                      className=""
                      onChange={this.handleSelectedChange}
                      name="drivetrainSelected"
                      id="matrixId"
                    >
                      <option value={""}>Select</option>
                      {Drivetrain.length
                        ? Drivetrain.map((item, index) => {
                          return (
                            <option
                              selected={item.key === drivetrainSelected}
                              value={item.key}
                              key={index}
                            >
                              {item.text}
                            </option>
                          );
                        })
                        : null}
                    </Input>
                    {!drivetrainSelected && errors.drivetrain ? (
                      <p className="text-danger">{errors.drivetrain}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="12">
                <FormGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Notes
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      name="notes"
                      type="textarea"
                      placeholder="Enter a note..."
                      id="notes"
                      maxLength={"1000"}
                      onChange={this._onInputChange}
                    />
                    {!notes && errors.notes ? (
                      <p className="text-danger">{errors.notes}</p>
                    ) : null}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md="12 text-center">
                {expandForm ? (
                  <span
                    onClick={this.handleExpandForm}
                    className="customer-anchor-text customer-click-btn"
                  >
                    Show Less
                  </span>
                ) : (
                    ""
                  )}
              </Col>
            </Row>
            {/* </>
            ) : (
              ""
            )} */}
          </ModalBody>
          <ModalFooter>
            <div className="required-fields">*Fields are Required.</div>
            <div
              className={isCustVehiclemodal ? "btn-reverse" : "btn-forward"}
            >
              <Button color="primary" onClick={this.createVehicleFun}>
                {isCustVehiclemodal
                  ? "Add Vehicle and Finish"
                  : "Add Vehicle"}
              </Button>{" "}
              <Button color="secondary" onClick={handleVehicleModal}>
                {isCustVehiclemodal ? "< Back To Previous" : "Cancel"}
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
