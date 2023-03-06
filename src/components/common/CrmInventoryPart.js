import React, { Component } from "react";
import {
  Form,
  Row,
  FormGroup,
  Col,
  Label,
  Input,
  FormFeedback,
  InputGroup,
  ButtonGroup,
  Button
} from "reactstrap";
import CRMModal from "./Modal";
import { logger } from "../../helpers/Logger";
import {
  MarkupChangeValues,
  MarginChangeValues,
  CreatePartOptions,
  DefaultErrorMessage
} from "../../config/Constants";
import { AppSwitch } from "@coreui/react";
import Validator from "js-object-validation";
import { PartValidations, PartValidationMessages } from "../../validations";
import {
  CalculateMarkupPercent,
  CalculateMarginPercent,
  CalculateRetailPriceByMarkupPercent,
  CalculateRetailPriceByMarginPercent
} from "../../helpers/Sales";
import { Async } from "react-select";
import { toast } from "react-toastify";
import * as classnames from "classnames";

class CrmInventoryPart extends Component {
  constructor(props) {
    super(props);
    this.state = { errors: {}, partOptions: {} };
  }
  setInitialState = () => {
    this.setState({
      errors: {},
      partDescription: "",
      note: "",
      partNumber: "",
      vendorId: "",
      location: "",
      priceMatrix: "",
      cost: 0,
      price: "",
      markup: "",
      margin: "",
      criticalQuantity: "",
      quantity: "",
      partId: "",
      partData: [],
      servicePartError: "",
      newServicePart: false,
      partOptions: {
        isTaxed: true,
        showNumberOnQuoteAndInvoice: false,
        showPriceOnQuoteAndInvoice: true,
        showNoteOnQuoteAndInvoice: true
      },
      vendorInput: "",
      selectedPriceMatrix: { value: "", label: "Type to select" },
      selectedMatrix: []
    });
  };
  componentDidMount() {
    this.setInitialState();
  }
  componentDidUpdate({ isOpen: isOpenOld }) {
    const { isOpen, partDetails, isEditMode } = this.props;
    if (!isOpen && isOpenOld !== isOpen) {
      this.setInitialState();
    }
    if (
      isOpen &&
      isEditMode &&
      partDetails &&
      partDetails._id &&
      !this.state.partDescription
    ) {
      const {
        cost,
        criticalQuantity,
        description: partDescription,
        location,
        margin,
        markup,
        note,
        partNumber,
        quantity,
        quickBookItem,
        partOptions,
        vendorId
      } = partDetails;
      if (partDetails && partDetails.priceMatrix) {
        const { matrixList } = this.props;
        const pricingMatrixValue = partDetails.priceMatrix;
        const selectedMatrix = matrixList.filter(
          matrix => matrix._id === pricingMatrixValue
        );
        this.setState({
          selectedPriceMatrix: {
            value:
              selectedMatrix[0] && selectedMatrix[0]._id
                ? selectedMatrix[0]._id
                : "",
            label:
              selectedMatrix[0] && selectedMatrix[0].matrixName
                ? selectedMatrix[0].matrixName
                : "Type to select"
          }
        });
      } else {
        this.setState({
          selectedPriceMatrix: {
            value: "",
            label: "Type to select"
          }
        });
      }
      this.setState({
        cost,
        criticalQuantity,
        partDescription,
        location,
        margin,
        markup,
        note,
        partNumber,
        quantity,
        quickBookItem,
        price:
          partDetails && partDetails.retailPrice ? partDetails.retailPrice : "",
        partOptions: partOptions ? partOptions : {},
        vendorId: vendorId
          ? { label: vendorId.name, value: vendorId._id }
          : null
      });
    }
  }
  addPart = e => {
    if (this.props.serviceModal && !this.state.newServicePart) {
      this.handleServiceItem();
      return;
    } else {
      e.preventDefault();
      this.setState({
        errors: {}
      });
      try {
        const {
          partDescription,
          note,
          partNumber,
          vendorId,
          location,
          priceMatrix,
          cost,
          price,
          markup,
          margin,
          criticalQuantity,
          quantity,
          partOptions
        } = this.state;
        let data = {
          partDescription: partDescription.trim(),
          note,
          partNumber,
          vendorId,
          location,
          priceMatrix,
          cost,
          price,
          markup,
          margin,
          criticalQuantity,
          quantity,
          partOptions,
          serviceModal: this.props.serviceModal
            ? this.props.serviceModal
            : false,
          serviceIndex:
            this.props.serviceIndex !== null ? this.props.serviceIndex : null,
          services: this.props.services ? this.props.services : null
        };
        const { isValid, errors } = Validator(
          data,
          PartValidations,
          PartValidationMessages
        );
        if (!isValid) {
          this.setState({
            errors
          });
          return;
        }
        data.vendorId = vendorId ? vendorId.value : "";
        const {
          addInventoryPart,
          updateInventoryPart,
          partDetails
        } = this.props;
        if (partDetails && partDetails._id) {
          updateInventoryPart({ ...data, id: partDetails._id });
        } else {
          if (this.state.newServicePart) {
            addInventoryPart({ data: data });
          } else {
            addInventoryPart(data);
          }
        }
      } catch (error) {
        logger(error);
        toast.error(DefaultErrorMessage);
      }
    }
  };
  handleClick = e => {
    this.setState({
      partOptions: {
        ...this.state.partOptions,
        [e.target.name]: e.target.checked
      }
    });
  };
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: null
      }
    });
  };
  handleRetailsPriceChange = e => {
    const { value } = e.target;
    if (isNaN(value) || value < 0) {
      return;
    }
    this.setState(
      {
        price: value
      },
      () => {
        const { cost, price } = this.state;
        this.setState({
          markup:
            parseFloat(cost) && parseFloat(price)
              ? CalculateMarkupPercent(cost, price).toFixed(2)
              : "",
          margin:
            parseFloat(cost) && parseFloat(price)
              ? CalculateMarginPercent(cost, price).toFixed(2)
              : ""
        });
      }
    );
  };
  setPriceByMarkup = markupPercent => {
    const { cost } = this.state;
    this.setState(
      {
        price:
          cost && markupPercent
            ? CalculateRetailPriceByMarkupPercent(cost, markupPercent).toFixed(
              2
            )
            : this.state.price,
        markup: markupPercent
      },
      () => {
        this.setState({
          margin:
            parseFloat(cost) && parseFloat(this.state.price)
              ? CalculateMarginPercent(cost, this.state.price).toFixed(2)
              : ""
        });
      }
    );
  };
  setPriceByMargin = marginPercent => {
    const { cost } = this.state;
    this.setState(
      {
        price:
          cost && marginPercent
            ? CalculateRetailPriceByMarginPercent(cost, marginPercent).toFixed(
              2
            )
            : this.state.price,
        margin: marginPercent
      },
      () => {
        this.setState({
          markup:
            parseFloat(cost) && parseFloat(this.state.price)
              ? CalculateMarkupPercent(cost, this.state.price).toFixed(2)
              : ""
        });
      }
    );
  };
  loadOptions = (input, callback) => {
    this.setState({ vendorInput: input.length > 1 ? input : null });
    this.props.getInventoryPartsVendors({ input, callback });
  };
  editPart = e => {
    e.preventDefault();
  };

  handleCostPricechange = event => {
    const { value } = event.target;
    if (isNaN(value) || value < 0) {
      return;
    } else if (!this.state.margin || !this.state.markup) {
      this.setState({
        cost: value
      });
    } else if (this.state.selectedMatrix && this.state.selectedMatrix.length) {
      this.setState({
        cost: value
      });
      this.handleSelectedPriceMatrix(value, this.state.selectedMatrix);
      return true;
    } else {
      this.setState({
        cost: value
      });
      if (value && parseFloat(this.state.markup)) {
        this.setState({
          price: CalculateRetailPriceByMarkupPercent(
            value,
            parseFloat(this.state.markup)
          ).toFixed(2)
        });
      } else if (value && parseFloat(this.state.margin)) {
        this.setState({
          price: CalculateRetailPriceByMarkupPercent(
            value,
            parseFloat(this.state.margin)
          ).toFixed(2)
        });
      }
    }
  };

  handleSelectedPriceMatrix = (cost, selectedMatrix) => {
    this.setState({
      selectedMatrix: selectedMatrix,
      priceMatrix: selectedMatrix[0]._id
    });
    selectedMatrix[0].matrixRange.map((item, i) => {
      if (
        parseFloat(item.lower) <= parseFloat(cost) &&
        (parseFloat(cost) <= parseFloat(item.upper) || item.upper === "beyond")
      ) {
        if (cost && item.markup) {
          this.setState({
            price: CalculateRetailPriceByMarkupPercent(
              cost,
              parseInt(item.markup)
            ).toFixed(2)
          });
        } else if (cost && item.margin) {
          this.setState({
            price: CalculateRetailPriceByMarginPercent(
              cost,
              parseInt(item.margin)
            ).toFixed(2)
          });
        } else {
          this.setState({
            price: 0
          });
        }
        this.setState({
          margin: parseInt(item.margin),
          markup: parseInt(item.markup)
        });
      }
      return true;
    });
  };

  matrixLoadOptions = (input, callback) => {
    this.props.getPriceMatrix({ input, callback });
  };
  searchPart = (input, callback) => {
    this.props.getPartDetails({ input, callback });
  };
  handlePriceMatrix = e => {
    if (e && e.value) {
      this.setState({
        selectedPriceMatrix: {
          value: e.value,
          label: e.label
        }
      });
      const { matrixList } = this.props;
      const { cost } = this.state;
      const selectedMatrix = matrixList.filter(
        matrix => matrix._id === e.value
      );
      this.handleSelectedPriceMatrix(cost, selectedMatrix);
    } else {
      this.setState({
        selectedPriceMatrix: {
          value: "",
          label: "Type to select"
        }
      });
    }
  };
  handleServicePartAdd = e => {
    if (e && e.partData) {
      this.setState({
        partId: e
      });
    } else {
      this.setState({
        partId: ""
      });
    }
  };
  handleServiceItem = async () => {
    const { partId } = this.state;
    const { serviceIndex, services } = this.props;
    if (partId) {
      let servicePartData = services[serviceIndex].serviceItems;
      servicePartData.push(partId.partData);
      await this.props.addPartToService({
        services,
        serviceIndex: serviceIndex
      });
      this.props.toggle();
    } else {
      this.setState({
        servicePartError: "Part is required."
      });
    }
  };

  render() {
    const {
      errors,
      partDescription,
      note,
      partNumber,
      location,
      cost,
      price,
      markup,
      partOptions,
      margin,
      vendorId,
      criticalQuantity,
      quantity,
      vendorInput,
      selectedPriceMatrix,
      partId,
      newServicePart,
      servicePartError
    } = this.state;
    const {
      isOpen,
      toggle,
      isEditMode,
      partDetails,
      serviceModal
    } = this.props;
    const buttons = [
      {
        text: isEditMode ? "Update Part" : "Add Part",
        color: "primary",
        onClick: this.addPart,
        type: "submit"
      },
      {
        text: "Cancel",
        onClick: toggle,
        type: "button"
      }
    ];
    return (
      <Form onSubmit={this.addPart}>
        <CRMModal
          isOpen={isOpen}
          toggle={toggle}
          headerText={
            serviceModal
              ? "Add Part To Service"
              : isEditMode
                ? "Update Part Details"
                : "Add New Part To Inventory"
          }
          footerButtons={buttons}
          showfooterMsg
          updatedAt={isEditMode ? partDetails.updatedAt : null}
        >
          {serviceModal && !newServicePart ? (
            <div className={"text-center"}>
              <Col md={"12"}>
                <FormGroup className={"fleet-block"}>
                  <Label htmlFor="name" className="customer-modal-text-style">
                    Search Part <span className={"asteric"}>*</span>
                  </Label>
                  <div className={"input-block"}>
                    <Async
                      placeholder={"Type to select part from the list"}
                      loadOptions={this.searchPart}
                      className={classnames("w-100 form-select", {
                        "is-invalid": servicePartError
                      })}
                      value={partId}
                      onChange={e => {
                        this.handleServicePartAdd(e);
                        this.setState({
                          newServicePart:
                            e && e.label === "Add New Part" ? true : false
                        });
                      }}
                      isClearable={true}
                      noOptionsMessage={() => "Type Part name"}
                    />
                    <FormFeedback className="text-left">
                      {servicePartError ? servicePartError : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
            </div>
          ) : (
              <>
                <Row className="justify-content-center">
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Part Description <span className={"asteric"}>*</span>
                      </Label>
                      <InputGroup>
                        <div className={"input-block"}>
                          <Input
                            type="text"
                            name="partDescription"
                            onChange={this.handleChange}
                            placeholder="Part Description"
                            id="name"
                            value={partDescription}
                            invalid={errors.partDescription}
                          />
                          {errors.partDescription ? (
                            <FormFeedback>{errors.partDescription}</FormFeedback>
                          ) : null}
                        </div>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Note
                    </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          className="customer-modal-text-style"
                          placeholder="Note"
                          onChange={this.handleChange}
                          name="note"
                          value={note}
                          invalid={errors.note}
                        />
                        {errors.note ? (
                          <FormFeedback>{errors.note}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Part Number
                    </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          className="customer-modal-text-style"
                          placeholder="#10000"
                          onChange={this.handleChange}
                          maxLength="10"
                          name="partNumber"
                          value={partNumber}
                          invalid={errors.partNumber}
                        />
                        {errors.partNumber ? (
                          <FormFeedback>{errors.partNumber}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Vendor
                    </Label>
                      <div className={"input-block"}>
                        <Async
                          placeholder={"Type vendor name"}
                          loadOptions={this.loadOptions}
                          value={vendorId}
                          onChange={e => {
                            this.setState({
                              vendorId: e
                            });
                          }}
                          isClearable={true}
                          noOptionsMessage={() =>
                            vendorInput ? "No vendor found" : "Type vendor name"
                          }
                          className={"w-100 form-select"}
                          classNamePrefix={"form-select-theme"}
                        />
                        {errors.vendorId ? (
                          <FormFeedback>{errors.vendorId}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Bin/Location
                    </Label>
                      <div className={"input-block"}>
                        <Input
                          type="text"
                          className="customer-modal-text-style"
                          placeholder="Bin/Location"
                          onChange={this.handleChange}
                          maxLength="40"
                          name="location"
                          value={location}
                          invalid={errors.location}
                        />
                        {errors.location ? (
                          <FormFeedback>{errors.location}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className={"fleet-block"}>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Pricing Matrix
                    </Label>
                      <Async
                        placeholder={"Type to select price matrix"}
                        loadOptions={this.matrixLoadOptions}
                        className={"w-100 form-select"}
                        classNamePrefix={"form-select-theme"}
                        onChange={e => this.handlePriceMatrix(e)}
                        isClearable={
                          selectedPriceMatrix && selectedPriceMatrix.value
                            ? true
                            : false
                        }
                        noOptionsMessage={() => "Type price matrix name"}
                        value={selectedPriceMatrix}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Cost
                    </Label>
                      <div className={"input-block"}>
                        <InputGroup>
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fa fa-dollar" />
                            </span>
                          </div>
                          <Input
                            type="number"
                            className="customer-modal-text-style"
                            placeholder="0.00"
                            onChange={e => this.handleCostPricechange(e)}
                            maxLength="40"
                            name="cost"
                            invalid={errors.cost}
                            value={cost}
                          />
                        </InputGroup>
                        {errors.cost ? (
                          <FormFeedback>{errors.cost}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Retail Price
                    </Label>
                      <div className={"input-block"}>
                        <InputGroup>
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fa fa-dollar" />
                            </span>
                          </div>
                          <Input
                            type="number"
                            className="customer-modal-text-style"
                            placeholder="0.00"
                            onChange={this.handleRetailsPriceChange}
                            maxLength="40"
                            name="price"
                            invalid={errors.price}
                            value={price}
                          />
                        </InputGroup>
                        {errors.price ? (
                          <FormFeedback>{errors.price}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Quantity in hand <span className={"asteric"}>*</span>
                      </Label>
                      <div className={"input-block"}>
                        <Input
                          type="number"
                          className="customer-modal-text-style"
                          placeholder="100"
                          onChange={event => {
                            const { value } = event.target;
                            if (isNaN(value) || value < 0) {
                              return;
                            }
                            this.handleChange(event);
                          }}
                          maxLength="10"
                          name="quantity"
                          invalid={errors.quantity}
                          value={quantity}
                        />
                        {errors.quantity ? (
                          <FormFeedback>{errors.quantity}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Critical Quantity
                    </Label>
                      <div className={"input-block"}>
                        <Input
                          type="number"
                          className="customer-modal-text-style"
                          placeholder="10"
                          onChange={event => {
                            const { value } = event.target;
                            if (isNaN(value) || value < 0) {
                              return;
                            }
                            this.handleChange(event);
                          }}
                          maxLength="10"
                          name="criticalQuantity"
                          invalid={errors.criticalQuantity}
                          value={criticalQuantity}
                        />
                        {errors.criticalQuantity ? (
                          <FormFeedback>{errors.criticalQuantity}</FormFeedback>
                        ) : null}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Markup
                    </Label>
                      <div className={"input-block"}>
                        <ButtonGroup>
                          {MarkupChangeValues.map((mark, index) => {
                            return (
                              <Button
                                key={index}
                                type={"button"}
                                color={"secondary"}
                                className={
                                  markup === mark.value
                                    ? "margin-markup-btn-active"
                                    : "margin-markup-btn"
                                }
                                size={"sm"}
                                onClick={() => this.setPriceByMarkup(mark.value)}
                              >
                                {mark.key}
                              </Button>
                            );
                          })}
                          <Button
                            type={"button"}
                            size={"sm"}
                            className={"btn-with-input"}
                          >
                            <Input
                              type={"text"}
                              placeholder={"Markup"}
                              defaultValue={markup}
                              value={markup}
                              onChange={e =>
                                this.setPriceByMarkup(e.target.value)
                              }
                            />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label htmlFor="name" className="customer-modal-text-style">
                        Margin
                    </Label>
                      <div className={"input-block"}>
                        <ButtonGroup>
                          {MarginChangeValues.map((mark, index) => {
                            return (
                              <Button
                                key={index}
                                type={"button"}
                                color={"secondary"}
                                className={
                                  margin === mark.value
                                    ? "margin-markup-btn-active"
                                    : "margin-markup-btn"
                                }
                                size={"sm"}
                                onClick={() => this.setPriceByMargin(mark.value)}
                              >
                                {mark.key}
                              </Button>
                            );
                          })}
                          <Button
                            type={"button"}
                            size={"sm"}
                            className={"btn-with-input"}
                          >
                            <Input
                              type={"text"}
                              placeholder={"Margin"}
                              defaultValue={margin}
                              value={margin}
                              onChange={e =>
                                this.setPriceByMargin(e.target.value)
                              }
                            />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  {CreatePartOptions.map((option, index) => {
                    return (
                      <Col sm={{ size: 5, offset: 1 }} key={index}>
                        <Row className="justify-content-center pb-2" key={index}>
                          <Col md="2">
                            <AppSwitch
                              className={"mx-1"}
                              name={option.key}
                              checked={partOptions[option.key]}
                              onClick={this.handleClick}
                              variant={"3d"}
                              color={"primary"}
                              size={"sm"}
                            />
                          </Col>
                          <Col md="10">
                            <p className="customer-modal-text-style">
                              {option.text}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    );
                  })}
                </Row>
              </>
            )}
        </CRMModal>
      </Form>
    );
  }
}

export default CrmInventoryPart;
