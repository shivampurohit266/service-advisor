import React, { Component } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Form,
  FormFeedback,
  UncontrolledTooltip
} from "reactstrap";
import Dropzone from "react-dropzone";

import Cropper from "react-easy-crop";
import classnames from "classnames";
import { isValidURL } from "../../helpers/Object";
import getCroppedImg from "./cropImage";

const allVehicleServices = [
  {
    key: "Cars",
    icon: "./assets/img/carLogo.svg"
  },
  {
    key: "Semi & Heavy Duty",
    icon: "./assets/img/trukLogo.svg"
  },
  {
    key: "RV's",
    icon: "./assets/img/vanLogo.svg"
  },
  {
    key: "Trailers",
    icon: "./assets/img/trailerLogo.svg"
  },
  {
    key: "Motorcycles",
    icon: "./assets/img/motorcycleLogo.svg"
  },
  {
    key: "Boats",
    icon: "./assets/img/boatLogo.svg"
  },
  {
    key: "Bicycles",
    icon: "./assets/img/cycleLogo.svg"
  },
  {
    key: "Others",
    icon: "./assets/img/list-dots.svg"
  }
];
const allPeopleArray = ["1-2", "3-6", "7-10", "11+"];
const allServices = [
  {
    key: "Repair & Maintenance",
    icon: "./assets/img/repairing-car.svg"
  },
  {
    key: "Detail, Wrap & Film",
    icon: "./assets/img/carPaintingLogo.svg"
  },
  {
    key: "Restoration & Custom Builds",
    icon: "./assets/img/carChachisLogo.svg"
  },
  {
    key: "Others",
    icon: "./assets/img/list-dots.svg"
  }
];
export class CrmWelcomeModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      large: false,
      companyLogo: "",
      companyName: "",
      website: "",
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 4 / 3,
      cropSize: { width: 200, height: 150 },
      croppedAreaPixels: null,
      croppedImage: null,
      peopleWork: {
        selected: "",
        allPeopleArray
      },
      servicesOffer: {
        selectedServices: [],
        allServices
      },
      vehicleServicesOffer: {
        selectedVehicleServices: [],
        allVehicleServices
      },
      errors: {}
    };
    this.cropper = React.createRef();
  }

  componentDidMount = () => {
    const { companyName, website } = this.props;
    this.setState({
      companyName,
      website
    });
  };
  componentDidUpdate = ({ companyName, website }) => {
    if (
      companyName !== this.props.companyName ||
      website !== this.props.website
    ) {
      const { companyName, website } = this.props;
      this.setState({
        companyName,
        website
      });
    }
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({ croppedAreaPixels });
  };

  onZoomChange = zoom => {
    this.setState({ zoom });
  };

  toggleLarge = () => {
    this.setState({
      large: !this.state.large
    });
  };

  onSelectFile = e => {
    var reader = new FileReader();
    const scope = this;
    reader.addEventListener("load", () =>
      scope.setState({
        companyLogo: reader.result
      })
    );
    reader.onloadend = function(as) {
      var image = new Image();
      image.onload = function() {
        scope.setState({
          companyLogo: reader.result
        });
      };
    };
    reader.readAsDataURL(e[0]);
  };

  peopleWorkAction = event => {
    let peopleWork = this.state.peopleWork;
    peopleWork.selected = event;
    this.setState({
      peopleWork: peopleWork,
      errors: {
        ...this.state.errors,
        peopleWork: null
      }
    });
  };

  serviceOfferAction = event => {
    let servicesOffer = this.state.servicesOffer;
    if (servicesOffer.selectedServices.length) {
      let checkExistence = servicesOffer.selectedServices.some(
        item => item.key === event.key
      );
      if (!checkExistence) {
        servicesOffer.selectedServices.push(event);
      } else {
        let servicesArray = servicesOffer.selectedServices.findIndex(
          item => item.key === event.key
        );
        servicesOffer.selectedServices.splice(servicesArray, 1);
      }
    } else {
      servicesOffer.selectedServices.push(event);
    }

    this.setState({
      servicesOffer: servicesOffer,
      errors: {
        ...this.state.errors,
        servicesOffer: null
      }
    });
  };
  vehicleServicesAction = event => {
    let vehicleServicesOffer = this.state.vehicleServicesOffer;
    if (vehicleServicesOffer.selectedVehicleServices.length) {
      let checkVehicleExistence = vehicleServicesOffer.selectedVehicleServices.some(
        item => item.key === event.key
      );
      if (!checkVehicleExistence) {
        vehicleServicesOffer.selectedVehicleServices.push(event);
      } else {
        let vehicleExistance = vehicleServicesOffer.selectedVehicleServices.findIndex(
          item => item.key === event.key
        );
        vehicleServicesOffer.selectedVehicleServices.splice(
          vehicleExistance,
          1
        );
      }
    } else {
      vehicleServicesOffer.selectedVehicleServices.push(event);
    }

    this.setState({
      vehicleServicesOffer: vehicleServicesOffer,
      errors: {
        ...this.state.errors,
        vehicleServicesOffer: null
      }
    });
  };
  addCompanyDetails = e => {
    e.preventDefault();
    const {
      peopleWork,
      servicesOffer,
      vehicleServicesOffer,
      companyName,
      website
    } = this.state;
    const { selected } = peopleWork;
    const { selectedServices } = servicesOffer;
    const { selectedVehicleServices } = vehicleServicesOffer;
    try {
      let errors = {};
      let hasErrors = false;
      if (!companyName) {
        errors.companyName = "Please enter company name.";
        hasErrors = true;
      } else if (companyName.length > 100) {
        errors.companyName = "Company name should be less than 100 characters.";
        hasErrors = true;
      }
      if (website && !isValidURL(website)) {
        errors.website = "Please enter valid website URL.";
        hasErrors = true;
      }
      if (!selected) {
        errors.peopleWork = "Please select number of employees.";
        hasErrors = true;
      }
      if (!selectedServices.length) {
        errors.servicesOffer = "Please select at least one service.";
        hasErrors = true;
      }
      if (!selectedVehicleServices.length) {
        errors.vehicleServicesOffer = "Please select at least one vehicle.";
        hasErrors = true;
      }
      if (hasErrors) {
        this.setState({
          errors
        });
        return;
      }
      const servicesOfferTemp = [];
      for (let index = 0; index < selectedServices.length; index++) {
        const element = selectedServices[index];
        servicesOfferTemp.push(element.key);
      }
      const vehicleServicesOfferTemp = [];
      for (let index = 0; index < selectedVehicleServices.length; index++) {
        const element = selectedVehicleServices[index];
        vehicleServicesOfferTemp.push(element.key);
      }
      this.saveLogo(e);
      this.props.onCompanyDetailsUdpate({
        peopleWork: peopleWork.selected,
        servicesOffer: servicesOfferTemp,
        vehicleServicesOffer: vehicleServicesOfferTemp,
        companyName,
        website
      });
    } catch (error) {}
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: null
      }
    });
  };
  saveLogo = e => {
    e.preventDefault();
    const { companyLogo } = this.state;
    if (companyLogo) {
      this.props.onLogoUpdate({
        imageData: companyLogo
      });
    }
  };

  showCroppedImage = async () => {
    const croppedImage = await getCroppedImg(
      this.state.companyLogo,
      this.state.croppedAreaPixels
    );
    this.setState({ companyLogo: croppedImage, zoom: 1 });
  };

  render() {
    const { modalOpen, toggleLarge, userName } = this.props;
    const {
      companyLogo,
      peopleWork,
      servicesOffer,
      vehicleServicesOffer,
      errors,
      companyName,
      website
    } = this.state;

    return (
      <>
        <Modal
          isOpen={modalOpen}
          toggle={toggleLarge}
          className={
            "modal-lg customer-modal custom-form-modal custom-modal-lg complete-register-modal " +
            this.props.className
          }
        >
          <ModalHeader>
            Hi <span className={"text-capitalize"}>{userName}</span>, You're almost Done!
          </ModalHeader>
          <Form onSubmit={this.addCompanyDetails}>
            <ModalBody>
              <div className="pb-5">
                <h4 className="pb-2 section-head">
                  1. Tell us about your shop.
                </h4>
                <Row className="justify-content-center">
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="font-text">
                        Company Name <span className="asteric">*</span>
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          placeholder="Service Adviser"
                          onChange={this.handleInputChange}
                          value={companyName}
                          disabled={companyName}
                          name="companyName"
                          invalid={errors.companyName}
                        />
                        {!companyName && errors.companyName ? (
                          <FormFeedback>{errors.companyName}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>

                    <FormGroup>
                      <Label htmlFor="name" className="font-text">
                        Website (optional)
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          placeholder="http://google.com"
                          onChange={this.handleInputChange}
                          value={website}
                          name="website"
                          invalid={errors.website}
                        />
                        <FormFeedback>
                          {errors.website ? errors.website : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    {companyLogo === "" ? (
                      <Dropzone onDrop={this.onSelectFile}>
                        {({ getRootProps, getInputProps, isDragActive }) => {
                          return (
                            <div className="welcome-image-select-background">
                              <div className="text-center" {...getRootProps()}>
                                <input
                                  {...getInputProps()}
                                  accept="image/png, image/jpeg"
                                />
                                {
                                  <>
                                    <i className="far fa-file-image welcome-image-icon" />
                                    <div className="text-center welcome-image-text">
                                      Shop Logo
                                      <br />
                                      Drag image here or click to add
                                    </div>
                                  </>
                                }
                              </div>
                            </div>
                          );
                        }}
                      </Dropzone>
                    ) : null}
                    {companyLogo !== "" ? (
                      <div>
                        <div className="welcome-image-uploaded select-background welcome-image-parnet">
                          <div className="welcome-image-upload">
                            <Cropper
                              image={this.state.companyLogo}
                              crop={this.state.crop}
                              aspect={this.state.aspect}
                              onCropChange={this.onCropChange}
                              onCropComplete={this.onCropComplete}
                              onZoomChange={this.onZoomChange}
                              zoom={this.state.zoom}
                              restrictPosition={false}
                              cropSize={this.state.cropSize}
                              viewMode={2}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={this.showCroppedImage}
                          variant="contained"
                          color=""
                          className={"btn-theme-line mt-2"}
                        >
                          <i className="fa fa-crop" /> &nbsp;Crop Logo
                        </Button>
                        <div className="cropper-controls">
                          <Row className={"m-0"}>
                            <Col
                              md="12"
                              className="welcome-slider-left text-center"
                            >
                              {/* <Slider
                                className=""
                                value={this.state.zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e, zoom) => this.onZoomChange(zoom)}
                              /> */}

                              {/* <Button
                                color="primary"
                                className="btn-sm mr-1"
                                type={"button"}
                                onClick={this.saveLogo}
                              >
                                Save Logo
                              </Button> */}

                              <Button
                                color="danger"
                                className="btn-sm"
                                type={"button"}
                                id="Tooltip-1"
                                onClick={() => {
                                  this.setState({
                                    companyLogo: ""
                                  });
                                }}
                              >
                                <i className="cui-trash icons" />
                              </Button>
                              <UncontrolledTooltip target="Tooltip-1">
                                Remove
                              </UncontrolledTooltip>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    ) : null}

                    <div className="welcome-image-align">
                      <div className="welcome-image-text">
                        <span>
                          Your logo will appear on quotes, invoices, work orders
                          and work request forms.
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="pb-3">
                <h4 className="pb-2 section-head position-relative">
                  2. How many people work in your shop?{" "}
                  <span className="asteric">*</span>
                </h4>
                <div className="justify-content-center error-block-contain">
                  <div className="d-flex box-space">
                    {peopleWork.allPeopleArray.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            peopleWork.selected === item
                              ? "box-contain active"
                              : "box-contain"
                          }
                          onClick={() => this.peopleWorkAction(item)}
                        >
                          <div className="welcome-service-text">{item}</div>
                          <span className="check-icon">
                            <i className="fa fa-check-circle" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className={"text-danger error-msg"}>
                    {errors.peopleWork ? errors.peopleWork : null}
                  </p>
                </div>
              </div>
              <div className="pb-3">
                <h4 className="pb-2 section-head position-relative">
                  3. What kinds of services do you offer?{" "}
                  <span className="asteric">*</span>
                </h4>
                <div className="justify-content-center error-block-contain">
                  <div className="d-flex box-space">
                    {servicesOffer.allServices.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className={
                            servicesOffer.selectedServices.some(
                              itemSome => itemSome.key === item.key
                            )
                              ? "box-contain active"
                              : "box-contain"
                          }
                          onClick={() => this.serviceOfferAction(item)}
                        >
                          <div
                            className={classnames(
                              "justify-content-center",
                              index === 2 ? "custom-build" : null
                            )}
                          >
                            <img src={item.icon} alt="" />
                            <div className={"welcome-service-text"}>
                              {item.key}
                            </div>
                          </div>
                          <span className="check-icon">
                            <i className="fa fa-check-circle" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className={"text-danger error-msg"}>
                    {errors.servicesOffer ? errors.servicesOffer : null}
                  </p>
                </div>
              </div>
              <div className="pb-3">
                <h4 className="pb-2 section-head position-relative">
                  4. What types of vehicles do you service?{" "}
                  <span className="asteric">*</span>
                </h4>
                <div className="justify-content-center error-block-contain">
                  <div className="d-flex box-space">
                    {vehicleServicesOffer.allVehicleServices.map(
                      (item, index) => {
                        return (
                          <div
                            key={index}
                            className={
                              vehicleServicesOffer.selectedVehicleServices.some(
                                itemSome => itemSome.key === item.key
                              )
                                ? "box-contain active"
                                : "box-contain"
                            }
                            onClick={() => this.vehicleServicesAction(item)}
                          >
                            <div className="justify-content-center">
                              <img src={item.icon} alt="" />
                              <div className="welcome-service-text">
                                {item.key}
                              </div>
                            </div>
                            <span className="check-icon">
                              <i className="fa fa-check-circle" />
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <p className={"text-danger error-msg"}>
                    {errors.vehicleServicesOffer
                      ? errors.vehicleServicesOffer
                      : null}
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={this.addCompanyDetails}
                type="submit"
              >
                Continue
              </Button>{" "}
            </ModalFooter>
          </Form>
        </Modal>
      </>
    );
  }
}
