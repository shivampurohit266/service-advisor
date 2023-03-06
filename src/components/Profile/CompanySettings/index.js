import React, { Component } from "react";
import {
  Row,
  Col,
  Input,
  FormGroup,
  FormFeedback,
  Button,
  Label,
  UncontrolledTooltip
} from "reactstrap";
import { logger } from "../../../helpers/Logger";
import Validator from "js-object-validation";
import {
  ProfileValidations,
  ProfileValidationsMessaages
} from "../../../validations/profile.js";
import {
  allServices,
  allVehicleServices,
  allPeopleArray
} from "../../../config/Constants";
import classnames from "classnames";
import { isValidURL } from "../../../helpers/Object";
import Dropzone from "react-dropzone";

import Cropper from "react-easy-crop";
import getCroppedImg from "../../common/cropImage";
import { ConfirmBox } from "../../../helpers/SweetAlert";

class CompanySettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 4 / 3,
      maxZoom: 2,
      cropSize: { width: 200, height: 150 },
      croppedAreaPixels: null,
      croppedImage: null,
      errors: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      companyName: "",
      companyNumber: "",
      shopLogo: "",
      vatNumber: "",
      website: "",
      currency: "",
      timeZone: "",
      peopleWork: {
        selected: "",
        allPeopleArray
      },
      servicesOffer: {
        selectedServices: [],
        allServices
      },
      vehicleService: {
        selectedVehicleServices: [],
        allVehicleServices
      },
      validErrors: {},
      permissions: "",
      logoDetails: "",
      initialCroppedAreaPixels: {
        width: 200,
        height: 200
      }
    };
  }

  componentDidMount = () => {

    if (this.props.profileData.profileInfo) {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        currency,
        shopLogo,
        companyName,
        companyNumber,
        vatNumber,
        website,
        peopleWork
      } = this.props.profileData.profileInfo;
      this.setState({
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        shopLogo,
        companyName,
        companyNumber,
        vatNumber,
        website,
        currency,
        peopleWork: {
          ...this.state.peopleWork,
          selected: peopleWork
        },
        servicesOffer: {
          ...this.state.servicesOffer,
          selectedServices: this.props.profileData.profileInfo
            ? this.props.profileData.profileInfo.serviceOffer
            : []
        },
        vehicleService: {
          ...this.state.vehicleService,
          selectedVehicleServices: this.props.profileData.profileInfo
            ? this.props.profileData.profileInfo.vehicleService
            : []
        }
      });
    }
  };
  componentDidUpdate = ({ profileData }) => {
    if (profileData.profileInfo !== this.props.profileData.profileInfo) {
      const {
        firstName,
        lastName,
        phoneNumber,
        address,
        currency,
        shopLogo,
        companyName,
        companyNumber,
        vatNumber,
        website,
        timeZone,
        peopleWork
      } = this.props.profileData.profileInfo;

      this.setState({
        firstName,
        lastName,
        phoneNumber,
        address,
        currency,
        shopLogo,
        companyName,
        companyNumber,
        vatNumber,
        website,
        timeZone,
        peoplework: {
          ...this.state.peopleWork,
          selected: peopleWork
        },
        servicesOffer: {
          ...this.state.servicesOffer,
          selectedServices: this.props.profileData.profileInfo
            ? this.props.profileData.profileInfo.serviceOffer
            : []
        },
        vehicleService: {
          ...this.state.vehicleService,
          selectedVehicleServices: this.props.profileData.profileInfo
            ? this.props.profileData.profileInfo.vehicleService
            : []
        }
      });
    }
  };

  handleInputChange = e => {
    const { target } = e;
    const { name, value } = target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: null
      }
    });
  };

  onSelectFile = async (file, e) => {
    if (file[0].size > 10000000) {
      await ConfirmBox({
        text: "",
        title: "Maximum allowed size for image is 10mb",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
      return;
    }
    var reader = new FileReader();
    const scope = this;
    reader.addEventListener("load", async (as) => {
      var image = new Image();
      var imageWidth = 0;
      var message = ''
      image.src = as.target.result;
      image.onload = async function () {
        imageWidth = this.width;
        if (imageWidth <= 300 || imageWidth >= 2000) {
          message = imageWidth <= 300 ? 'Allowed image width is minimum 300px.' : 'Allowed image width is maximum 2000px.'
          await ConfirmBox({
            text: "",
            title: message,
            showCancelButton: false,
            confirmButtonText: "Ok"
          });

          return;
        } else {
          scope.setState({
            shopLogo: reader.result,
            logoDetails: file,
            maxZoom: 2
          });
        }

      };

    });

    // reader.onloadend = function(as) {
    //   var image = new Image();
    //   image.src = as.target.result;
    //   image.onload = async function() {
    //     scope.setState({
    //       shopLogo: reader.result
    //     });
    //   };
    // };
    reader.readAsDataURL(file[0]);
  };

  serviceOfferAction = event => {
    let servicesOffer = this.state.servicesOffer;
    if (servicesOffer.selectedServices.length) {
      let checkExistence = servicesOffer.selectedServices.some(
        item => item === event.key
      );
      if (!checkExistence) {
        servicesOffer.selectedServices.push(event.key);
      } else {
        let servicesArray = servicesOffer.selectedServices.findIndex(
          item => item === event.key
        );
        servicesOffer.selectedServices.splice(servicesArray, 1);
      }
    } else {
      servicesOffer.selectedServices.push(event.key);
    }

    this.setState({
      servicesOffer: servicesOffer,
      validErrors: {
        ...this.state.validErrors,
        servicesOffer: null
      }
    });
  };

  vehicleServicesAction = event => {
    let vehicleService = this.state.vehicleService;
    if (vehicleService.selectedVehicleServices.length) {
      let checkVehicleExistence = vehicleService.selectedVehicleServices.some(
        item => item === event.key
      );

      if (!checkVehicleExistence) {
        vehicleService.selectedVehicleServices.push(event.key);
      } else {
        let vehicleExistance = vehicleService.selectedVehicleServices.findIndex(
          item => item === event.key
        );
        vehicleService.selectedVehicleServices.splice(vehicleExistance, 1);
      }
    } else {
      vehicleService.selectedVehicleServices.push(event.key);
    }

    this.setState({
      vehicleService: vehicleService,
      validErrors: {
        ...this.state.validErrors,
        vehicleService: null
      }
    });
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

  saveLogo = e => {
    e.preventDefault();
    const { shopLogo } = this.state;

    this.props.onLogoUpdate({
      imageData: shopLogo
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    try {
      let validErrors = {};
      let hasErrors = false;
      const {
        companyName,
        vatNumber,
        companyNumber,
        shopLogo,
        website,
        vehicleService: { selectedVehicleServices },
        servicesOffer: { selectedServices },
        peopleWork
      } = this.state;
      const { selected } = peopleWork;
      if (!selected) {
        validErrors.peopleWork = "Please select number of employees.";
        hasErrors = true;
      }

      if (!selectedServices.length) {
        validErrors.servicesOffer = "Please select at least one service.";
        hasErrors = true;
      }

      if (!selectedVehicleServices.length) {
        validErrors.vehicleService = "Please select at least one vehicle.";
        hasErrors = true;
      }

      if (website && !isValidURL(website)) {
        this.setState({
          urlError: "Please enter Valid URL( http:// )"
        });
      } else {
        this.setState({
          urlError: ""
        });
      }
      const servicesOfferTemp = [];
      for (let index = 0; index < selectedServices.length; index++) {
        const element = selectedServices[index];
        servicesOfferTemp.push(element);
      }
      const vehicleServicesOfferTemp = [];
      for (let index = 0; index < selectedVehicleServices.length; index++) {
        const element = selectedVehicleServices[index];
        vehicleServicesOfferTemp.push(element);
      }

      const payload = {
        companyName: companyName.trim(),
        companyNumber,
        shopLogo,
        vatNumber,
        website,
        vehicleService: vehicleServicesOfferTemp,
        serviceOffer: servicesOfferTemp,
        peopleWork: selected,
        isCompanyProfile: true
      };
      const { isValid, errors } = Validator(
        payload,
        ProfileValidations,
        ProfileValidationsMessaages
      );

      if (!isValid || (!isValid && hasErrors) || hasErrors) {
        this.setState({
          validErrors,
          errors
        });
        return;
      } else {
        // this.showCroppedImage();
        this.saveLogo(e);
        this.props.updateProfileSetting(payload);
      }
    } catch (error) {
      logger(error);
    }
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      croppedAreaPixels,
    });
  };

  onZoomChange = zoom => {
    this.setState({ zoom });
  };

  showCroppedImage = async () => {
    const addUrl = "https://cors-anywhere.herokuapp.com/";
    const { shopLogo } = this.state;
    const urlCheck = shopLogo.substr(0, 4);
    const logoUrl = urlCheck === "http" ? addUrl + shopLogo : shopLogo;

    const croppedImage = await getCroppedImg(
      logoUrl,
      this.state.croppedAreaPixels
    );
    this.setState({
      shopLogo: croppedImage,
      zoom: 1,
      maxZoom: 1,
      crop: {
        x: 0,
        y: 0
      },
      logoDetails: ""
    });
  };
  onInteractionStart = e => {
    if (this.state.shopLogo !== "") {
      this.setState({
        maxZoom: 1
      });
    }
  };

  render() {
    const {
      errors,
      validErrors,
      urlError,
      website,
      companyName,
      companyNumber,
      shopLogo,
      vatNumber,
      peopleWork,
      servicesOffer,
      vehicleService,
      logoDetails,
      initialCroppedAreaPixels
    } = this.state;

    return (
      <div className={"company-profile"}>
        <h3 className={"pb-3"}>Company Profile</h3>
        <Row>
          <Col lg={"12"} md={"12"} className={"custom-form-modal"}>
            <Row>
              <Col lg={"8"} md={"8"}>
                <Row>
                  <Col lg={"6"} md={"6"}>
                    <FormGroup>
                      <Label
                        htmlFor={"old password"}
                        className="customer-modal-text-style"
                      >
                        Company Name <span className="asteric">*</span>
                      </Label>
                      <div className="input-block">
                        <Input
                          type="text"
                          placeholder="companyName"
                          autoComplete="companyName"
                          onChange={this.handleInputChange}
                          value={companyName}
                          name="companyName"
                          invalid={errors.companyName}
                        />
                        <FormFeedback>
                          {errors.companyName ? errors.companyName : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg={"6"} md={"6"}>
                    <FormGroup>
                      <Label
                        htmlFor={"old password"}
                        className="customer-modal-text-style"
                      >
                        Company Url
                      </Label>
                      <div className="input-block">
                        <Input
                          type="text"
                          placeholder="Website"
                          autoComplete="Website"
                          onChange={this.handleInputChange}
                          value={website}
                          name="website"
                          invalid={errors.website}
                        />
                        <FormFeedback>
                          {urlError && website ? urlError : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg={"6"} md={"6"}>
                    <FormGroup>
                      <Label
                        htmlFor={"old password"}
                        className="customer-modal-text-style"
                      >
                        Company Number
                      </Label>
                      <div className="input-block">
                        <Input
                          type="text"
                          placeholder="Company Number"
                          autoComplete="companyName"
                          onChange={this.handleInputChange}
                          value={companyNumber || ""}
                          name="companyNumber"
                          invalid={errors.companyNumber}
                        />
                        <FormFeedback>
                          {errors.companyNumber ? errors.companyNumber : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg={"6"} md={"6"}>
                    <FormGroup>
                      <Label
                        htmlFor={"old password"}
                        className="customer-modal-text-style"
                      >
                        Company VAT
                      </Label>
                      <div className="input-block">
                        <Input
                          type="text"
                          placeholder="VAT Number"
                          autoComplete="VAT Number"
                          onChange={this.handleInputChange}
                          value={vatNumber || ""}
                          name="vatNumber"
                          invalid={errors.vatNumber}
                        />
                        <FormFeedback>
                          {errors.vatNumber ? errors.vatNumber : null}
                        </FormFeedback>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col lg={"4"} md={"4"}>
                {shopLogo === "" ? (
                  <Dropzone onDrop={file => this.onSelectFile(file)}>
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
                {shopLogo !== "" ? (
                  <div>
                    <div className="welcome-image-uploaded select-background welcome-image-parnet">
                      <div className="welcome-image-upload">
                        <Cropper
                          image={this.state.shopLogo}
                          crop={this.state.crop}
                          aspect={this.state.aspect}
                          onCropChange={this.onCropChange}
                          onCropComplete={this.onCropComplete}
                          onZoomChange={this.onZoomChange}
                          zoom={this.state.zoom}
                          restrictPosition={false}
                          cropSize={this.state.cropSize}
                          viewMode={2}
                          maxZoom={this.state.maxZoom}
                          onInteractionEnd={this.onInteractionStart}
                          initialCroppedAreaPixels={initialCroppedAreaPixels}
                        />
                      </div>
                    </div>
                    {logoDetails ? (
                      <Button
                        onClick={this.showCroppedImage}
                        variant="contained"
                        color=""
                        className={"btn-theme-line mt-2"}
                      >
                        <i className="fa fa-crop" /> &nbsp;Crop Logo
                      </Button>
                    ) : null}

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
                                shopLogo: ""
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
              </Col>
            </Row>

            <Row>
              <Col lg={"12"} md={"12"}>
                <div className="pb-3">
                  <h4 className="pb-2 section-head position-relative">
                    2. How many people work in your shop?{" "}
                    <span className="asteric">*</span>
                  </h4>
                  <div className="justify-content-center error-block-contain">
                    <div className="d-flex box-space">
                      {peopleWork.allPeopleArray
                        ? peopleWork.allPeopleArray.map((item, index) => {
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
                              <div className="welcome-service-text">
                                {item}
                              </div>
                              <span className="check-icon">
                                <i className="fa fa-check-circle" />
                              </span>
                            </div>
                          );
                        })
                        : null}
                    </div>
                    <p className={"text-danger error-msg"}>
                      {validErrors.peopleWork ? validErrors.peopleWork : null}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={"12"} md={"12"}>
                <div className="pb-3">
                  <h4 className="pb-2 section-head position-relative">
                    3. What kinds of services do you offer?{" "}
                    <span className="asteric">*</span>
                  </h4>
                  <div className="justify-content-center error-block-contain">
                    <div className="d-flex box-space">
                      {servicesOffer.allServices.map((item, index) => {
                        let selectedValue = [];
                        selectedValue =
                          servicesOffer.selectedServices &&
                            servicesOffer.selectedServices.length
                            ? servicesOffer.selectedServices.filter(
                              value => item.key === value
                            )
                            : null;
                        return (
                          <div
                            key={index}
                            className={
                              selectedValue &&
                                selectedValue.length &&
                                selectedValue[0]
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
                      {validErrors.servicesOffer
                        ? validErrors.servicesOffer
                        : null}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={"12"} md={"12"}>
                <div className="pb-3">
                  <h4 className="pb-2 section-head position-relative">
                    4. What types of vehicles do you service?{" "}
                    <span className="asteric">*</span>
                  </h4>
                  <div className="justify-content-center error-block-contain">
                    <div className="d-flex box-space">
                      {vehicleService.allVehicleServices.map((item, index) => {
                        let selectedValue = [];
                        selectedValue =
                          vehicleService.selectedVehicleServices &&
                            vehicleService.selectedVehicleServices.length
                            ? vehicleService.selectedVehicleServices.filter(
                              value => item.key === value
                            )
                            : null;
                        return (
                          <div
                            key={index}
                            className={
                              selectedValue &&
                                selectedValue.length &&
                                selectedValue[0]
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
                      })}
                    </div>
                    <p className={"text-danger error-msg"}>
                      {validErrors.vehicleService
                        ? validErrors.vehicleService
                        : null}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className={"m-0"}>
          <Col xs="3" className={""}>
            <FormGroup>
              <Label
                htmlFor={"old password"}
                className="customer-modal-text-style"
              />
              <div className="input-block">
                <Button
                  color="primary"
                  className="px-4 btn-theme"
                  type="submit"
                  block
                  onClick={this.handleSubmit}
                >
                  Update
                </Button>
              </div>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompanySettings;
