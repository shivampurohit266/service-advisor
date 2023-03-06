import React, { Component } from "react";
import { AppSwitch } from "@coreui/react";
import Validator from "js-object-validation";
import DiscountBtn from '../CrmDiscountBtn';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormGroup,
  InputGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import {
  LabourText,
  LabourTextDefault
} from "../../../config/Constants";
import {
  CreateRateValidations,
  CreateRateValidMessaages,
  CreateLabourValidations,
  CreateLabourValidMessaages
} from "../../../validations";
import { CrmStandardModel } from "../../common/CrmStandardModel";
import Async from "react-select/lib/Async";
import LastUpdated from "../../common/LastUpdated";
import { toast } from "react-toastify";
import * as classnames from "classnames";

export class CrmLabourModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discription: "",
      note: "",
      rate: "",
      hours: 1,
      labourId: '',
      errors: {},
      isEditMode: 0,
      discountType: '',
      labourInput: "",
      permission: LabourTextDefault,
      discount: {
        value: "",
        type: "$"
      },
      updatedAt: "",
      selectedRateOptions: {
        label: "",
        value: ""
      },
      newServiceLabor: false,
      openStadardRateModel: false,
      serviceLaborError: "",
      laborId: ""
    };
  }
  stdModelFun = () => {
    this.props.rateAddModalFun();
  };
  handleChange = event => {
    const { name, value } = event.target;
    let disc = this.state.discount;
    if (name === 'discount') {
      if (isNaN(value)) {
        return
      } else if (disc.type === "%" && (parseFloat(value) >= 100)) {
        return
      } else {
        this.setState({
          discount: {
            ...this.state.discount,
            value: value,
          }
        });
      }
    } else if (name === 'hours') {
      this.setState({
        [name]: value !== "" ? value : 1
      })
    }
    else {
      this.setState({
        [name]: value
      })
    }
  };
  componentDidUpdate({ tyreModalOpen, dataLabour, rateStandardListData }) {
    if (tyreModalOpen !== this.props.tyreModalOpen && !this.props.dataLabour) {
      this.removeAllState();
    }
    if (this.props.rateStandardListData && this.props.rateStandardListData.selectedOptions ? this.props.rateStandardListData.selectedOptions !== rateStandardListData.selectedOptions : null) {
      const { selectedOptions } = this.props.rateStandardListData
      this.setState({
        selectedRateOptions: {
          value: selectedOptions && selectedOptions.value ? selectedOptions.value : '',
          label: selectedOptions && selectedOptions.label ? selectedOptions.label : ''
        }
      })
    }
    if (
      this.props.dataLabour &&
      this.props.dataLabour._id &&
      (dataLabour._id !== this.props.dataLabour._id)
    ) {
      this.setState({
        discription: this.props.dataLabour.discription,
        note: this.props.dataLabour.notes,
        rate: this.props.dataLabour.rate,
        hours: this.props.dataLabour.hours ? this.props.dataLabour.hours : 1,
        isEditMode: 1,
        errors: {},
        updatedAt: this.props.dataLabour.updatedAt,
        labourId: this.props.dataLabour._id,
        permission: this.props.dataLabour.permission,
        selectedLabourRate: this.props.setDefaultRate({ value: this.props.dataLabour.rate && this.props.dataLabour.rate._id ? this.props.dataLabour.rate._id : '', label: this.props.dataLabour.rate && this.props.dataLabour.rate.name ? this.props.dataLabour.rate.name + ' - $' + this.props.dataLabour.rate.hourlyRate : 'Type to select' }),
        discount: this.props.dataLabour.discount,
        openStadardRateModel: false
      })
    }
  }
  async removeAllState() {
    this.setState({
      discription: "",
      note: "",
      rate: "",
      hours: 1,
      labourId: '',
      errors: {},
      isEditMode: 0,
      discountType: '',
      labourInput: "",
      permission: LabourTextDefault,
      discount: {
        value: "",
        type: "$"
      },
      updatedAt: "",
      selectedRateOptions: {
        label: "",
        value: ""
      },
      newServiceLabor: false,
      openStadardRateModel: false,
      serviceLaborError: "",
      laborId: ""
    })
  }
  handleRateAdd = async data => {
    const profileData = this.props.profileInfoReducer;
    const { isValid, errors } = Validator(
      data,
      CreateRateValidations,
      CreateRateValidMessaages
    );
    if (!isValid) {
      this.setState({
        errors: errors,
        isLoading: false
      });
      return;
    } else {
      const ratedata = {
        data: data,
        userId: profileData._id,
        parentId: profileData.parentId
      };
      this.props.addRate(ratedata);
    }
  };
  handleClick(singleState, e) {
    const { permission } = this.state;
    permission[singleState] = e.target.checked;
    this.setState({
      ...permission
    });
  }

  handleClickDiscountType = value => {
    if (value === "%" && this.state.discount.value !== '') {
      if (parseInt(this.state.discount.value) < 100) {
        this.setState({
          discount: {
            ...this.state.discount,
            type: value
          }
        })
      } else {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Enter percentage less than 100");
        }
      }
    } else if (value === "$" && this.state.discount !== '') {
      this.setState({
        discount: {
          ...this.state.discount,
          type: value
        }
      });
    } else {
      this.setState({
        discount: {
          ...this.state.discount,
          type: value
        }
      });
    }
  }
  handleStandardRate = e => {
    if (e) {
      if (e.value === "") {
        this.props.rateAddModalFun();
      }
      this.setState({
        selectedRateOptions: {
          value: e.value,
          label: e.label
        }
      })
    } else {
      this.setState({
        selectedRateOptions: {
          value: "",
          label: ""
        }
      })
    }
  };

  handleLabourAdd = () => {
    if (this.props.serviceLaborModal && !this.state.newServiceLabor) {
      this.handleServiceItem()
      return
    } else {
      const { selectedRateOptions } = this.state;
      let data = {
        discription: this.state.discription.trim(),
        notes: this.state.note,
        hours: this.state.hours,
        permission: this.state.permission,
        rate: (selectedRateOptions &&
          selectedRateOptions.value) ? selectedRateOptions.value : null,
        discount: this.state.discount,
        serviceLaborModal: this.props.serviceLaborModal ? this.props.serviceLaborModal : false,
        serviceIndex: this.props.serviceIndex !== null ? this.props.serviceIndex : null,
        services: this.props.services ? this.props.services : null
      }
      const { isValid, errors } = Validator(
        data,
        CreateLabourValidations,
        CreateLabourValidMessaages
      );
      if (!isValid) {
        this.setState({
          errors: errors,
        });
        return;
      }
      if (this.state.isEditMode) {
        data.labourId = this.state.labourId;
        this.props.updateLabour(data);
      } else {
        this.props.addLabour(data);
      }
    }
  }
  loadOptions = (input, callback) => {
    this.setState({ labourInput: input.length > 1 ? input : null });
    this.props.getStdList({ input, callback });
  };

  searchLabor = (input, callback) => {
    this.props.getLaborDetails({ input, callback });
  }
  handleServiceLaborAdd = (e) => {
    if (e && e.laborData) {
      this.setState({
        laborId: e,
      })
    } else {
      this.setState({
        laborId: ""
      })
    }
  }
  handleServiceItem = async () => {
    const { laborId } = this.state
    const { serviceIndex, services } = this.props
    if (laborId) {
      let servicePartData = services[serviceIndex].serviceItems
      servicePartData.push(laborId.laborData)
      await this.props.addLaborToService({
        services,
        serviceIndex: serviceIndex
      })
      this.props.handleLabourModal()
    } else {
      this.setState({
        serviceLaborError: "Labor selectuion is required."
      })
    }
  }
  render() {
    const { tyreModalOpen, handleLabourModal, rateAddModalProp, serviceLaborModal } = this.props;
    const { errors, selectedRateOptions } = this.state;
    const {
      discription,
      note,
      hours,
      discount,
      isEditMode,
      permission,
      updatedAt,
      newServiceLabor,
      serviceLaborError,
      laborId
    } = this.state;
    return (
      <>
        <Modal
          isOpen={tyreModalOpen}
          toggle={handleLabourModal}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader toggle={handleLabourModal}>
            {isEditMode ? `Update Labor Details` : 'Create New Labor'}
            {isEditMode ? <>
              {updatedAt ?
                <LastUpdated updatedAt={updatedAt} />
                : null}
            </> : null}
          </ModalHeader>
          <ModalBody>
            {
              serviceLaborModal && !newServiceLabor ?
                <div className={"text-center"}>
                  <Col md={"12"}>
                    <FormGroup className={"fleet-block"}>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Search Labor <span className={"asteric"}>*</span>
                      </Label>
                      <div className={"input-block"}>
                        <Async
                          placeholder={"Type to select labor from the list"}
                          loadOptions={this.searchLabor}
                          className={classnames("w-100 form-select", {
                            "is-invalid":
                              serviceLaborError
                          })}
                          value={laborId}
                          onChange={e => {
                            this.handleServiceLaborAdd(e)
                            this.setState({
                              newServiceLabor: e && e.label === '+ Add New Labor' ? true : false
                            });
                          }}
                          isClearable={true}
                          noOptionsMessage={() => "Type Labor name"
                          }
                        />
                        {serviceLaborError ? (
                          <FormFeedback className="text-left">{serviceLaborError}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                </div> :
                <div className="">
                  <Row >
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                          Labor Description <span className={"asteric"}>*</span>
                        </Label>
                        <div className="input-block">
                          <Input className={"form-control"} type={"text"} id="discription" name=
                            "discription" maxLength="100" onChange={this.handleChange} value={discription} invalid={errors.discription && !(discription.trim())} placeholder={"Labor Description"} />
                          <FormFeedback>
                            {errors && !(discription.trim()) && errors.discription
                              ? errors.discription
                              : null}
                          </FormFeedback>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                          Rate
                        </Label>

                        <div md="12" className={"fleet-block rate-labour"}
                        >
                          <Async
                            placeholder={"Type to select"}
                            loadOptions={this.loadOptions}
                            onChange={e => {
                              this.handleStandardRate(e)
                            }}
                            isClearable={true}
                            value={selectedRateOptions && selectedRateOptions.value !== '' ? selectedRateOptions : ""}
                            noOptionsMessage={() => "Please type rate name to search"}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                          Hours
                        </Label>
                        <div className="input-block">
                          <Input className={"form-control"} name="hours" id="hours" type={"text"} onChange={this.handleChange} placeholder={"Hours"} maxLength="5" value={hours} invalid={errors.hours && !hours.isNumeric} />
                          <FormFeedback>
                            {errors.hours
                              ? errors.hours
                              : null}
                          </FormFeedback>
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                          Discount
                        </Label>
                        <div className={"labor-discount"}>
                          <InputGroup>
                            {discount.type === '$' ?
                              <div className="input-group-prepend">
                                <Button color={"primary"} size={"sm"}>
                                  <i className={"fa fa-dollar"}></i>
                                </Button>
                              </div> : null}
                            <Input id="discount" name="discount" type={"text"} onChange={this.handleChange} maxLength="5" invalid={errors.discount && !discount.isNumeric} value={discount.value} placeholder={"Discount"} />
                            {discount.type === '%' ?
                              <div className="input-group-append">
                                <Button color={"primary"} size={"sm"}>
                                  <i className={"fa fa-percent"}></i>
                                </Button>
                              </div> : null}
                          </InputGroup>
                          <DiscountBtn discountType={discount.type} handleClickDiscountType={this.handleClickDiscountType} />
                        </div>
                        <FormFeedback>
                          {errors && !discount.isNumeric && errors.discount
                            ? errors.discount
                            : null}
                        </FormFeedback>

                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label htmlFor="name" className="customer-modal-text-style">
                          Note
                    </Label>
                        <Input className={"form-control"} id="note" name="note" type={"textarea"} onChange={this.handleChange} value={note} placeholder={"Note"} maxLength={"1000"} />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row className="custom-label-padding ">
                    {LabourText
                      ? LabourText.map((text, index) => {
                        return (
                          <Col
                            md="6"
                            key={index}
                          >
                            <div className="d-flex" >
                              <AppSwitch
                                className={"mx-1"}
                                checked={
                                  permission ? permission[text.key] : null
                                }
                                onClick={this.handleClick.bind(
                                  this,
                                  text.key
                                )}
                                variant={"3d"}
                                color={"primary"}
                                size={"sm"}
                              />
                              <p className="customer-modal-text-style">
                                {text.text}
                              </p>
                            </div>
                          </Col>

                        );
                      })
                      : null}
                  </Row>
                  <CrmStandardModel
                    openStadardRateModel={rateAddModalProp}
                    stdModelFun={this.stdModelFun}
                    errors={errors}
                    handleRateAdd={this.handleRateAdd}
                  />
                </div>}
          </ModalBody>
          <ModalFooter>

            <div className="required-fields">*Fields are Required.</div>

            <Button color="primary" onClick={() => this.handleLabourAdd()}>{isEditMode ? `Update Labor Detail` : 'Add Labor'}

            </Button>{" "}
            <Button color="secondary" onClick={handleLabourModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}


