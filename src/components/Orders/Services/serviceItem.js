import React, { Component } from "react";
import {
  Card,
  Col,
  Input,
  FormGroup,
  Row,
  Button,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  FormFeedback,
  UncontrolledTooltip,
} from "reactstrap";
import NoDataFound from "../../common/NoFound";
import CrmDiscountBtn from "../../common/CrmDiscountBtn";
import { toast } from "react-toastify";
import Async from "react-select/lib/Async";
import { LabelColorOptions } from "../../../config/Color"
import { getSumOfArray, calculateValues, calculateSubTotal, serviceTotalsCalculation } from "../../../helpers"
import { CrmCannedServiceModal } from "../../common/CrmCannedServiceModal"
import { ConfirmBox } from "../../../helpers/SweetAlert";
import recommandUser from "../../../assets/recommand-user.png"
import recommandTech from "../../../assets/recommand-tech.png"
import Dollor from "../../common/Dollor"
import InvoiceTable from "../../../containers/Orders/invoiceTable"
import expertIcon from "../../../assets/img/expert.svg";
import notesIcon from "../../../assets/img/writing.svg";

class ServiceItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNote: false,
      openCannedService: false,
      noteIndex: -1,
      customerComment: "",
      userRecommendations: "",
      selectedTechnician: {
        value: "",
        label: "Type to select technician"
      },
      technicianData: {
        label: "Type to select technician",
        value: ""
      },
      services: [
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
      isError: false,
      isServiceSubmitted: false,
      isCannedServiceSumbmit: false
    };
  }
  componentDidMount = () => {
    const {
      services,
      customerUserComment
    } = this.props.serviceReducers
    if (!this.state.isCannedServiceSumbmit) {
      this.setState({
        services,
        customerComment: customerUserComment ? customerUserComment.customerComment : '',
        userRecommendations: customerUserComment ? customerUserComment.userRecommendations : ""
      })
    }
  }
  componentDidUpdate = ({ serviceReducers }) => {
    if (serviceReducers !== this.props.serviceReducers && !this.state.isCannedServiceSumbmit) {
      const {
        services,
        customerUserComment
      } = this.props.serviceReducers
      this.setState({
        services,
        customerComment: customerUserComment ? customerUserComment.customerComment : '',
        userRecommendations: customerUserComment ? customerUserComment.userRecommendations : ""
      }, () => {
        if (this.props.serviceReducers.isAddServiceItem) {
          const serviceList = [...this.state.services]
          this.setState({
            technicianData: {
              label: serviceList && serviceList.length ? serviceList[this.props.serviceReducers.serviceIndex].technician ? `${serviceList[this.props.serviceReducers.serviceIndex].technician.firstName} ${serviceList[this.props.serviceReducers.serviceIndex].technician.lastName}` : 'Type to select technician' : '',
              value: serviceList && serviceList.length ? serviceList[this.props.serviceReducers.serviceIndex].technician ? serviceList[this.props.serviceReducers.serviceIndex].technician._id : '' : ''
            },
            services: serviceList
          })
        }
        return true
      })
    }
  }

  handleClickDiscountType = (value, index, Mindex) => {
    const serviceData = [...this.state.services]
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
      services: serviceData
    })
  }
  handleClickEpaType = (value, index, name) => {
    const serviceData = [...this.state.services]
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
        services: serviceData
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
        services: serviceData
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
    this.props.handleServiceModal(serviceType, index, this.state.services)
  }

  setDiscountValue = (e, Mindex, index) => {
    const { name, value } = e.target
    if (isNaN(value) || value < 0) {
      return
    }
    let serviceData = [...this.state.services]
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
      services: serviceData
    })
  }

  handleCostChange = (e, Mindex, index) => {
    const serviceData = [...this.state.services]
    const { value } = e.target
    if (isNaN(value) || parseFloat(value) < 0 || value === "-0") {
      return;
    } else {
      serviceData[Mindex].serviceItems[index].retailPrice = value
      this.setState({
        services: serviceData
      })
    }
  }
  handleQuantityChange = (e, Mindex, index) => {
    const serviceData = [...this.state.services]
    const { value } = e.target
    if (isNaN(value) || parseFloat(value) < 0 || value === "-0") {
      return;
    }
    else {
      serviceData[Mindex].serviceItems[index].qty = value
      this.setState({
        services: serviceData
      })
    }
  }

  handleHourChange = (e, Mindex, index) => {
    const serviceData = [...this.state.services]
    const { value } = e.target
    serviceData[Mindex].serviceItems[index].hours = value !== "" ? value : 0
    this.setState({
      services: serviceData
    })
  }
  handleChange = (e, index) => {
    const { value, name } = e.target;
    const serviceData = [...this.state.services]
    serviceData[index][name] = value
    this.setState({
      services: serviceData
    })
  }
  loadTechnician = (input, callback) => {
    const type = "5ca3473d70537232f13ff1fa"
    this.props.getUserData({ input, type, callback });
  };
  handleTechnicianAdd = (e, index) => {
    if (e && e.value) {
      const serviceData = [...this.state.services]
      serviceData[index].technician = e.data
      this.setState({
        services: serviceData,
        selectedTechnician: {
          label: e.label,
          value: e.value
        }
      })
    } else {
      const serviceData = [...this.state.services]
      serviceData[index].technician = ""
      this.setState({
        services: serviceData,
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
    if (this.state.services) {
      const services = [...this.state.services]
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
        services
      })
    }
  }

  handleRemoveService = async (index, serviceId) => {
    const { value } = await ConfirmBox({
      text: "Do you want to remove this service?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    const { services } = this.state;
    services[index].isCannedAdded = false
    let t = [...services];
    t.splice(index, 1);

    if (services.length) {
      this.setState({
        services: t
      }, () => {
        if (
          services.length === 1 &&
          index === 0 && this.props.orderReducer.orderItems.serviceId &&
          this.props.orderReducer.orderItems.serviceId.length
        ) {
          const payload = {
            serviceId: [],
            _id: this.props.orderId
          };
          this.props.updateOrderDetails(payload);
        }
      });
      if (serviceId) {
        this.props.deleteService({ serviceId: serviceId })
      }
    }
  };

  handleTaxeButtons = (index, value) => {
    const serviceData = [...this.state.services]
    serviceData[index].isButtonValue = value
    this.setState({
      services: serviceData
    })
  }

  handleRemoveTaxes = (index) => {
    const serviceData = [...this.state.services]
    serviceData[index].isButtonValue = ''
    this.setState({
      services: serviceData
    })
  }

  handleTaxesAdd = (e, index) => {
    const { name, value } = e.target
    if (isNaN(value) || (value < 0)) {
      return
    }
    const serviceData = [...this.state.services]
    if ((parseFloat(value) >= 100) && (serviceData[index].epa.type === '%' || serviceData[index].discount.type === '%' || serviceData[index].taxes.type === '%')) {
      if (!toast.isActive(this.toastId)) {
        this.toastId = toast.error("Enter percentage less than 100");
      }
      return
    }
    serviceData[index][name].value = value
    this.setState({
      services: serviceData
    })
  }
  handleOnChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  handleLabelColorSelect = (color, Mindex, sIndex) => {
    const serviceData = [...this.state.services]
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    serviceData[Mindex].serviceItems[sIndex].label[labelLength - 1].color = color
    this.setState({
      services: serviceData
    })
  }
  handleLabelAdd = (Mindex, sIndex) => {
    const serviceData = [...this.state.services]
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    labelData[labelLength - 1].isAddLabel = true
    this.setState({
      services: serviceData
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
      const serviceData = [...this.state.services]
      const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
      const labelData = serviceData[Mindex].serviceItems[sIndex].label
      labelData[labelLength - 1].name = value
      this.setState({
        services: serviceData
      })
    } else {
      const serviceData = [...this.state.services]
      const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
      const labelData = serviceData[Mindex].serviceItems[sIndex].label
      labelData[labelLength - 1].name = ''
      this.setState({
        services: serviceData
      })
    }
  }

  handleRemoveLabel = (Mindex, sIndex, lIndex) => {
    const serviceData = [...this.state.services]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    labelData.splice(lIndex, 1)
    this.setState({
      services: serviceData
    })
  }
  handleSaveLabel = (Mindex, sIndex) => {
    const serviceData = [...this.state.services]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    const payload = labelData[labelLength - 1]
    this.props.addNewLabel(payload)
  }
  handleAddLabelFromList = (Mindex, sIndex, color, name) => {
    const serviceData = [...this.state.services]
    const labelData = serviceData[Mindex].serviceItems[sIndex].label
    const labelLength = serviceData[Mindex].serviceItems[sIndex].label.length
    labelData[labelLength - 1].color = color
    labelData[labelLength - 1].name = name
    labelData[labelLength - 1].isAddLabel = true
    this.setState({
      services: serviceData
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
    const serviceData = [...this.state.services]
    const serviceItems = serviceData[Mindex].serviceItems
    serviceData[Mindex].serviceSubTotalValue = []
    serviceItems.splice(sIndex, 1)
    this.setState({
      services: serviceData
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
        services: serviceData
      })
    })
  }
  handleServiceSubmit = (serviceData, customerComment, userRecommendations, isShowMsg) => {
    this.setState({
      isServiceSubmitted: true,
      isCannedServiceSumbmit: false
    })
    const HTML = document.getElementById("customers").innerHTML;
    let ele, serviceElelments = [], serviceCalculation
    for (let index = 0; index < serviceData.length; index++) {
      const serviceContent = [...this.state.services]
      ele = serviceContent[index];
      serviceElelments.push({
        serviceId: ele
      })
      if (ele.hasOwnProperty('serviceName') && ele.serviceName === '') {
        serviceContent[index].isError = true
        this.setState({
          services: serviceContent
        })
      } else {
        serviceContent[index].isError = false
        this.setState({
          services: serviceContent
        })
      }
    }
    serviceCalculation = serviceTotalsCalculation(serviceElelments)
    if (ele && ele.serviceName && ele.serviceName !== '') {
      const payload = {
        services: serviceData,
        customerComment: customerComment,
        userRecommendations: userRecommendations,
        orderId: this.props.orderId,
        isServiceSubmit: true,
        orderTotal: serviceCalculation.orderGrandTotal,
        html: HTML,
        isShowMsg: isShowMsg
      };
      this.props.submitServiceDataSuccess(payload)
      const serviceId = []
      payload.services.map((items) => {
        serviceId.push({
          serviceId: items
        })
        return true
      })
      this.props.updateOrderServiceData(serviceId)
      this.props.addNewService(payload)
    }
  }
  handleCannedServiceModal = () => {
    this.setState({
      openCannedService: !this.state.openCannedService
    })
  }

  handleAddCannedService = (serviceData, index) => {
    const services = [...this.state.services]
    if (!serviceData.serviceName) {
      services[index].isError = true
    } else {
      this.setState({
        isCannedServiceSumbmit: true
      })
      services[index].isCannedService = true
      const payload =
      {
        services: [services[index]],
        thisIsCannedService: true
      }

      this.props.addNewCannedService(payload)
    }
    this.setState({
      isServiceSubmitted: true,
      services
    })
  }
  handleCannedAddToService = (services) => {
    const SeriviceData = [...this.state.services]
    SeriviceData.push(services)
    this.handleCannedServiceModal()
    this.setState({
      services: SeriviceData
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
    const { services } = this.state;
    const labelLength = services[index].serviceItems[sIndex].label.length
    return (
      LabelColorOptions.map((item, lIndex) => {
        return (
          <li key={lIndex}>
            <span onClick={() => this.handleLabelColorSelect(item.color, index, sIndex)} style={{
              background: item.color,
              position: "relative", top: "5px"
            }}>
              {
                item.color === (services[index].serviceItems[sIndex].label ? services[index].serviceItems[sIndex].label[labelLength - 1].color : null) ?
                  <i className={"fa fa-check"} /> :
                  null
              }
            </span>
          </li>
        )
      })
    )
  }
  render() {
    const { services, selectedTechnician, customerComment,
      userRecommendations, isServiceSubmitted, openCannedService, technicianData } = this.state
    const {
      labelReducer,
      getCannedServiceList,
      serviceReducers,
      deleteCannedServiceRequest,
      profileInfoReducer,
      orderReducer
    } = this.props;
    return (
      <>
        <div className={"w-100"}>
          <Row className={"comment-section ml-0 mb-3 mt-2"}>
            <Col md={"6"} className={"d-flex pl-0 column"}>
              <span className={"icon"}>
                <img src={recommandUser} alt={"recommandUser"} />
              </span>
              <FormGroup className={"flex-one mb-0"}>
                <Input type={"textarea"} maxLength={"1000"} value={customerComment} name={"customerComment"} onChange={this.handleOnChange} rows={"3"} col={"12"} placeholder={"Customer Comments"} onBlur={
                  () => {
                    this.handleServiceSubmit(services, customerComment, userRecommendations, true)
                  }
                }
                />
              </FormGroup>
            </Col>
            <Col md={"6"} className={"d-flex pr-0 column"}>
              <span className={"icon"}>
                <img src={recommandTech} alt={"recommandTech"} />
              </span>
              <FormGroup className={"flex-one mb-0"}>
                <Input type={"textarea"} maxLength={"1000"} value={userRecommendations} name={"userRecommendations"} onChange={this.handleOnChange} rows={"3"} col={"12"} placeholder={"Recommendations"} onBlur={
                  () => {
                    this.handleServiceSubmit(services, customerComment, userRecommendations, true)
                  }
                }
                />
              </FormGroup>
            </Col>
          </Row>
          <div className={"pb-3"}>
            {
              services && services.length ?
                <Button color={""} onClick={() => this.handleCannedServiceModal()} className={"browse-btn"}>
                  <i className="icons cui-settings"></i> Browse service</Button> : null
            }
          </div>
          {
            services && services.length ? services.map((item, index) => {
              let mainserviceTotal = [], serviceTotal, epa, discount, tax
              const technicianEle = {
                "label": item.technician ? `${item.technician.firstName} ${item.technician.lastName}` : "type to select technician",
                "value": item.technician ? item.technician._id : ""
              }

              return (
                <React.Fragment key={index}>
                  <Card className={"service-card"}>
                    <div className={"custom-form-modal"}>
                      <div
                        className={"service-card-header-block d-flex flex-row"}
                      >
                        <div className={"service-card-header"}>
                          <Input
                            placeholder={"Enter a name for this service"}
                            onChange={e => this.handleChange(e, index)}
                            name={"serviceName"}
                            value={
                              item && item.serviceName ? item.serviceName : ""
                            }
                            maxLength={"100"}
                            invalid={
                              isServiceSubmitted &&
                              item.isError &&
                              !item.serviceName
                            }
                            size={"lg"}
                          />
                          <FormFeedback>
                            {item.isError &&
                              isServiceSubmitted &&
                              !item.serviceName
                              ? "Service name is required."
                              : null}
                          </FormFeedback>
                        </div>
                        <div
                          className={
                            "service-card-btn-block flex-one d-flex align-items-center"
                          }
                        >
                          <div
                            className={
                              ((technicianData.value === null ||
                                technicianData.value === "") &&
                                (item.technician === null ||
                                  item.technician === "")) ||
                                (item.technician === null ||
                                  item.technician === "")
                                ? "pr-1 pl-1 pb-1 mr-3 cursor_pointer notValue d-flex flex-row"
                                : "pb-1 pr-1 pl-1 mr-3 cursor_pointer isValue d-flex flex-row"
                            }
                            id={`tech${index}`}
                          >
                            <img
                              className={""}
                              src={expertIcon}
                              width={"22"}
                              alt={"technician"}
                            />
                            <span className={"pl-2"}>Technician</span>
                          </div>
                          {((technicianData.value === null ||
                            technicianData.value === "") &&
                            (item.technician === null ||
                              item.technician === "")) ||
                            (item.technician === null ||
                              item.technician === "") ? (
                              <UncontrolledTooltip
                                placement="top"
                                target={`tech${index}`}
                              >
                                Assign a technician
                            </UncontrolledTooltip>
                            ) : (
                              <UncontrolledPopover
                                className={"technician-popover"}
                                placement="top"
                                target={`tech${index}`}
                                trigger={"hover"}
                              >
                                <PopoverHeader>Technician Details</PopoverHeader>
                                <PopoverBody>
                                  <div className={"technician-detail"}>
                                    <div
                                      className={
                                        "text-capitalize pb-1 border-bottom"
                                      }
                                    >
                                      {item.technician
                                        ? item.technician.firstName
                                        : ""}{" "}
                                      {item.technician
                                        ? item.technician.lastName
                                        : ""}
                                    </div>
                                    <div className={"pt-1 pb-1"}>
                                      Rate/hour:{" "}
                                      <Dollor
                                        value={
                                          item.technician
                                            ? item.technician.rate
                                            : ""
                                        }
                                      />{" "}
                                    </div>
                                    <div className={"pt-1 text-note"}>
                                      Click below to update Technician{" "}
                                    </div>
                                  </div>
                                </PopoverBody>
                              </UncontrolledPopover>
                            )}
                          <div
                            className={
                              item.note
                                ? "pb-1 cursor_pointer isValue d-flex flex-row"
                                : "pb-1 cursor_pointer notValue d-flex flex-row"
                            }
                            id={`note${index}`}
                          >
                            <img
                              className={""}
                              src={notesIcon}
                              width={"22"}
                              alt={"Notes"}
                            />
                            <span className={"pl-2"}>Notes</span>
                          </div>
                          {item.note ? (
                            <UncontrolledPopover
                              className={"technician-popover"}
                              placement="top"
                              target={`note${index}`}
                              trigger={"hover"}
                            >
                              <PopoverHeader>Note Details</PopoverHeader>
                              <PopoverBody>
                                <div className={"technician-detail"}>
                                  <div
                                    className={
                                      "text-capitalize pb-1 border-bottom"
                                    }
                                  >
                                    {item.note}{" "}
                                  </div>
                                  <div className={"pt-1 text-note"}>
                                    Click below to update note{" "}
                                  </div>
                                </div>
                              </PopoverBody>
                            </UncontrolledPopover>
                          ) : (
                              <UncontrolledTooltip
                                placement="top"
                                target={`note${index}`}
                              >
                                Add note
                            </UncontrolledTooltip>
                            )}

                          <UncontrolledPopover
                            trigger="legacy"
                            placement="bottom"
                            target={`tech${index}`}
                            className={"service-note-popover"}
                          >
                            <Async
                              className={"w-100 form-select"}
                              placeholder={"Type Technician name"}
                              loadOptions={this.loadTechnician}
                              value={
                                item.technician
                                  ? technicianEle
                                  : selectedTechnician
                              }
                              isClearable={
                                technicianEle.value !== "" ? true : false
                              }
                              noOptionsMessage={() => "Type Technician name"}
                              onChange={e =>
                                this.handleTechnicianAdd(
                                  e,
                                  index,
                                  item.technician
                                )
                              }
                            />
                          </UncontrolledPopover>
                          <UncontrolledPopover
                            trigger="legacy"
                            placement="bottom"
                            target={`note${index}`}
                            className={"service-note-popover"}
                          >
                            <Input
                              type={"textarea"}
                              onChange={e => this.handleChange(e, index)}
                              name={"note"}
                              value={item.note}
                              maxLength={"1000"}
                              rows={"5"}
                              cols={"3"}
                              placeholder={"Add Note for this service"}
                            />
                          </UncontrolledPopover>
                        </div>
                      </div>
                      <table className={"table matrix-table service-table"}>
                        <thead>
                          <tr className={"service-table-head"}>
                            <th width="430" className={"pl-3"}>
                              DESCRIPTION
                            </th>
                            <th width="150" className={"text-center"}>
                              PRICE
                            </th>
                            <th width="150" className={"text-center"}>
                              QTY
                            </th>
                            <th width="200" className={"text-center"}>
                              HRS
                            </th>
                            <th width="200" className={""}>
                              DISCOUNT
                            </th>
                            <th width="150" className={"text-center"}>
                              SUBTOTAL
                            </th>
                            <th width="200" className={"text-center"}>
                              STATUS
                            </th>
                            <th width="30" className={"text-center"} />
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.services[index] &&
                            this.state.services[index].serviceItems &&
                            this.state.services[index].serviceItems.length ? (
                              this.state.services[index].serviceItems.map(
                                (service, sIndex) => {
                                  const calSubTotal = calculateSubTotal(
                                    service.retailPrice ||
                                    (service.tierSize && service.tierSize.length
                                      ? service.tierSize[0].retailPrice
                                      : null) ||
                                    0,
                                    service.qty || 0,
                                    service.hours || 0,
                                    service.rate ? service.rate.hourlyRate : 0
                                  );
                                  const subDiscount = calculateValues(
                                    calSubTotal || 0,
                                    service.discount.value || 0,
                                    service.discount.type
                                  );
                                  const servicesSubTotal = (
                                    parseFloat(calSubTotal) -
                                    parseFloat(subDiscount)
                                  ).toFixed(2);
                                  mainserviceTotal.push(
                                    parseFloat(servicesSubTotal)
                                  );
                                  const serviceTotalArray = getSumOfArray(
                                    mainserviceTotal
                                  );
                                  epa = calculateValues(
                                    serviceTotalArray || 0,
                                    item.epa.value || 0,
                                    item.epa.type
                                  );
                                  discount = calculateValues(
                                    serviceTotalArray || 0,
                                    item.discount.value || 0,
                                    item.discount.type
                                  );
                                  tax = calculateValues(
                                    serviceTotalArray || 0,
                                    item.taxes.value || 0,
                                    item.taxes.type
                                  );
                                  serviceTotal = (
                                    parseFloat(serviceTotalArray) +
                                    parseFloat(epa) +
                                    parseFloat(tax) -
                                    parseFloat(discount)
                                  ).toFixed(2);
                                  return (
                                    <tr key={sIndex}>
                                      <td className={"text-capitalize pl-3"}>
                                        <b>{service.serviceType || "-"}</b>:{" "}
                                        {service.description ||
                                          service.brandName ||
                                          service.discription ||
                                          "-"}
                                      </td>
                                      <td>
                                        {(service.cost !== null ||
                                          (service.tierSize &&
                                            service.tierSize.length
                                            ? service.tierSize[0].cost !== null
                                            : null)) &&
                                          service.serviceType !== "labor" ? (
                                            <Input
                                              onChange={e =>
                                                this.handleCostChange(
                                                  e,
                                                  index,
                                                  sIndex
                                                )
                                              }
                                              name={"retailPrice"}
                                              type="text"
                                              maxLength={"4"}
                                              value={
                                                service.retailPrice ||
                                                (service.tierSize &&
                                                  service.tierSize.length
                                                  ? service.tierSize[0]
                                                    .retailPrice
                                                  : null) ||
                                                0
                                              }
                                            />
                                          ) : null}
                                      </td>
                                      <td>
                                        {(service.quantity !== null ||
                                          (service.tierSize &&
                                            service.tierSize.length
                                            ? service.tierSize[0].quantity !==
                                            null
                                            : null)) &&
                                          service.serviceType !== "labor" ? (
                                            <Input
                                              type="text"
                                              onChange={e =>
                                                this.handleQuantityChange(
                                                  e,
                                                  index,
                                                  sIndex
                                                )
                                              }
                                              name={"quantity"}
                                              maxLength={"4"}
                                              value={service.qty || 0}
                                            />
                                          ) : null}
                                      </td>
                                      <td className={"text-center"}>
                                        <div className={"hours-block"}>
                                          {service.hours !== "" &&
                                            service.serviceType === "labor" ? (
                                              <Input
                                                type={"text"}
                                                name={"hour"}
                                                maxLength={"4"}
                                                onChange={e =>
                                                  this.handleHourChange(
                                                    e,
                                                    index,
                                                    sIndex
                                                  )
                                                }
                                                value={service.hours || 0}
                                              />
                                            ) : (
                                              <span className={"no-value"}>
                                                --:--
                                            </span>
                                            )}
                                        </div>
                                      </td>
                                      <td>
                                        <div className={"labor-discount "}>
                                          <div
                                            className={"labor-discount-input"}
                                          >
                                            {service.discount.type === "$" ? (
                                              <div className="input-icon dollar">
                                                <i className={"fa fa-dollar"} />
                                              </div>
                                            ) : null}
                                            <Input
                                              id="discount"
                                              name="discount"
                                              type={"text"}
                                              value={service.discount.value}
                                              onChange={e => {
                                                this.setDiscountValue(
                                                  e,
                                                  index,
                                                  sIndex
                                                );
                                              }}
                                              maxLength="5"
                                              placeholder={"0"}
                                            />
                                            {service.discount.type === "%" ? (
                                              <div className="input-icon percent">
                                                <i
                                                  className={"fa fa-percent"}
                                                />
                                              </div>
                                            ) : null}
                                          </div>
                                          <div
                                            className={
                                              "service-customer-discount"
                                            }
                                          >
                                            <CrmDiscountBtn
                                              index={index + `${sIndex}`}
                                              sIndex={sIndex}
                                              discountType={
                                                service.discount.type
                                              }
                                              handleClickDiscountType={data =>
                                                this.handleClickDiscountType(
                                                  data,
                                                  sIndex,
                                                  index
                                                )
                                              }
                                            />
                                          </div>
                                        </div>
                                      </td>
                                      <td className={"text-center"}>
                                        <span className="dollar-price">
                                          <i className="fa fa-dollar dollar-icon" />
                                          {!isNaN(servicesSubTotal)
                                            ? servicesSubTotal
                                            : 0}
                                        </span>
                                      </td>
                                      <td className={"text-center"}>
                                        {service.label && service.label.length
                                          ? service.label.map(
                                            (label, lIndex) => {
                                              return (
                                                <>
                                                  {label.isAddLabel ? (
                                                    <div>
                                                      <span
                                                        key={lIndex}
                                                        style={{
                                                          background:
                                                            label.color
                                                        }}
                                                        className={
                                                          "status-label-btn"
                                                        }
                                                      >
                                                        {label.name}

                                                        <span
                                                          className={
                                                            "close-icon"
                                                          }
                                                          onClick={() =>
                                                            this.handleRemoveLabel(
                                                              index,
                                                              sIndex,
                                                              lIndex
                                                            )
                                                          }
                                                        >
                                                          <i className="fas fa-times" />
                                                        </span>
                                                      </span>
                                                    </div>
                                                  ) : null}
                                                </>
                                              );
                                            }
                                          )
                                          : null}
                                        <Button
                                          id={`new${sIndex}${index}`}
                                          className={"btn-sm"}
                                          type="button"
                                        >
                                          New +
                                        </Button>
                                        <UncontrolledTooltip
                                          target={`new${sIndex}${index}`}
                                        >
                                          Add Label For{" "}
                                          {`${service.serviceType}`}
                                        </UncontrolledTooltip>
                                        <UncontrolledPopover
                                          trigger="legacy"
                                          placement="bottom"
                                          target={`new${sIndex}${index}`}
                                        >
                                          <PopoverHeader>
                                            <div>
                                              <FormGroup className={"mb-0"}>
                                                <Input
                                                  value={
                                                    service.label[
                                                      service.label.length - 1
                                                    ].name
                                                  }
                                                  onChange={e =>
                                                    this.handleLabelName(
                                                      e,
                                                      index,
                                                      sIndex
                                                    )
                                                  }
                                                  placeholder={
                                                    "Enter a label name."
                                                  }
                                                />
                                                <ul className={"lable-color"}>
                                                  {this.labelColors(
                                                    index,
                                                    sIndex
                                                  )}
                                                </ul>
                                              </FormGroup>
                                              <Button
                                                disabled={
                                                  (service.label
                                                    ? !service.label[
                                                      service.label.length - 1
                                                    ].name
                                                    : null) &&
                                                  (service.label
                                                    ? !service.label[
                                                      service.label.length - 1
                                                    ].isButtonValue
                                                    : null)
                                                }
                                                color="secondary"
                                                className={
                                                  "btn-block btn-round"
                                                }
                                                onClick={() =>
                                                  this.handleLabelAdd(
                                                    index,
                                                    sIndex
                                                  )
                                                }
                                              >
                                                Add Label
                                              </Button>
                                              <Button
                                                disabled={
                                                  (service.label
                                                    ? !service.label[
                                                      service.label.length - 1
                                                    ].name
                                                    : null) &&
                                                  (service.label
                                                    ? !service.label[
                                                      service.label.length - 1
                                                    ].isButtonValue
                                                    : null)
                                                }
                                                color="secondary"
                                                className={
                                                  "btn-block btn-round"
                                                }
                                                onClick={() =>
                                                  this.handleSaveLabel(
                                                    index,
                                                    sIndex
                                                  )
                                                }
                                              >
                                                Add To Saved Label
                                              </Button>
                                            </div>
                                          </PopoverHeader>
                                          <PopoverBody>
                                            {labelReducer.label &&
                                              labelReducer.label.length
                                              ? labelReducer.label.map(
                                                (data, Lindex) => {
                                                  return (
                                                    <div
                                                      className={"d-flex"}
                                                      key={Lindex}
                                                    >
                                                      <Button
                                                        key={Lindex}
                                                        style={{
                                                          background:
                                                            data.labelColor
                                                        }}
                                                        className={
                                                          "btn-sm btn-block label-btn"
                                                        }
                                                        onClick={() =>
                                                          this.handleAddLabelFromList(
                                                            index,
                                                            sIndex,
                                                            data.labelColor,
                                                            data.labelName
                                                          )
                                                        }
                                                        type="button"
                                                      >
                                                        {data.labelName}
                                                      </Button>
                                                      <span
                                                        id={`remove${Lindex}${sIndex}${index}`}
                                                        className={
                                                          "pl-2 mt-2"
                                                        }
                                                        style={{
                                                          cursor: "pointer"
                                                        }}
                                                        onClick={() =>
                                                          this.handleSavedLabelDelete(
                                                            data
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          className={
                                                            "icons cui-trash"
                                                          }
                                                        />
                                                      </span>
                                                      <UncontrolledTooltip
                                                        target={`remove${Lindex}${sIndex}${index}`}
                                                      >
                                                        Remove{" "}
                                                        {data.labelName}
                                                      </UncontrolledTooltip>
                                                    </div>
                                                  );
                                                }
                                              )
                                              : null}
                                          </PopoverBody>
                                        </UncontrolledPopover>
                                      </td>
                                      <td>
                                        <Button
                                          size={""}
                                          id={`Delete${index}${sIndex}`}
                                          onClick={() => {
                                            this.handleRemoveServiceItems(
                                              index,
                                              sIndex
                                            );
                                          }}
                                          className={"btn-theme-transparent"}
                                          color={""}
                                        >
                                          <i className={"fas fa-close"} />
                                        </Button>
                                        <UncontrolledTooltip
                                          target={`Delete${index}${sIndex}`}
                                        >
                                          Remove {`${service.serviceType}`}
                                        </UncontrolledTooltip>
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            ) : (
                              <tr>
                                <td className={"text-center"} colSpan={12}>
                                  <NoDataFound
                                    showAddButton={false}
                                    message={
                                      "Currently there is no item,labor added yet."
                                    }
                                  />
                                  <div
                                    className={
                                      "service-utility-btn no-service-data"
                                    }
                                  >
                                    <Button
                                      color={""}
                                      size={"sm"}
                                      className={"mr-2 btn-link"}
                                      onClick={() =>
                                        this.handleServiceModalOpenAdd(
                                          index,
                                          "part"
                                        )
                                      }
                                    >
                                      <i className="nav-icon icons icon-puzzle" />
                                      &nbsp; Add Part
                                  </Button>
                                    <Button
                                      color={""}
                                      size={"sm"}
                                      className={"mr-2 btn-link"}
                                      onClick={() =>
                                        this.handleServiceModalOpenAdd(
                                          index,
                                          "tire"
                                        )
                                      }
                                    >
                                      <i className="nav-icon icons icon-support" />
                                      &nbsp; Add Tire
                                  </Button>
                                    <Button
                                      color={""}
                                      size={"sm"}
                                      className={"mr-2 btn-link"}
                                      onClick={() =>
                                        this.handleServiceModalOpenAdd(
                                          index,
                                          "labor"
                                        )
                                      }
                                    >
                                      <i className="nav-icon icons icon-user" />
                                      &nbsp; Add Labor
                                  </Button>
                                  </div>
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                    </div>
                    <div
                      className={
                        "p-2 d-flex justify-content-between calculation-section"
                      }
                    >
                      <div
                        className={"position-relative d-flex align-items-end"}
                      >
                        <div className={"tax-calculate-block"}>
                          <div className={"tax-block"}>
                            <span className={"title"}>EPA</span>
                            <div className={"tax-input-block"}>
                              <div className={"input"}>
                                {item.epa && item.epa.type === "$" ? (
                                  <div className="dollor-icon icon">
                                    <i className={"fa fa-dollar"} />
                                  </div>
                                ) : null}
                                <Input
                                  id="EPA"
                                  name="epa"
                                  value={item.epa ? item.epa.value : ""}
                                  onChange={e => {
                                    this.handleTaxesAdd(e, index);
                                  }}
                                  type={"text"}
                                  maxLength="5"
                                  placeholder={"0"}
                                />
                                {item.epa && item.epa.type === "%" ? (
                                  <div className="percent-icons icon">
                                    <i className={"fa fa-percent"} />
                                  </div>
                                ) : null}
                                <CrmDiscountBtn
                                  discountType={
                                    item.epa && item.epa.type
                                      ? item.epa.type
                                      : "%"
                                  }
                                  handleClickDiscountType={data =>
                                    this.handleClickEpaType(data, index, "epa")
                                  }
                                  index={`EPA-${index}`}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={"tax-block"}>
                            <span className={"title"}>Discount</span>
                            <div className={"tax-input-block"}>
                              <div className={"input"}>
                                {item.discount && item.discount.type === "$" ? (
                                  <div className={"dollor-icon icon"}>
                                    <i className={"fa fa-dollar"} />
                                  </div>
                                ) : null}
                                <Input
                                  id="discount"
                                  value={
                                    item.discount ? item.discount.value : ""
                                  }
                                  name="discount"
                                  onChange={e => {
                                    this.handleTaxesAdd(e, index, "epa");
                                  }}
                                  type={"text"}
                                  maxLength="5"
                                  placeholder={"0"}
                                />
                                {item.discount && item.discount.type === "%" ? (
                                  <div className={"percent-icons icon"}>
                                    <i className={"fa fa-percent"} />
                                  </div>
                                ) : null}
                                <CrmDiscountBtn
                                  discountType={
                                    item.discount ? item.discount.type : "%"
                                  }
                                  handleClickDiscountType={data =>
                                    this.handleClickEpaType(
                                      data,
                                      index,
                                      "discount"
                                    )
                                  }
                                  index={`DISC-${index}`}
                                />
                              </div>
                            </div>
                          </div>
                          <div className={"tax-block"}>
                            <span className={"title"}>Tax</span>
                            <div className={"tax-input-block"}>
                              <div className={"input"}>
                                {item.taxes && item.taxes.type === "$" ? (
                                  <div className={"dollor-icon icon"}>
                                    <i className={"fa fa-dollar"} />
                                  </div>
                                ) : null}
                                <Input
                                  name="taxes"
                                  value={item.taxes ? item.taxes.value : ""}
                                  onChange={e => {
                                    this.handleTaxesAdd(e, index);
                                  }}
                                  type={"text"}
                                  maxLength="5"
                                  placeholder={"0"}
                                />
                                {item.taxes && item.taxes.type === "%" ? (
                                  <div className={"percent-icons icon"}>
                                    <i className={"fa fa-percent"} />
                                  </div>
                                ) : null}
                                <CrmDiscountBtn
                                  discountType={
                                    item.taxes ? item.taxes.type : "%"
                                  }
                                  handleClickDiscountType={data =>
                                    this.handleClickEpaType(
                                      data,
                                      index,
                                      "taxes"
                                    )
                                  }
                                  index={`TAX-${index}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={"service-total-block"}>
                        <div className="text-right">
                          <h6>
                            <span className={"title"}>Epa :&nbsp;</span>
                            <span className={"value"}>
                              <span className="dollar-price">
                                + <i className="fa fa-dollar dollar-icon" />
                                {!isNaN(epa) ? parseFloat(epa).toFixed(2) : 0.00}
                              </span>
                            </span>
                          </h6>
                          <h6>
                            <span className={"title"}>Taxes :&nbsp;</span>
                            <span className={"value"}>
                              <span className="dollar-price">
                                + <i className="fa fa-dollar dollar-icon" />
                                {!isNaN(tax) ? parseFloat(tax).toFixed(2) : 0.00}
                              </span>
                            </span>
                          </h6>
                          <h6>
                            <span className={"title"}>Discount :&nbsp;</span>
                            <span className={"value"}>
                              <span className="dollar-price">
                                - <i className="fa fa-dollar dollar-icon" />
                                {!isNaN(discount)
                                  ? parseFloat(discount).toFixed(2)
                                  : 0.00}
                              </span>
                            </span>
                          </h6>
                        </div>
                        <h4 className={"mb-0 border-top pt-2"}>
                          Service Total :{" "}
                          <span className={"dollor-icon"}>
                            ${!isNaN(serviceTotal) ? parseFloat(serviceTotal).toFixed(2) : 0.00}
                          </span>
                        </h4>
                      </div>
                    </div>

                    <div className={"service-card-footer"}>
                      <div className={"service-utility-btn"}>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() =>
                            this.handleServiceModalOpenAdd(index, "part")
                          }
                        >
                          <i className="nav-icon icons icon-puzzle" />
                          &nbsp; Add Part
                        </Button>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() =>
                            this.handleServiceModalOpenAdd(index, "tire")
                          }
                        >
                          <i className="nav-icon icons icon-support" />
                          &nbsp; Add Tire
                        </Button>
                        <Button
                          color={""}
                          size={"sm"}
                          className={"mr-2 btn-link"}
                          onClick={() =>
                            this.handleServiceModalOpenAdd(index, "labor")
                          }
                        >
                          <i className="nav-icon icons icon-user" />
                          &nbsp; Add Labor
                        </Button>
                      </div>
                      <div>
                        <Button
                          className={"mr-3 btn-dashed"}
                          onClick={() =>
                            this.handleAddCannedService(item, index)
                          }
                        >
                          Save as canned service
                        </Button>
                        <Button
                          className="btn btn-remove btn-outline-danger"
                          onClick={() =>
                            this.handleRemoveService(index, item._id)
                          }
                          id={`remove-service-${index}`}
                        >
                          {/* <i className="fa fa-trash" />{" "} */}
                          &nbsp;Remove
                        </Button>
                        <UncontrolledTooltip target={`remove-service-${index}`}>
                          Click to remove this service
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </Card>
                </React.Fragment>
              );
            }) : null
          }
          <div className="d-flex pb-4 justify-content-between">
            <div>
              <Button color={""} onClick={() => this.handleSeviceAdd()} className={"mr-3 browse-btn"} id={"add-service"}>
                <i className="icon-plus icons "></i> Add New Service
            </Button>
              <UncontrolledTooltip placement="top" target={"add-service"}>
                Click to Add a new service
              </UncontrolledTooltip>
              <Button color={""} onClick={() => this.handleCannedServiceModal()} className={"mr-3 browse-btn"} id={"browse-service"}>
                <i className="icons cui-settings"></i> Browse service</Button>
              <UncontrolledTooltip placement="top" target={"browse-service"}>
                Click to browse canned services
              </UncontrolledTooltip>
            </div>
            {
              this.state.services && this.state.services.length ?
                <Button
                  color={""}
                  disabled={serviceReducers.isServiceAdded ? false : true}
                  className={"btn-blue pull-right"}
                  onClick={
                    () => {
                      this.handleServiceSubmit(services, customerComment, userRecommendations)
                    }
                  }>
                  {
                    serviceReducers.isServiceAdded ?
                      "Submit Services" :
                      "Please Wait..."
                  }
                </Button> : null
            }
          </div>
          <CrmCannedServiceModal
            openCannedService={openCannedService}
            handleCannedServiceModal={this.handleCannedServiceModal}
            getCannedServiceList={getCannedServiceList}
            serviceReducers={serviceReducers}
            handleAddToService={this.handleCannedAddToService}
            deleteCannedServiceRequest={deleteCannedServiceRequest}
            {...this.props}
          />

          <div id="customers" className={"invoiceTableCompnent"}>
            <InvoiceTable
              services={services}
              orderReducer={orderReducer}
              vehicleData={orderReducer && orderReducer.orderItems && orderReducer.orderItems.vehicleId ? orderReducer.orderItems.vehicleId : ""}
              profileReducer={profileInfoReducer}
            />
          </div>
        </div>
      </>
    );
  }
}
export default ServiceItem;