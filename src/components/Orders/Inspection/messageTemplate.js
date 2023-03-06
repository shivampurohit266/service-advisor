import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Row,
  Col,
  FormGroup,
  Label
} from "reactstrap";
import { stripHTML } from "../../../helpers";
import { ConfirmBox } from "../../../helpers/SweetAlert";

class MessageTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients: "Rishabh",
      isEditMode: false,
      eleId: "",
      templateListData: [],
      singleTemplateData: {
        templateName: "",
        subject: "",
        messages: ""
      },
      activeIndex: "",
      errors: {},
      selectionVal: {}
    };
  }

  componentDidMount = () => {
    this.props.getMessageTemplate();
  };

  componentDidUpdate = ({ inspectionData }) => {
    let propdata = this.props.inspectionData;
    if (propdata.inspectionData && inspectionData !== propdata) {
      this.setState({
        templateListData: propdata.messageTemplateData
      });
    }
  };

  onKeyUp = e => {
    document.getElementById("messageText");
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);

    range.deleteContents();
    this.setState({
      selectionVal: {
        sel,
        range
      }
    });
  };

  handleChange = e => {
    this.setState({
      singleTemplateData: {
        ...this.state.singleTemplateData,
        [e.target.name]: e.target.value
      },
      errors: {
        ...this.state.errors,
        [e.target.name]: ""
      }
    });
  };

  handleAddtemplate = e => {
    e.preventDefault();
    var subjectValue = document.getElementById("tagInput"),
      subject = subjectValue.textContent;
    var messageTextValue = document.getElementById("messageText"),
      messageText = messageTextValue.innerHTML;
    const { singleTemplateData } = this.state;
    try {
      let errors = {};
      let hasErrors = false;

      if (singleTemplateData.templateName === "") {
        errors.templateName = "Please enter template name.";
        hasErrors = true;
      }
      if (!subject) {
        errors.subject = "Please enter subject for template.";
        hasErrors = true;
      }
      if (hasErrors) {
        this.setState({
          errors
        });
        return;
      }
      const payload = {
        templateName: singleTemplateData.templateName,
        subject,
        messageText
      };
      if (!this.state.isEditMode) {
        this.props.addMessageTemplate(payload);
        this.clearMessageForm();
      } else {
        payload._id = singleTemplateData._id;
        this.props.updateMessageTemplate(payload);
      }
    } catch (error) { }
  };

  handleFocus = id => {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    this.setState({
      eleId: id,
      selectionVal: {
        sel,
        range
      }
    });

    range.deleteContents();
    document.getElementById(id).addEventListener("paste", function (e) {
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    });
  };

  handelTag = (e, label) => {
    let id = this.state.eleId;
    document.getElementById(id);
    const { sel, range } = this.state.selectionVal;

    var text = label; // Textarea containing the text to add to the myInstance1 DIV
    if (window.getSelection) {
      if (sel) {
        // range.deleteContents();

        var lines = text.replace("\r\n", "\n").split("\n");
        //var frag = document.createDocumentFragment();
        var frag = document.createElement("span");
        for (var i = 0, len = lines.length; i < len; ++i) {
          if (i > 0) {
            frag.appendChild(document.createElement("br"));
          }
          frag.appendChild(document.createTextNode(lines[i]));
        }

        range.insertNode(frag);
        sel.modify("move", "right", "word");

      }
    } else if (document.selection && document.selection.createRange) {
      document.selection.createRange().text = text;
    }
  };

  onKeyPress = e => {
    this.setState({
      errors: {
        ...this.state.errors,
        subject: ""
      }
    });
  };

  handleEditTemplate = (e, id, index) => {
    const { templateListData } = this.state;
    let i;
    for (i = 0; i < templateListData.length; i++) {
      if (templateListData[i]._id === id) {
        this.setState({
          singleTemplateData: templateListData[i],
          isEditMode: true,
          activeIndex: index
        });
      }
    }
  };

  handelTemplateDelete = async (e, id) => {
    const { value } = await ConfirmBox({
      text: "Do you want to delete this Template"
    });
    if (!value) {
      return;
    }

    this.props.deleteMessageTemplate(id);
    this.clearMessageForm();
  };

  clearMessageForm = () => {
    var subjectValue = document.getElementById("tagInput");
    var messageTextValue = document.getElementById("messageText");
    this.setState({
      singleTemplateData: {
        templateName: "",
        subject: "",
        messages: ""
      },
      isEditMode: false,
      activeIndex: null
    });
    subjectValue.textContent = "";
    messageTextValue.textContent = "";
  };

  render() {
    const {
      templateListData,
      errors,
      isEditMode,
      singleTemplateData,
      activeIndex
    } = this.state;

    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader>
            <Button className="close" onClick={this.props.toggle}>
              <span aria-hidden="true">×</span>
            </Button>
            Message Template
          </ModalHeader>
          <ModalBody>
            <div className="">
              <Row className="justify-content-center ml-0 pt-4 pb-5">
                <Col md={"5"} sm={"5"}>
                  <h5 className={"pb-2 border-bottom title-h5"}>
                    Template List
                  </h5>
                  <div className={"message-template-block"}>
                    {templateListData && templateListData.length ? (
                      templateListData.map((ele, index) => {
                        return (
                          <div key={index} className={"position-relative"}>
                            <div
                              className={
                                activeIndex === index
                                  ? "template-tile d-flex active"
                                  : "template-tile d-flex"
                              }
                              onClick={e =>
                                this.handleEditTemplate(e, ele._id, index)
                              }
                            >
                              <h5 className={"text-capitalize"}>
                                {ele.templateName || "-"}
                              </h5>
                              <div className={"sub-head"}>
                                <span>Subject</span> -: {ele.subject || "-"}
                              </div>
                              <div className={"text-message"}>
                                {ele.messageText
                                  ? stripHTML(ele.messageText.substring(0, 500))
                                  : "-"}
                              </div>
                            </div>
                            <Button
                              onClick={e =>
                                this.handelTemplateDelete(e, ele._id)
                              }
                              color={""}
                              className={"btn-delete"}
                            >
                              <i className="icons cui-circle-x" />
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <p>No Message Template has been added yet!</p>
                    )}
                  </div>
                </Col>
                <Col md={"7"} sm={"7"}>
                  <h5 className={"text-center mb-4 title-h5"}>
                    {!isEditMode
                      ? "Add New Message Template"
                      : "Edit Message Template"}
                    {isEditMode ? (
                      <Button
                        color={"warning"}
                        size={"sm"}
                        className={"pull-right"}
                        onClick={() =>
                          this.setState({
                            singleTemplateData: {
                              templateName: "",
                              subject: "",
                              messages: ""
                            },
                            isEditMode: false,
                            activeIndex: ""
                          })
                        }
                      >
                        Add New
                      </Button>
                    ) : null}
                  </h5>
                  <Row className="justify-content-center m-0">
                    <Col md="12">
                      <FormGroup>
                        <Label htmlFor="name" className="message-temp-label">
                          Template Name <span className={"asteric"}>*</span>
                        </Label>
                        <div className={"input-block"}>
                          <Input
                            type="text"
                            name="templateName"
                            onChange={e => this.handleChange(e)}
                            placeholder="Ex: Invoice Default"
                            value={singleTemplateData.templateName}
                            maxLength="55"
                            id="recipients"
                            invalid={
                              errors && errors.templateName ? true : false
                            }
                          />
                          {errors && errors.templateName ? (
                            <p className={"text-danger font-italic"}>
                              {errors.templateName}
                            </p>
                          ) : null}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <FormGroup>
                        <Label htmlFor="name" className="message-temp-label">
                          Subject <span className={"asteric"}>*</span>
                        </Label>
                        <div className={"input-block"}>
                          <div className={"input-block message-input-warp"}>
                            <p
                              contentEditable={"true"}
                              onKeyPress={e => this.onKeyPress(e)}
                              onKeyUp={e => this.onKeyUp(e)}
                              className={
                                errors && errors.subject
                                  ? "tagInput mb-0 is-invalid"
                                  : "tagInput mb-0"
                              }
                              id={"tagInput"}
                              onClick={e => this.handleFocus("tagInput")}
                              dangerouslySetInnerHTML={
                                singleTemplateData.subject
                                  ? { __html: singleTemplateData.subject }
                                  : null
                              }
                            />
                          </div>
                          {errors && errors.subject ? (
                            <p className={"text-danger font-italic"}>
                              {errors.subject}
                            </p>
                          ) : null}
                        </div>
                      </FormGroup>
                    </Col>

                    <Col md="12">
                      <FormGroup>
                        <Label htmlFor="name" className="message-temp-label">
                          Message
                        </Label>
                        <div className={"input-block message-input-warp"}>
                          <p
                            suppressContentEditableWarning
                            contentEditable={"true"}
                            className={"message-input"}
                            id={"messageText"}
                            onClick={e => this.handleFocus("messageText")}
                            dangerouslySetInnerHTML={
                              singleTemplateData.messageText
                                ? { __html: singleTemplateData.messageText }
                                : null
                            }
                            onKeyUp={e => this.onKeyUp(e)}
                          />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div className={"tagging-warp text-right"}>
                    <span
                      onClick={e => this.handelTag(e, "{first_name}")}
                      className={"tags"}
                    >
                      Firstname
                    </span>
                    <span
                      onClick={e => this.handelTag(e, "{last_name}")}
                      className={"tags"}
                    >
                      Lastname
                    </span>
                    <span
                      onClick={e => this.handelTag(e, "{year} {make} {model}")}
                      className={"tags"}
                    >
                      Vehicle
                    </span>
                    <span
                      onClick={e => this.handelTag(e, "{year}")}
                      className={"tags"}
                    >
                      Year
                    </span>
                    <span
                      onClick={e => this.handelTag(e, "{make}")}
                      className={"tags"}
                    >
                      Make
                    </span>
                    <span
                      onClick={e => this.handelTag(e, "{model}")}
                      className={"tags"}
                    >
                      Model
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className={"flex-1"}>
              <div className="required-fields">*Fields are Required.</div>
            </div>
            <Button color="primary" onClick={e => this.handleAddtemplate(e)}>
              {!isEditMode ? "Add New Template " : "Update Template"}
            </Button>{" "}
            <Button
              color="secondary"
              onClick={e => {
                this.props.toggle();
                this.clearMessageForm();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default MessageTemplate;
