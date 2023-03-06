import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getCannedServiceList,
  modelOpenRequest,
  addPartToService,
  addTireToService,
  addLaborToService,
  getInventoryPartsList,
  requestAddPart,
  addNewTier,
  getTiersList,
  labourAddRequest,
  labourListRequest,
  getLabelList,
  addNewLabel,
  deleteLabel,
  getMatrixList,
  getRateStandardListRequest,
  rateAddRequest,
  setRateStandardListStart,
  getInventoryPartVendors
} from "../../../actions"
import CrmDiscountBtn from "../../common/CrmDiscountBtn";
import {
  Card,
  Input,
  FormGroup,
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  FormFeedback,
  UncontrolledTooltip
} from "reactstrap";
import { getSumOfArray, calculateValues, calculateSubTotal } from "../../../helpers"
import NoDataFound from "../../common/NoFound";
import { toast } from "react-toastify";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import { LabelColorOptions } from "../../../config/Color"
import CrmInventoryPart from "../../common/CrmInventoryPart";
import { CrmTyreModal } from "../../common/Tires/CrmTyreModal";
import { CrmLabourModal } from "../../common/Labours/CrmLabourModal";

class CannedServiceUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceData: [
        {
          isButtonValue: "",
          serviceName: "",
          technician: "",
          note: "",
          serviceItems: [],
          epa: {
            type: "%",
            value: "",
            isConfirmedValue: false
          },
          discount: {
            type: "%",
            value: "",
            isConfirmedValue: false
          },
          taxes: {
            type: "%",
            value: "",
            isConfirmedValue: false
          },
          serviceSubTotalValue: [],
          serviceTotal: "0.00",
          isError: false,
          isCannedAdded: false
        }
      ],
      isServiceSubmitted: false,
      technicianData: {
        label: "Type to select technician",
        value: ""
      },
      isError: false,
      isCannedServiceSumbmit: false,
      selectedService: "",
      serviceIndex: -1
    };
  }

  componentDidMount = () => {
    this.props.getCannedServiceList({ serviceId: this.props.match.params.id })
  }
  componentDidUpdate = ({ serviceReducers }) => {
    if (serviceReducers && (serviceReducers !== this.props.serviceReducers)) {
      const {
        cannedServiceList
      } = this.props.serviceReducers
      this.setState({
        serviceData: cannedServiceList
      })
    }
  }
  handleClickDiscountType = (value, index, Mindex) => {
    const serviceData = [...this.state.serviceData]
    if (value === "%" && serviceData[Mindex].serviceItems[index].discount.value !== '') {
      if (parseInt(serviceData[Mindex].serviceItems[index].discount.value) < 100) {
        serviceData[Mindex].serviceItems[index].discount.type = value
      }
      else {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Enter percentage less than 100");
        }
      }
    } else if (value === "$" && serviceData[Mindex].serviceItems[index].discount.value !== '') {
      serviceData[Mindex].serviceItems[index].discount.type = value
    }
    else {
      serviceData[Mindex].serviceItems[index].discount.type = value
    }
    this.setState({
      serviceData
    })
  }
  handleClickEpaType = (value, index, name) => {
    const serviceData = [...this.state.serviceData]
    if (name === 'epa') {
      if (value === "%" && serviceData[index].epa.value !== '') {
        if (parseInt(serviceData[index].epa.value) < 100) {
          serviceData[index].epa.type = value
        }
        else {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Enter percentage less than 100");
          }
        }
      } else if (value === "$" && serviceData[index].epa.value !== '') {
        serviceData[index].epa.type = value
      }
      else {
        serviceData[index].epa.type = value
      }
      this.setState({
        services: serviceData
      })
    } else if (name === 'discount') {
      if (value === "%" && serviceData[index].discount.value !== '') {
        if (parseInt(serviceData[index].discount.value) < 100) {
          serviceData[index].discount.type = value
        }
        else {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Enter percentage less than 100");
          }
        }
      } else if (value === "$" && serviceData[index].discount.value !== '') {
        serviceData[index].discount.type = value
      }
      else {
        serviceData[index].discount.type = value
      }
      this.setState({
        serviceData
      })
    } else {
      if (value === "%" && serviceData[index].taxes.value !== '') {
        if (parseInt(serviceData[index].taxes.value) < 100) {
          serviceData[index].taxes.type = value
        }
        else {
          if (!toast.isActive(this.toastId)) {
            this.toastId = toast.error("Enter percentage less than 100");
          }
        }
      } else if (value === "$" && serviceData[index].taxes.value !== '') {
        serviceData[index].taxes.type = value
      }
      else {
        serviceData[index].taxes.type = value
      }
      this.setState({
        serviceData
      })
    }
  }
  handleServiceModalOpenAdd = async (index, serviceType) => {
    let modelDetails = {};
    switch (serviceType) {
      case 'part':
        modelDetails = {
          partAddModalOpen: true
        };
        break;
      case 'tire':
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      case 'labor':
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      default:
        break;
    }
    await this.props.modelOperate(modelDetails);
    this.handleServiceModal(serviceType, index)
  }
  handleServiceModal = (serviceType, index) => {
    this.setState({
      selectedService: serviceType ? serviceType : "",
      serviceIndex: index
    });
  };
  handleOpenModal = () => {
    const { selectedService, serviceIndex, serviceData } = this.state;
    const {
      modelInfoReducer,
      modelOperate,
      getPartDetails,
      addPartToService,
      addTireToService,
      addInventoryPart,
      addInventryTire,
      getTireDetails,
      getLaborDetails,
      addLaborToService,
      addLaborInventry,
      getPriceMatrix,
      getStdList,
      rateStandardListReducer,
      profileInfoReducer,
      getInventoryPartsVendors
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { tireAddModalOpen, partAddModalOpen, rateAddModalOpen } = modelDetails;
    switch (selectedService) {
      case "part":
        return (
          <>
            <CrmInventoryPart
              isOpen={partAddModalOpen}
              serviceModal={true}
              serviceIndex={serviceIndex}
              getPartDetails={getPartDetails}
              addPartToService={addPartToService}
              addInventoryPart={addInventoryPart}
              services={serviceData}
              getPriceMatrix={getPriceMatrix}
              getInventoryPartsVendors={getInventoryPartsVendors}
              toggle={() =>
                modelOperate({
                  partAddModalOpen: !partAddModalOpen
                })
              }
            />
          </>
        );
      case "tire":
        return (
          <CrmTyreModal
            tyreModalOpen={tireAddModalOpen}
            serviceTireModal={true}
            serviceIndex={serviceIndex}
            services={serviceData}
            addTier={addInventryTire}
            addTireToService={addTireToService}
            getTireDetails={getTireDetails}
            getPriceMatrix={getPriceMatrix}
            getInventoryPartsVendors={getInventoryPartsVendors}
            handleTierModal={() =>
              modelOperate({
                tireAddModalOpen: !tireAddModalOpen
              })
            }
          />
        );
      case "labor":
        return (
          <CrmLabourModal
            tyreModalOpen={tireAddModalOpen}
            serviceLaborModal={true}
            serviceIndex={serviceIndex}
            services={serviceData}
            addLabour={addLaborInventry}
            getLaborDetails={getLaborDetails}
            addLaborToService={addLaborToService}
            addRate={this.addRate}
            getStdList={getStdList}
            rateStandardListData={rateStandardListReducer}
            setDefaultRate={this.setDefaultRate}
            handleLabourModal={() =>
              modelOperate({
                tireAddModalOpen: !tireAddModalOpen
              })
            }
            rateAddModalProp={rateAddModalOpen}
            rateAddModalFun={() =>
              modelOperate({
                rateAddModalOpen: !rateAddModalOpen
              })
            }
            profileInfoReducer={profileInfoReducer.profileInfo}
          />
        );
      default:
        return null;
    }
  };
  setDiscountValue = (e, Mindex, index) => {
    const { name, value } = e.target
    let serviceData = [...this.state.serviceData]
    const discountValue = serviceData[Mindex].serviceItems[index].discount
    if (discountValue.type === '%' && value) {
      if (parseFloat(value) > 100) {
        if (!toast.isActive(this.toastId)) {
          this.toastId = toast.error("Enter percentage less than 100");
        }
        return
      } else {
        if (name === 'discount') {
          discountValue.value = value
        }
      }
    } else {
      if (name === 'discount') {
        discountValue.value = value
      }
    }
    this.setState({
      serviceData
    })
  }

  handleCostChange = (e, Mindex, index) => {
    const serviceData = [...this.state.serviceData]
    const { value } = e.target
    serviceData[Mindex].serviceItems[index].cost = value
    this.setState({
      serviceData
    })
  }
  handleQuantityChange = (e, Mindex, index) => {
    const serviceData = [...this.state.serviceData]
    const { value } = e.target
    serviceData[Mindex].serviceItems[index].qty = value
    this.setState({
      serviceData
    })
  }

  handleHourChange = (e, Mindex, index) => {
    const serviceData = [...this.state.serviceData]
    const { value } = e.target
    serviceData[Mindex].serviceItems[index].hours = value
    this.setState({
      serviceData
    })
  }
  handleChange = (e, index) => {
    const { value, name } = e.target;
    const serviceData = [...this.state.serviceData]
    serviceData[index][name] = value
    this.setState({
      serviceData
    })
  }
  loadTechnician = (input, callback) => {
    const type = "5ca3473d70537232f13ff1fa"
    this.props.getUserData({ input, type, callback });
  };
  handleTechnicianAdd = (e, index) => {
    if (e && e.value) {
      const serviceData = [...this.state.serviceData]
      serviceData[index].technician = e.data
      this.setState({
        serviceData,
        selectedTechnician: {
          label: e.label,
          value: e.value
        }
      })
    } else {
      const serviceData = [...this.state.serviceData]
      serviceData[index].technician = ""
      this.setState({
        serviceData,
        selectedTechnician: {
          label: "Type to select technician",
          value: ""
        },
      })
    }
  }

  handleSeviceAdd = () => {
    this.setState({
      isError: true
    })
    if (this.state.serviceData) {
      const services = [...this.state.serviceData]
      const serviceData = [
        {
          isButtonValue: "",
          serviceName: "",
          technician: "",
          note: "",
          serviceItems: [],
          epa: {
            type: "%",
            value: "",
            isConfirmedValue: false
          },
          discount: {
            type: "%",
            value: "",
            isConfirmedValue: false
          },
          taxes: {
            type: "%",
            value: "",
            isConfirmedValue: false
          },
          serviceSubTotalValue: [],
          serviceTotal: "0.00",
          isError: false,
          isCannedService: false,
          isCannedAdded: false
        }
      ]
      services.push(serviceData[0])
      this.setState({
        serviceData: services
      })
    }
  }

  handleRemoveService = async (index) => {
    const { value } = await ConfirmBox({
      text: "Do you want to remove this service?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    const { serviceData } = this.state;
    serviceData[index].isCannedAdded = false
    let t = [...serviceData];
    t.splice(index, 1);
    if (serviceData.length) {
      this.setState({
        serviceData: t
      });
    }
  };

  handleTaxeButtons = (index, value) => {
    const serviceData = [...this.state.serviceData]
    serviceData[index].isButtonValue = value
    this.setState({
      serviceData
    })
  }

  handleRemoveTaxes = (index) => {
    const serviceData = [...this.state.serviceData]
    serviceData[index].isButtonValue = ''
    this.setState({
      serviceData
    })
  }

  handleTaxesAdd = (e, index) => {
    const { name, value } = e.target
    const serviceData = [...this.state.serviceData]
    if ((parseFloat(value) >= 100) && (serviceData[index].epa.type === '%' || serviceData[index].discount.type === '%' || serviceData[index].taxes.type === '%')) {
      if (!toast.isActive(this.toastId)) {
        this.toastId = toast.error("Enter percentage less than 100");
      }
      return
    }
    serviceData[index][name].value = value
    this.setState({
      serviceData
    })
  }
  handleOnChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  handleLabelColorSelect = (color, Mindex, sIndex) => {
    const serviceData = [...this.state.serviceData]
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    serviceData[Mindex].serviceItems[sIndex].label[labelLength - 1].color = color
    this.setState({
      serviceData
    })
  }
  handleLabelAdd = (Mindex, sIndex) => {
    const serviceData = [...this.state.serviceData]
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    labelData[labelLength - 1].isAddLabel = true
    this.setState({
      serviceData
    }, () => {
      const labelConst =
      {
        color: "",
        name: "",
        isAddLabel: false
      }
      labelData.push(labelConst)
      this.handleLabelName('', Mindex, sIndex)
    })
  }
  handleLabelName = (e, Mindex, sIndex) => {
    if (e) {
      const { value } = e.target
      const serviceData = [...this.state.serviceData]
      const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
      const labelData = serviceData[Mindex].serviceItems[sIndex].label
      labelData[labelLength - 1].name = value
      this.setState({
        serviceData
      })
    } else {
      const serviceData = [...this.state.serviceData]
      const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
      const labelData = serviceData[Mindex].serviceItems[sIndex].label
      labelData[labelLength - 1].name = ''
      this.setState({
        serviceData
      })
    }
  }

  handleRemoveLabel = (Mindex, sIndex, lIndex) => {
    const serviceData = [...this.state.serviceData]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    labelData.splice(lIndex, 1)
    this.setState({
      serviceData
    })
  }
  handleSaveLabel = (Mindex, sIndex) => {
    const serviceData = [...this.state.serviceData]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    const payload = labelData[labelLength - 1]
    this.props.addNewLabel(payload)
  }
  handleAddLabelFromList = (Mindex, sIndex, color, name) => {
    const serviceData = [...this.state.serviceData]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    labelData[labelLength - 1].color = color
    labelData[labelLength - 1].name = name
    labelData[labelLength - 1].isAddLabel = true
    this.setState({
      serviceData
    },
      () => {
        const labelConst =
        {
          color: "",
          name: "",
          isAddLabel: false
        }
        labelData.push(labelConst)
      })
  }
  handleRemoveServiceItems = async (Mindex, sIndex) => {
    const { value } = await ConfirmBox({
      text: "you want to remove this item?"
    });
    if (!value) {
      return;
    }
    const serviceData = [...this.state.serviceData]
    const serviceItems = serviceData[Mindex].serviceItems
    serviceData[Mindex].serviceSubTotalValue = []
    serviceItems.splice(sIndex, 1)
    this.setState({
      serviceData
    }, () => {
      let serviceTotalValue = serviceData[Mindex].serviceSubTotalValue
      serviceData[Mindex].serviceItems.map((item, Index) => {
        const serviceSubTotal = parseFloat(item.subTotalValue).toFixed(2)
        serviceTotalValue.push(parseFloat(serviceSubTotal))
        return true
      })
      if (serviceTotalValue.length) {
        serviceData[Mindex].serviceTotal = getSumOfArray(serviceTotalValue)
      } else {
        serviceData[Mindex].serviceTotal = "0.00"
      }
      this.setState({
        serviceData
      })
    })
  }

  handleSavedLabelDelete = async (labelData) => {
    const { value } = await ConfirmBox({
      text: "you want to remove this label?"
    });
    if (!value) {
      return;
    }
    const payload = {
      _id: labelData._id,
      isDeleted: true
    }
    this.props.deleteLabel(payload)
  }
  labelColors = (index, sIndex) => {
    const { serviceData } = this.state;
    const labelLength = serviceData[index].serviceItems[sIndex].label.length
    return (
      LabelColorOptions.map((item, lIndex) => {
        return (
          <li key={lIndex}>
            <span onClick={() => this.handleLabelColorSelect(item.color, index, sIndex)} style={{
              background: item.color,
              position: "relative", top: "5px"
            }}>
              {
                item.color === (serviceData[index].serviceItems[sIndex].label ? serviceData[index].serviceItems[sIndex].label[labelLength - 1].color : null) ?
                  <i className={"fa fa-check"} /> :
                  null
              }
            </span>
          </li>
        )
      })
    )
  }

  handleUpdateCannedService = () => {
    
  }
  render() {
    const { serviceData, isServiceSubmitted, selectedService } = this.state
    const { labelReducer } = this.props
    return (
      <>
        <div className={"p-3"}>
          {
            serviceData && serviceData.length ? serviceData.map((item, index) => {
              let mainserviceTotal = [], serviceTotal, epa, discount, tax
              // const technicianEle = {
              //   "label": item.technician ? `${item.technician.firstName} ${item.technician.lastName}` : "type to select technician",
              //   "value": item.technician ? item.technician._id : ""
              // }
              return (
                <React.Fragment key={index}>
                  <Card className={"service-card"}>
                    <div className={"custom-form-modal"}>
                      <div className={"service-card-header-block d-flex flex-row"}>
                        <div className={"service-card-header"}>
                          <Input
                            placeholder={"Enter a name for this service"}
                            onChange={(e) => this.handleChange(e, index)} name={"serviceName"}
                            value={item && item.serviceName ? item.serviceName : ''}
                            maxLength={"100"}
                            invalid={isServiceSubmitted && item.isError && !item.serviceName}
                            size={"lg"}
                          />
                          <FormFeedback>
                            {item.isError && isServiceSubmitted && !item.serviceName
                              ? "Service name is required."
                              : null}
                          </FormFeedback>
                        </div>
                        {/* <div className={"service-card-btn-block flex-one d-flex align-items-center"}>
                          <div className={((technicianData.value === null || technicianData.value === "") && (item.technician === null || item.technician === "")) || ((item.technician === null || item.technician === "")) ? "pr-1 pl-1 pb-1 mr-3 cursor_pointer notValue" : "pb-1 pr-1 pl-1 mr-3 cursor_pointer isValue"} id={`tech${index}`}>
                            <img className={""} src={"/assets/img/expert.svg"} width={"30"} alt={"technician"} />
                          </div>
                          <UncontrolledTooltip placement="top" target={`tech${index}`}>
                            {((technicianData.value === null || technicianData.value === "") && (item.technician === null || item.technician === "")) || ((item.technician === null || item.technician === "")) ? "Assign a technician" : "Update technician"}
                          </UncontrolledTooltip>
                          <div className={
                            item.note ? "pb-1 cursor_pointer isValue" : "pb-1 cursor_pointer notValue"
                          } id={`note${index}`}>
                            <img className={""} src={"/assets/img/writing .svg"} width={"30"} alt={"Notes"} />
                          </div>
                          <UncontrolledTooltip placement="top" target={`note${index}`}>
                            {item.note ? "Update note" : "Add a note"}
                          </UncontrolledTooltip>
                          <UncontrolledPopover trigger="legacy" placement="bottom" target={`tech${index}`} className={"service-note-popover"}>
                            <Async
                              className={"w-100 form-select"}
                              placeholder={"Type Technician name"}
                              loadOptions={this.loadTechnician}
                              value={
                                item.technician ?
                                  technicianEle
                                  : selectedTechnician
                              }
                              isClearable={technicianEle.value !== '' ? true : false}
                              noOptionsMessage={() => "Type Technician name"}
                              onChange={e => this.handleTechnicianAdd(e, index, item.technician)}
                            />
                          </UncontrolledPopover>
                          <UncontrolledPopover trigger="legacy" placement="bottom" target={`note${index}`} className={"service-note-popover"}>
                            <Input
                              type={"textarea"}
                              onChange={(e) => this.handleChange(e, index)}
                              name={"note"}
                              value={item.note}
                              maxLength={"1000"}
                              rows={"2"} cols={"3"}
                              placeholder={"Add Note for this service"}
                            />
                          </UncontrolledPopover>

                        </div> */}
                      </div>
                      <table className={"table matrix-table service-table"}>
                        <thead>
                          <tr className={"service-table-head"}>
                            <th width="430" className={"pl-3"}>DESCRIPTION</th>
                            <th width="150" className={"text-center"}>PRICE</th>
                            <th width="150" className={"text-center"}>QTY</th>
                            <th width="200" className={"text-center"}>HRS</th>
                            <th width="200" className={""}>DISCOUNT</th>
                            <th width="150" className={"text-center"}>SUBTOTAL</th>
                            <th width="200" className={"text-center"}>STATUS</th>
                            <th width="30" className={"text-center"}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.serviceData[index] && this.state.serviceData[index].serviceItems.length ?
                              this.state.serviceData[index].serviceItems.map((service, sIndex) => {
                                const calSubTotal = calculateSubTotal(service.cost || (service.tierSize && service.tierSize.length ? service.tierSize[0].cost : null) || 0, service.qty || 0, service.hours || 0, (service.rate ? service.rate.hourlyRate : 0))
                                const subDiscount = calculateValues(calSubTotal || 0, service.discount.value || 0, service.discount.type);
                                const servicesSubTotal = (parseFloat(calSubTotal) - parseFloat(subDiscount)).toFixed(2);
                                mainserviceTotal.push(parseFloat(servicesSubTotal))
                                const serviceTotalArray = getSumOfArray(mainserviceTotal)
                                epa = calculateValues(serviceTotalArray || 0, item.epa.value || 0, item.epa.type);
                                discount = calculateValues(serviceTotalArray || 0, item.discount.value || 0, item.discount.type);
                                tax = calculateValues(serviceTotalArray || 0, item.taxes.value || 0, item.taxes.type);
                                serviceTotal = (parseFloat(serviceTotalArray) + parseFloat(epa) + parseFloat(tax) - parseFloat(discount)).toFixed(2);
                                return (
                                  <tr key={sIndex}>
                                    <td className={"text-capitalize pl-3"}><b>{service.serviceType || '-'}</b>: {service.description || service.brandName || service.discription || '-'}</td>
                                    <td>
                                      {
                                        (service.cost !== null || (service.tierSize && service.tierSize.length ? service.tierSize[0].cost !== null : null)) && service.serviceType !== 'labor' ?
                                          <Input
                                            onChange={(e) => this.handleCostChange(e, index, sIndex)}
                                            name={"cost"}
                                            type="text"
                                            maxLength={"4"}
                                            value={service.cost || (service.tierSize && service.tierSize.length ? service.tierSize[0].cost : null) || 0}
                                          /> :
                                          null
                                      }
                                    </td>
                                    <td>
                                      {
                                        (service.quantity !== null || (service.tierSize && service.tierSize.length ? service.tierSize[0].quantity !== null : null)) && service.serviceType !== 'labor' ?
                                          <Input
                                            type="text"
                                            onChange={(e) => this.handleQuantityChange(e, index, sIndex)}
                                            name={"quantity"}
                                            maxLength={"4"}
                                            value={service.qty || 0}
                                          /> :
                                          null
                                      }
                                    </td>
                                    <td className={"text-center"}>
                                      <div className={"hours-block"}>
                                        {
                                          service.hours !== '' && service.serviceType === 'labor' ?
                                            <Input
                                              type={"text"}
                                              name={"hour"}
                                              maxLength={"4"}
                                              onChange={(e) => this.handleHourChange(e, index, sIndex)}
                                              value={service.hours || 0}
                                            /> :
                                            <span className={"no-value"}>--:--</span>
                                        }
                                      </div>
                                    </td>
                                    <td>
                                      <div className={"labor-discount "}>
                                        <div className={"labor-discount-input"}>
                                          {service.discount.type === '$' ?
                                            <div className="input-icon dollar">
                                              <i className={"fa fa-dollar"}></i>
                                            </div> : null}
                                          <Input id="discount" name="discount" type={"text"} value={service.discount.value}
                                            onChange={(e) => {
                                              this.setDiscountValue(e, index, sIndex)
                                            }} maxLength="5" placeholder={"0"} />
                                          {service.discount.type === '%' ?
                                            <div className="input-icon percent">
                                              <i className={"fa fa-percent"}></i>
                                            </div> : null}
                                        </div>
                                        <div className={"service-customer-discount"}>
                                          <CrmDiscountBtn index={index + `${sIndex}`} sIndex={sIndex} discountType={service.discount.type} handleClickDiscountType={(data) => this.handleClickDiscountType(data, sIndex, index)} />
                                        </div>
                                      </div>
                                    </td>
                                    <td className={"text-center"}>
                                      <span className="dollar-price"><i className="fa fa-dollar dollar-icon"></i>{!isNaN(servicesSubTotal) ? servicesSubTotal : 0}</span>
                                    </td>
                                    <td className={"text-center"}>

                                      {
                                        service.label && service.label.length ?
                                          service.label.map((label, lIndex) => {
                                            return (
                                              <>
                                                {
                                                  label.isAddLabel ?
                                                    <div>
                                                      <span key={lIndex} style={{
                                                        background: label.color
                                                      }} className={"status-label-btn"} >
                                                        {label.name}

                                                        <span className={"close-icon"}
                                                          onClick={() => this.handleRemoveLabel(index, sIndex, lIndex)}
                                                        >
                                                          <i className="fas fa-times" />
                                                        </span>
                                                      </span>
                                                    </div>
                                                    :
                                                    null
                                                }
                                              </>
                                            )
                                          }) :
                                          null
                                      }
                                      <Button id={`new${sIndex}${index}`} className={"btn-sm"} type="button">
                                        New +
                                                         </Button>
                                      <UncontrolledTooltip target={`new${sIndex}${index}`}>
                                        Add Label For {`${service.serviceType}`}
                                      </UncontrolledTooltip>
                                      <UncontrolledPopover trigger="legacy" placement="bottom" target={`new${sIndex}${index}`}>
                                        <PopoverHeader>
                                          <div>
                                            <FormGroup className={"mb-0"}>
                                              <Input value={service.label[service.label.length - 1].name} onChange={(e) => this.handleLabelName(e, index, sIndex)} placeholder={"Enter a label name."} />
                                              <ul className={"lable-color"} >
                                                {this.labelColors(index, sIndex)}
                                              </ul>
                                            </FormGroup>
                                            <Button disabled={(service.label ? !service.label[service.label.length - 1].name : null) && (service.label ? !service.label[service.label.length - 1].isButtonValue : null)} color="secondary" className={"btn-block btn-round"} onClick={() => this.handleLabelAdd(index, sIndex)}>Add Label</Button>
                                            <Button disabled={(service.label ? !service.label[service.label.length - 1].name : null) && (service.label ? !service.label[service.label.length - 1].isButtonValue : null)} color="secondary" className={"btn-block btn-round"} onClick={() => this.handleSaveLabel(index, sIndex)}>Add To Saved Label</Button>
                                          </div>
                                        </PopoverHeader>
                                        <PopoverBody>
                                          {
                                            labelReducer.label && labelReducer.label.length ?
                                              labelReducer.label.map((data, Lindex) => {
                                                return (
                                                  <div className={"d-flex"} key={Lindex}>
                                                    <Button key={Lindex} style={{
                                                      background: data.labelColor
                                                    }} className={"btn-sm btn-block label-btn"} onClick={() => this.handleAddLabelFromList(index, sIndex, data.labelColor, data.labelName)} type="button">
                                                      {data.labelName}
                                                    </Button>
                                                    <span id={`remove${Lindex}${sIndex}${index}`} className={"pl-2 mt-2"} style={{ cursor: "pointer" }} onClick={() => this.handleSavedLabelDelete(data)}><i className={"icons cui-trash"}></i></span>
                                                    <UncontrolledTooltip target={`remove${Lindex}${sIndex}${index}`}>
                                                      Remove {data.labelName}
                                                    </UncontrolledTooltip>
                                                  </div>
                                                )
                                              }) : null
                                          }
                                        </PopoverBody>
                                      </UncontrolledPopover>

                                    </td>
                                    <td>
                                      <Button
                                        size={"sm"}
                                        id={`Delete${index}${sIndex}`}
                                        onClick={() => { this.handleRemoveServiceItems(index, sIndex) }}
                                        className={"btn-theme-transparent"}
                                      >
                                        <i className={"icons cui-trash"}></i>
                                      </Button>
                                      <UncontrolledTooltip target={`Delete${index}${sIndex}`}>
                                        Remove {`${service.serviceType}`}
                                      </UncontrolledTooltip>
                                    </td>
                                  </tr>
                                )
                              }) :
                              <tr>
                                <td className={"text-center"} colSpan={12}>
                                  <NoDataFound showAddButton={false} message={"Currently there are no Services created."} />
                                  <div className={"service-utility-btn no-service-data"}>
                                    <Button
                                      color={""}
                                      size={"sm"}
                                      className={"mr-2 btn-link"}
                                      onClick={() => this.handleServiceModalOpenAdd(index, 'part')}>
                                      <i className="nav-icon icons icon-puzzle"></i>&nbsp; Add Part
                                    </Button>
                                    <Button
                                      color={""}
                                      size={"sm"}
                                      className={"mr-2 btn-link"}
                                      onClick={() => this.handleServiceModalOpenAdd(index, 'tire')} >
                                      <i className="nav-icon icons icon-support"></i>&nbsp; Add Tire
                                    </Button>
                                    <Button
                                      color={""}
                                      size={"sm"}
                                      className={"mr-2 btn-link"}
                                      onClick={() => this.handleServiceModalOpenAdd(index, 'labor')}>
                                      <i className="nav-icon icons icon-user"></i>&nbsp; Add Labor
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className={"p-2 d-flex justify-content-between calculation-section"}>
                      <div className={"position-relative d-flex align-items-end"}>
                        <div className={"tax-calculate-block"}>
                          <div className={"tax-block"} >
                            <span className={"title"}>EPA</span>
                            <div className={"tax-input-block"}>
                              <div className={"input"}>
                                {item.epa && item.epa.type === '$' ?
                                  <div className="dollor-icon icon">
                                    <i className={"fa fa-dollar"}></i>
                                  </div>
                                  : null}
                                <Input id="EPA" name="epa" value={item.epa.value} onChange={(e) => { this.handleTaxesAdd(e, index) }} type={"text"} maxLength="5" placeholder={"0"} />
                                {item.epa && item.epa.type === '%' ?
                                  <div className="percent-icons icon">
                                    <i className={"fa fa-percent"}></i>
                                  </div> : null}
                                <CrmDiscountBtn discountType={item.epa && item.epa.type ? item.epa.type : "%"} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "epa")} index={`EPA-${index}`} />
                              </div>
                            </div>
                          </div>
                          <div className={"tax-block"}>
                            <span className={"title"}>Discount</span>
                            <div className={"tax-input-block"}>
                              <div className={"input"}>
                                {item.discount && item.discount.type === '$' ?
                                  <div className={"dollor-icon icon"}>
                                    <i className={"fa fa-dollar"}></i>
                                  </div> : null}
                                <Input id="discount" value={item.discount.value} name="discount" onChange={(e) => { this.handleTaxesAdd(e, index, "epa") }} type={"text"} maxLength="5" placeholder={"0"} />
                                {item.discount && item.discount.type === '%' ?
                                  <div className={"percent-icons icon"}>
                                    <i className={"fa fa-percent"}></i>
                                  </div> : null}
                                <CrmDiscountBtn discountType={item.discount.type} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "discount")} index={`DISC-${index}`} />
                              </div>
                            </div>
                          </div>
                          <div className={"tax-block"}>
                            <span className={"title"}>Tax</span>
                            <div className={"tax-input-block"}>
                              <div className={"input"}>
                                {item.taxes && item.taxes.type === '$' ?
                                  <div className={"dollor-icon icon"}>
                                    <i className={"fa fa-dollar"}></i>
                                  </div>
                                  : null}
                                <Input name="taxes" value={item.taxes.value} onChange={(e) => { this.handleTaxesAdd(e, index) }} type={"text"} maxLength="5" placeholder={"0"} />
                                {item.taxes && item.taxes.type === '%' ?
                                  <div className={"percent-icons icon"}>
                                    <i className={"fa fa-percent"}></i>
                                  </div> : null}
                                <CrmDiscountBtn discountType={item.taxes.type} handleClickDiscountType={(data) => this.handleClickEpaType(data, index, "taxes")} index={`TAX-${index}`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={"service-total-block"}>
                        <div className="text-right">
                          <h6><span className={"title"}>Epa :&nbsp;</span>
                            <span className={"value"}>
                              <span className="dollar-price"><i className="fa fa-dollar dollar-icon"></i>{!isNaN(epa) ? parseFloat(epa).toFixed(2) : 0}</span>
                            </span>
                          </h6>
                          <h6>
                            <span className={"title"}>Discount :&nbsp;</span>
                            <span className={"value"}> <span className="dollar-price"><i className="fa fa-dollar dollar-icon"></i>{!isNaN(discount) ? parseFloat(discount).toFixed(2) : 0}</span>
                            </span>
                          </h6>
                          <h6>
                            <span className={"title"}>Taxes :&nbsp;</span>
                            <span className={"value"}> <span className="dollar-price"><i className="fa fa-dollar dollar-icon"></i>{!isNaN(tax) ? parseFloat(tax).toFixed(2) : 0}</span>
                            </span>
                          </h6>
                        </div>
                        <h4 className={"mb-0 border-top pt-2"}>Service Total: <span className={"dollor-icon"}>${!isNaN(serviceTotal) ? serviceTotal : 0.00}</span></h4>
                      </div>

                    </div>

                    <div className={"service-card-footer"}>
                      <div className={"service-utility-btn"}>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'part')}>
                          <i className="nav-icon icons icon-puzzle"></i>&nbsp; Add Part
                        </Button>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'tire')} >
                          <i className="nav-icon icons icon-support"></i>&nbsp; Add Tire
                        </Button>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() => this.handleServiceModalOpenAdd(index, 'labor')}>
                          <i className="nav-icon icons icon-user"></i>&nbsp; Add Labor
                        </Button>
                      </div>
                    </div>
                  </Card>
                </React.Fragment>
              )
            }) : null
          }
          <div className="d-flex pb-4 justify-content-between">
            {
              this.state.serviceData && this.state.serviceData.length ?
                <Button color={""} className={"btn-blue pull-right"} onClick={
                  () => {
                    this.handleUpdateCannedService()
                  }
                }>Update canned services</Button> : null
            }
          </div>
        </div>
        {selectedService ? this.handleOpenModal() : null}
      </>
    );
  }
}
const mapStateToProps = state => ({
  serviceReducers: state.serviceReducers,
  labelReducer: state.labelReducer,
  modelInfoReducer: state.modelInfoReducer
});
const mapDispatchToProps = dispatch => ({
  getCannedServiceList: (data) => {
    dispatch(getCannedServiceList(data))
  },
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  getPartDetails: data => {
    dispatch(getInventoryPartsList(data));
  },
  addPartToService: data => {
    dispatch(addPartToService(data));
  },
  addTireToService: data => {
    dispatch(addTireToService(data));
  },
  addInventoryPart: data => {
    dispatch(requestAddPart(data));
  },
  addInventryTire: data => {
    dispatch(addNewTier(data));
  },
  getTireDetails: data => {
    dispatch(getTiersList(data));
  },
  addLaborInventry: data => {
    dispatch(labourAddRequest(data));
  },
  addLaborToService: data => {
    dispatch(addLaborToService(data));
  },
  getLaborDetails: data => {
    dispatch(labourListRequest(data));
  },
  getLabelList: () => {
    dispatch(getLabelList());
  },
  addNewLabel: data => {
    dispatch(addNewLabel(data));
  },
  deleteLabel: data => {
    dispatch(deleteLabel(data));
  },
  getPriceMatrix: data => {
    dispatch(getMatrixList(data));
  },
  getStdList: data => {
    dispatch(getRateStandardListRequest(data));
  },
  addRate: data => {
    dispatch(rateAddRequest(data));
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CannedServiceUpdate));
