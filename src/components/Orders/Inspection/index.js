import React, { Component } from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Label,
  Badge,
  UncontrolledTooltip
} from "reactstrap";
import Dropzone from "react-dropzone";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import Templates from "./template";
import SendInspection from "./sentInspect";
import MessageTemplate from "./messageTemplate";
import InspectionTable from "./InspectionPdf";
class Inspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inspection: [],
      inspectionStatus: false,
      modal: false,
      sentModal: false,
      mesageModal: false,
      templateData: [],
      orderDetails: "",
      colorIndex: "",
      selectedOption: "",
      showPDF: false,
      pdfBlob: "",
      inspectDataCheck: false // to check if inspection have data after didupdate
    };
  }

  componentDidMount = () => {
    let propdata = this.props.inspectionData;
    this.setState({
      customerData: this.props.customerData,
      vehicleData: this.props.vehicleData,
      orderDetails: this.props.orderReducer,
      inspection:
        propdata &&
        propdata.inspectionData.data &&
        propdata.inspectionData.data.length
          ? propdata.inspectionData.data
          : []
    });
  };

  componentDidUpdate = ({ inspectionData, customerData, orderReducer }) => {
    let propdata = this.props.inspectionData;
    const { inspectionStatus } = this.state;
    if (
      propdata &&
      propdata.inspectionData &&
      propdata.inspectionData.data &&
      inspectionData !== propdata &&
      !inspectionStatus
    ) {
      this.setState({
        inspection: propdata.inspectionData.data,
        inspectDataCheck: true
      });
    }
    let propsCustomerData = this.props.customerData;
    let propsVehicleData = this.props.vehicleData;
    if (propsCustomerData && propsCustomerData !== customerData) {
      this.setState({
        customerData: propsCustomerData,
        vehicleData: propsVehicleData
      });
    }
    let orderdata = this.props.orderReducer;
    if (orderdata && orderdata !== orderReducer) {
      this.setState({
        orderDetails: orderdata
      });
    }
  
  };
  /**
   *
   */
  handleChange = (e, inspIndex) => {
    const { name, value } = e.target;
    const { inspection } = this.state;
    const item = inspection[inspIndex];
    item[name] = value;
    item.error = false;
    this.setState({
      inspection,
      [e.target.name]: e.target.value
    });
  };
  /**
   *
   */
  handleItemChange = (index, e, inspIndex) => {
    const { name, value } = e.target;
    const { inspection } = this.state;
    const items = inspection[inspIndex].items;
    items[index][name] = value;
    this.setState({
      inspection
    });
  };
  /**
   *
   */
  addInspectionItem = e => {
    const obj = {
      inspectionName: "",
      items: [
        {
          name: "",
          note: "",
          itemImagePreview: [],
          itemImage: [],
          color: "",
          aprovedStatus: false
        }
      ],
      error: false,
      isTemplate: false,
      templateId: null
    };
    this.setState({
      inspection: [...this.state.inspection, obj]
    });
  };
  /**
   *
   */
  removeInspection = async e => {
    const { value } = await ConfirmBox({
      text: "You want to delete this Inspection"
    });
    if (!value) {
      return;
    }
    const { inspection } = this.state;
    let itemList = inspection;

    if (
      e === 0 &&
      inspection[0].items.length === 1 &&
      inspection.length === 1
    ) {
      itemList.splice(e, 1);
      this.setState({ inspection });
      const payload = {
        inspectionId: [],
        _id: this.props.orderId
      };
      this.props.updateOrderDetails(payload);
    } else {
      itemList.splice(e, 1);
      this.setState({ inspection });
    }
  };
  /**
   *
   */
  addItem = inspIndex => {
    const { inspection } = this.state;
    inspection[inspIndex].items.push({
      name: "",
      note: "",
      itemImagePreview: [],
      itemImage: [],
      color: "",
      aprovedStatus: false
    });
    this.setState({
      inspection
    });
  };
  /**
   *
   */
  removeItem = (inspIndex, itemIndex) => {
    const { inspection } = this.state;
    let itemList = inspection[inspIndex].items;
    itemList.splice(itemIndex, 1);
    inspection[inspIndex].items = itemList;
    this.setState({ inspection });
  };
  /**
   *
   */
  removeImage = async (previewindx, itemIndex, inspIndex) => {
    const { value } = await ConfirmBox({
      text: "You want to delete this image"
    });
    if (!value) {
      return;
    }
    const { inspection } = this.state;
    let itemImagePreview =
      inspection[inspIndex].items[itemIndex].itemImagePreview;
    let itemImage = inspection[inspIndex].items[itemIndex].itemImage;
    itemImagePreview.splice(previewindx, 1);
    itemImage.splice(previewindx, 1);
    inspection[inspIndex].items[itemIndex].itemImagePreview = itemImagePreview;
    inspection[inspIndex].items[itemIndex].itemImage = itemImage;
    this.setState({ inspection });
  };
  /**
   *
   */
  handleInspection = e => {
    e.preventDefault();
    const { inspection } = this.state;
    const HTML = document.getElementById("inspectionTable").innerHTML;
    const payload = {
      inspection: inspection,
      orderId: this.props.orderId,
      html: HTML
    };

    const payloadData = {
      inspection,
      orderId: this.props.orderId
    };
    //this.state.inspection.push(0, 0, payloadData);
    try {
      var inspectionArray = [...this.state.inspection];
      let i, ele;
      for (i = 0; i < inspectionArray.length; i++) {
        ele = inspectionArray[i];
        if (ele.hasOwnProperty("inspectionName") && ele.inspectionName === "") {
          ele.error = true;
          this.setState({
            inspectionArray
          });
        }
      }
      if (!ele.error) {
        this.props.addInspcetionToReducer(payloadData.inspection);
        this.props.addNewInspection(payload);
        this.setState({
          // inspection: [],
          inspectionStatus: false
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  /**
   *
   */
  handleOptionChange = (e, inspIndex, itemIndex) => {
    const { inspection } = this.state;
    inspection[inspIndex].items[itemIndex].color = e.target.value;
    this.setState({
      selectedOption: e.target.value,
      inspection
    });
  };
  /**
   *
   */
  handleOptionReset = (e, inspIndex, itemIndex) => {
    const { inspection } = this.state;
    inspection[inspIndex].items[itemIndex].color = "";
    inspection[inspIndex].items[itemIndex].aprovedStatus = false;
    this.setState({
      selectedOption: "",
      inspection
    });
  };
  /**
   *
   */
  handleTemplate = (e, inspIndex, id) => {
    e.preventDefault();
    try {
      var inspectionArray = [...this.state.inspection];
      let ele;
      ele = inspectionArray[inspIndex];
      if (ele.hasOwnProperty("inspectionName") && ele.inspectionName === "") {
        ele.error = true;
        this.setState({
          inspectionArray
        });
        return;
      }
      // To remove _id form object before sent it as payload to API for new template
      let i;
      for (i = 0; i < inspectionArray.length; i++) {
        if (inspectionArray[i]._id) {
          delete inspectionArray[i]._id;
        }
      }
      // To set isTemplate value true
      inspectionArray[inspIndex].isTemplate = true;
      const payload = [inspectionArray[inspIndex]];
      this.setState({
        inspectionStatus: true
      });
      this.props.addInspectionTemplate(payload);
    } catch (error) {
      console.log(error);
    }
  };
  /**
   *
   */
  removeTemplate = async data => {
    try {
      const { value } = await ConfirmBox({
        text: "You want to delete this Template"
      });
      if (!value) {
        return;
      }
      data.isDeleted = true;
      let payload = [];
      payload = [data];
      this.props.addInspectionTemplate(payload);
    } catch (error) {
      console.log(error);
    }
  };
  /**
   *
   */
  addTemplate = data => {
    const dataArray = data;
    let i;
    for (i = 0; i < dataArray.items.length; i++) {
      dataArray.items[i].color = "";
    }
    this.setState({
      inspection: [...this.state.inspection, dataArray],
      modal: false
    });
  };
  /**
   *
   */
  onDrop = async (files, inspIndex, itemIndex) => {
    const { inspection } = this.state;
    if (files.length && files[0].size > 30000000) {
      await ConfirmBox({
        text: "",
        title: "Maximum allowed size for image is 30mb",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
      return;
    }

    let count =
      5 - inspection[inspIndex].items[itemIndex].itemImagePreview.length;
    if (files.length > count) {
      await ConfirmBox({
        text: "",
        title: "Can not upload more than 5 images",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
    } else {
      files.map(async (k, i) => {
        let picReader = new FileReader();
        const that = this;
        let file = files[i];
        await picReader.addEventListener("load", async event => {
          var image = new Image();
          var imageWidth = 0;
          var message = "";
          image.src = event.target.result;

          image.onload = async function() {
            imageWidth = this.width;
            if (imageWidth <= 100 || imageWidth >= 10000) {
              message =
                imageWidth <= 100
                  ? "Allowed image width is minimum 100px."
                  : "Allowed image width is maximum 10000px.";
              await ConfirmBox({
                text: "",
                title: message,
                showCancelButton: false,
                confirmButtonText: "Ok"
              });

              return;
            } else {
              let dataURL = picReader.result;

              inspection[inspIndex].items[itemIndex].itemImagePreview.push({
                dataURL,
                name: file.name
              });
              inspection[inspIndex].items[itemIndex].itemImage.push(file);
              that.setState({
                inspection
              });
            }
          };
        });
        await picReader.readAsDataURL(file);
      });
    }
  };

  onDropRejected = async files => {
    if (files && files.length) {
      await ConfirmBox({
        text: "Allowed type 'JPG', 'JPEG', 'PNG'",
        title: "File type is not allowed",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
    }
  };
  /**
   *
   */
  toggle = e => {
    this.setState({
      modal: !this.state.modal
    });
  };
  /**
   *
   */
  toggleSentInspection = async e => {
    // const {inspectDataCheck} = this.state
    if (!this.props.customerData || !this.props.vehicleData) {
      const { value } = await ConfirmBox({
        title: "Please Select a Customer!",
        text:
          "Please select one of customer details form Customer Selection box",
        type: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Ok"
      });
      if (!value) {
        return;
      }
    } else {
      this.setState({
        sentModal: !this.state.sentModal
      });
    }
  };
  /**
   *
   */
  handleApproval = (e, inspIndex, itemIndex) => {
    const { inspection } = this.state;
    inspection[inspIndex].items[itemIndex].aprovedStatus = !inspection[
      inspIndex
    ].items[itemIndex].aprovedStatus;
    this.setState({
      inspection
    });
  };

  /** */

  toggleMessageTemplate = ele => {
    this.setState({
      mesageModal: !this.state.mesageModal
    });
  };

  downloadPDF = check => {
    const { orderReducer, pdfReducer } = this.props;
    let filename;
    if (pdfReducer && pdfReducer.inspectionUrl !== '') {
      filename =
        pdfReducer && pdfReducer.inspectionUrl ? pdfReducer.inspectionUrl : "";
    } else {
      filename =
        orderReducer && orderReducer.orderItems
          ? orderReducer.orderItems.inspectionURL
          : "";
    }
    let pdfWindow = window.open("");
    pdfWindow.document.body.style.margin = "0px";
    pdfWindow.document.body.innerHTML =
      "<html><title>Inspection</title><body style='margin:0px;'><embed width='100%' height='100%' name='plugin' data='pdf' type='application/pdf' src='" +
      filename +
      "'></embed></body></html>";
  };

  viewFile = (filename, type) => {
    let pdfWindow = window.open("");
    pdfWindow.document.body.innerHTML =
      type === "pdf"
        ? "<iframe width='100%' height='100%' src='" + filename + "'></iframe>"
        : "<img src=' " + filename + "' >";
  };

  render() {
    const { inspection, templateData, orderDetails } = this.state;
    const { orderReducer, inspectionData } = this.props;
    const orderTitle = orderDetails
      ? orderDetails.orderItems.orderName
      : " Untitled";
    return (
      <div>
        <div className={"mb-2 d-flex"}>
          {inspection && inspection.length ? (
            <>
              <span
                color={""}
                className={"print-btn"}
                onClick={this.toggleSentInspection}
              >
                <i className="icons cui-cursor" />
                &nbsp; Send Inspection
              </span>
              <span
                onClick={() => this.downloadPDF(false)}
                id={"add-Appointment"}
                className={"print-btn"}
              >
                <i className="icon-printer icons " />
                &nbsp;{" "}
                {orderReducer.isPdfLoading ? "Printing..." : "View or Print"}
              </span>{" "}
            </>
          ) : null}
        </div>
        <div className={"inspection-add-block"} id={"inspection-add-block"}>
          {inspection && inspection.length
            ? inspection.map((ele, inspIndex) => {
                return (
                  <div className={"inspection-card"} key={inspIndex}>
                    <Card>
                      <div className={"inspection-header"}>
                        <Input
                          type={"text"}
                          value={ele.inspectionName}
                          name={"inspectionName"}
                          bsSize={"lg"}
                          placeholder={
                            "Please Enter a name for this inspection"
                          }
                          onChange={e => this.handleChange(e, inspIndex)}
                          invalid={ele.error}
                          maxLength={75}
                        />
                        {ele.error ? (
                          <p className={"text-danger mb-0"}>
                            Please enter title of Inspection
                          </p>
                        ) : null}
                      </div>
                      <CardBody className={"p-0"}>
                        <div className={"item-warp"}>
                          {ele.items && ele.items.length
                            ? ele.items.map((val, itemIndex) => {
                                return (
                                  <div
                                    className={"d-flex block-item"}
                                    key={itemIndex}
                                  >
                                    <div className={"count-block"}>
                                      <Badge color="secondary">
                                        {itemIndex + 1}
                                      </Badge>
                                    </div>
                                    <Row
                                      key={itemIndex}
                                      className={"ml-0 mr-0"}
                                    >
                                      <Col lg={"9"} md={"9"}>
                                        <Label htmlFor={`item ${itemIndex}`}>
                                          Item Description
                                        </Label>
                                        <div></div>
                                        <div className={""}>
                                          <Input
                                            type="text"
                                            name={"name"}
                                            value={val.name}
                                            placeholder={"Item Title"}
                                            maxLength={"75"}
                                            onChange={e =>
                                              this.handleItemChange(
                                                itemIndex,
                                                e,
                                                inspIndex
                                              )
                                            }
                                          />
                                        </div>
                                        <div className={"mt-2"}>
                                          <Input
                                            type="text"
                                            name={"note"}
                                            value={val.note}
                                            maxLength={"75"}
                                            placeholder={
                                              "Enter Notes and Recommendation"
                                            }
                                            onChange={e =>
                                              this.handleItemChange(
                                                itemIndex,
                                                e,
                                                inspIndex
                                              )
                                            }
                                          />
                                        </div>
                                      </Col>
                                      <Col lg={3} md={3} className={"mt-2 p-0"}>
                                        <div className={"status-warp"}>
                                          {val && val.color ? (
                                            <>
                                              <span
                                                onClick={e =>
                                                  this.handleOptionReset(
                                                    e,
                                                    inspIndex,
                                                    itemIndex
                                                  )
                                                }
                                                id={`reset-${itemIndex}`}
                                                className={"reset-status"}
                                              >
                                                <i
                                                  className={
                                                    "icon-reload icons"
                                                  }
                                                />
                                              </span>
                                              <UncontrolledTooltip
                                                target={`reset-${itemIndex}`}
                                              >
                                                Click to reset item status
                                              </UncontrolledTooltip>
                                            </>
                                          ) : null}
                                          <Label
                                            className={
                                              val.color === "default"
                                                ? "status-checkbox checked default"
                                                : "status-checkbox status-warning"
                                            }
                                          >
                                            <Input
                                              type="radio"
                                              name={`color ${itemIndex}`}
                                              value={"default"}
                                              checked={val.color === "default"}
                                              onChange={e =>
                                                this.handleOptionChange(
                                                  e,
                                                  inspIndex,
                                                  itemIndex
                                                )
                                              }
                                            />{" "}
                                            {/* default */}
                                          </Label>
                                          <Label
                                            className={
                                              val.color === "danger"
                                                ? "status-checkbox checked danger "
                                                : "status-checkbox status-danger"
                                            }
                                          >
                                            <Input
                                              type="radio"
                                              name={`color ${itemIndex}`}
                                              value={"danger"}
                                              checked={val.color === "danger"}
                                              onChange={e =>
                                                this.handleOptionChange(
                                                  e,
                                                  inspIndex,
                                                  itemIndex
                                                )
                                              }
                                            />{" "}
                                            {/* danger */}
                                          </Label>
                                          <Label
                                            className={
                                              val.color === "success"
                                                ? "status-checkbox checked success"
                                                : "status-checkbox status-success"
                                            }
                                          >
                                            <Input
                                              type="radio"
                                              name={`color ${itemIndex}`}
                                              value={"success"}
                                              checked={val.color === "success"}
                                              onChange={e =>
                                                this.handleOptionChange(
                                                  e,
                                                  inspIndex,
                                                  itemIndex
                                                )
                                              }
                                            />{" "}
                                            {/* success */}
                                          </Label>
                                          <span>
                                            {val.color === "success" ||
                                            val.color === "danger" ? (
                                              <>
                                                <Button
                                                  size={"sm"}
                                                  outline
                                                  color={
                                                    val.aprovedStatus
                                                      ? "success"
                                                      : "dark"
                                                  }
                                                  className={"status-btn"}
                                                  onClick={e =>
                                                    this.handleApproval(
                                                      e,
                                                      inspIndex,
                                                      itemIndex
                                                    )
                                                  }
                                                  id={`item-status-${itemIndex}`}
                                                >
                                                  <i
                                                    className={"fa fa-check"}
                                                  />{" "}
                                                  Approved
                                                </Button>
                                                <UncontrolledTooltip
                                                  target={`item-status-${itemIndex}`}
                                                >
                                                  Click to change status of this
                                                  inpection item
                                                </UncontrolledTooltip>
                                              </>
                                            ) : null}
                                          </span>
                                          <span
                                            id={`status-warp-${inspIndex}${itemIndex}`}
                                            className={"info-icon"}
                                          >
                                            <i
                                              className={
                                                "fa fa-question-circle"
                                              }
                                            />
                                          </span>
                                          <UncontrolledTooltip
                                            target={`status-warp-${inspIndex}${itemIndex}`}
                                          >
                                            Define the priority of this
                                            Inspection item by adding
                                            appropriate labels.
                                          </UncontrolledTooltip>

                                          {itemIndex >= 1 ? (
                                            <>
                                              <span
                                                onClick={() => {
                                                  this.removeItem(
                                                    inspIndex,
                                                    itemIndex
                                                  );
                                                }}
                                                color={"danger"}
                                                className={"delete-icon"}
                                                id={`delete-${itemIndex}`}
                                              >
                                                <i className={"fas fa-close"} />
                                              </span>
                                              <UncontrolledTooltip
                                                target={`delete-${itemIndex}`}
                                              >
                                                Delete this Item
                                              </UncontrolledTooltip>
                                            </>
                                          ) : null}
                                        </div>
                                        <div className={"d-flex flex-row"}>
                                          <Dropzone
                                            accept={
                                              "image/jpeg, image/jpg, image/png"
                                            }
                                            rejected={"pdf"}
                                            onDropRejected={this.onDropRejected}
                                            onDrop={files =>
                                              this.onDrop(
                                                files,
                                                inspIndex,
                                                itemIndex
                                              )
                                            }
                                          >
                                            {({
                                              acceptedFiles,
                                              getRootProps,
                                              getInputProps
                                            }) => (
                                              <>
                                                <section className="drop-image-block">
                                                  <div
                                                    {...getRootProps({
                                                      className: "dropzone"
                                                    })}
                                                  >
                                                    <input
                                                      {...getInputProps()}
                                                    />
                                                    <i className="icon-picture icons" />
                                                  </div>
                                                </section>
                                                <div
                                                  className={"drop-image-text"}
                                                >
                                                  Max upload limit 5 files
                                                </div>
                                              </>
                                            )}
                                          </Dropzone>
                                        </div>
                                      </Col>
                                      <Col lg={12} md={12}>
                                        {val.itemImagePreview &&
                                        val.itemImagePreview.length ? (
                                          <ul className={"preview-group  p-0"}>
                                            {val.itemImagePreview.map(
                                              (file, previewindx) => {
                                                const type = "png";
                                                // const type = file.dataURL
                                                //   .split(";")[0]
                                                //   .split("/")[1];
                                                return (
                                                  <li key={previewindx}>
                                                    {type === "pdf" ? (
                                                      <span
                                                        className={
                                                          "position-relative w-100"
                                                        }
                                                      >
                                                        <span
                                                          className={"pdf-img"}
                                                          onClick={filename =>
                                                            this.viewFile(
                                                              file,
                                                              type
                                                            )
                                                          }
                                                        >
                                                          <i
                                                            className={
                                                              "fa fa-file-pdf-o"
                                                            }
                                                          />

                                                          <span
                                                            className={
                                                              "file-name"
                                                            }
                                                          >
                                                            {file.name}
                                                          </span>
                                                        </span>
                                                        <span
                                                          onClick={e => {
                                                            this.removeImage(
                                                              previewindx,
                                                              itemIndex,
                                                              inspIndex
                                                            );
                                                          }}
                                                          className={
                                                            "remove-preview"
                                                          }
                                                        >
                                                          <i className="icon-close icons mr-2" />{" "}
                                                          Remove
                                                        </span>
                                                      </span>
                                                    ) : (
                                                      <>
                                                        <span
                                                          onClick={e => {
                                                            this.removeImage(
                                                              previewindx,
                                                              itemIndex,
                                                              inspIndex
                                                            );
                                                          }}
                                                          className={
                                                            "remove-preview"
                                                          }
                                                        >
                                                          <i className="icon-close icons mr-2" />{" "}
                                                          Remove
                                                        </span>
                                                        <img
                                                          src={
                                                            file && file.dataURL
                                                              ? file.dataURL
                                                              : file
                                                          }
                                                          alt={
                                                            file && file.dataURL
                                                              ? file.dataURL
                                                              : file
                                                          }
                                                          onClick={filename =>
                                                            this.viewFile(
                                                              file &&
                                                                file.dataURL
                                                                ? file.dataURL
                                                                : file,
                                                              type
                                                            )
                                                          }
                                                        />
                                                      </>
                                                    )}
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        ) : null}
                                      </Col>
                                    </Row>
                                  </div>
                                );
                              })
                            : null}
                        </div>

                        <CardFooter>
                          <Button
                            className={"btn-theme"}
                            onClick={() => this.addItem(inspIndex)}
                            id={`add-item-${inspIndex}`}
                            size={"sm"}
                          >
                            {" "}
                            + Add Item
                          </Button>
                          <UncontrolledTooltip target={`add-item-${inspIndex}`}>
                            Click to add new item in this inspection
                          </UncontrolledTooltip>
                          <div
                            className={"pull-right d-flex align-item-center"}
                          >
                            <Button
                              className={"btn-dashed"}
                              onClick={e =>
                                this.handleTemplate(
                                  e,
                                  inspIndex,
                                  ele.templateId
                                )
                              }
                              id={`make-template-${inspIndex}`}
                            >
                              {" "}
                              Save as Template
                            </Button>{" "}
                            <UncontrolledTooltip
                              target={`make-template-${inspIndex}`}
                            >
                              Click to make this Inspection as Template
                            </UncontrolledTooltip>
                            &nbsp;&nbsp;
                            <Button
                              color={"secondary"}
                              className={
                                "pull-right btn-remove btn-outline-danger"
                              }
                              onClick={() => {
                                this.removeInspection(inspIndex);
                              }}
                              id={`delete-${inspIndex}`}
                            >
                              {" "}
                              {/* <i className={"fa fa-trash"} /> */}
                              Remove
                            </Button>
                            <UncontrolledTooltip target={`delete-${inspIndex}`}>
                              Delete this Inspection
                            </UncontrolledTooltip>
                          </div>
                        </CardFooter>
                      </CardBody>
                    </Card>
                  </div>
                );
              })
            : null}

          {inspection.length ? (
            <div className={"mb-3"}>
              {inspectionData && inspectionData.isInspectionLoading ? (
                <Button
                  color={""}
                  className={"mr-3 pull-right btn-blue"}
                  size={"lg"}
                >
                  Submiting..
                </Button>
              ) : (
                <Button
                  color={""}
                  className={"mr-3 pull-right btn-blue"}
                  size={"lg"}
                  onClick={this.handleInspection}
                >
                  Submit Inspection
                </Button>
              )}
            </div>
          ) : null}
          <div className={"d-flex justify-content-center align-items-center"}>
            <span className={""}>
              <Button
                color={""}
                onClick={this.addInspectionItem}
                className={"browse-btn"}
              >
                <i className="icon-eye icons" /> New Inspection
              </Button>
            </span>
            <span className={"pl-2 pr-2"}>
              <i className={"fa fa-plus"} />
            </span>
            <span>
              <Button color={""} onClick={this.toggle} className={"browse-btn"}>
                <i className="icon-plus icons " /> Add Template
              </Button>
            </span>
          </div>
        </div>

        <Templates
          isOpen={this.state.modal}
          addTemplate={this.addTemplate}
          removeTemplate={this.removeTemplate}
          toggle={this.toggle}
          templateData={templateData}
          getTemplateList={this.props.getTemplateList}
          inspectionData={this.props.inspectionData}
        />

        <SendInspection
          isOpen={this.state.sentModal}
          inspectionData={this.props.inspectionData}
          toggle={this.toggleSentInspection}
          toggleMessageTemplate={this.toggleMessageTemplate}
          getMessageTemplate={this.props.getMessageTemplate}
          searchMessageTemplateList={this.props.searchMessageTemplateList}
          customerData={this.props.customerData}
          vehicleData={this.props.vehicleData}
          sendMessageTemplate={this.props.sendMessageTemplate}
          pdfBlob={this.state.pdfBlob}
          orderTitle={orderTitle}
          orderReducer={orderDetails}
          profileReducer={this.props.profileReducer}
        />

        {/* ====== MessageTemplate Modal====== */}
        <MessageTemplate
          isOpen={this.state.mesageModal}
          toggle={this.toggleMessageTemplate}
          inspectionData={this.props.inspectionData}
          addMessageTemplate={this.props.addMessageTemplate}
          getMessageTemplate={this.props.getMessageTemplate}
          updateMessageTemplate={this.props.updateMessageTemplate}
          deleteMessageTemplate={this.props.deleteMessageTemplate}
        />
        {this.props.orderReducer.orderItems &&
        this.props.orderReducer.orderItems.customerId &&
        this.props.orderReducer.orderItems.vehicleId ? (
          <div id={"inspectionTable"} className={"inspectionTable"}>
            <InspectionTable
              inspectData={inspection}
              profileReducer={this.props.profileReducer}
              customerData={this.state.customerData}
              orderReducer={orderDetails}
              vehicleData={this.state.vehicleData}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Inspection;
