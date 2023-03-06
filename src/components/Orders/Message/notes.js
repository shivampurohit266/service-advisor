import React, { Component } from "react";
import {
  UncontrolledTooltip
} from "reactstrap";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import NoDataFound from "../../common/NoFound";
import moment from "moment";
class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageData: "",
      notes: [],
      attachment: {
        itemImagePreview: [],
        itemImage: []
      },
      btnStatus: true
    };
    this.messageDataTextRef = React.createRef();
  }

  componentDidMount = () => {};

  componentDidUpdate = ({ messageReducer, messagesList }) => {};

  deleteNote = async (id, Index) => {
    const { messages } = this.props;
    let indexVal = messages.findIndex(value => value._id === id);
    messages.splice(indexVal, 1);
    const { value } = await ConfirmBox({
      text: "You want to delete this note"
    });
    if (!value) {
      return;
    }

    this.props.newMsgSend(messages);
    const payload = {
      messageId: id,
      isDeleted: true,
      orderId: this.props.orderId
    };
    this.props.deleteNotes(payload)
  };
  // To view file in new window
  viewFile = (filename, type) => {
    let pdfWindow = window.open("");
    pdfWindow.document.body.innerHTML =
      type === "pdf"
        ? "<iframe width='100%' height='100%' src='" + filename + "'></iframe>"
        : "<img src=' " + filename + "' >";
  };

  render() {
    const { messages } = this.props;
    let notes =  messages.filter(value => value ? !value.isDeleted : '');
    notes = notes.filter(value => value.isInternalNotes);
    return (
      <>
        <div className={"message-list mt-5"}>
          {notes && notes.length ? (
            notes.map((ele, Index) => {
              return (
                <div
                  className={
                    ele.senderId === ele.userId && ele.isSender
                      ? "message-tile d-flex flex-row-reverse send "
                      : "message-tile d-flex flex-row  recive "
                  }
                  key={Index}
                >
                  <span
                    className={"text-danger cursor_pointer ml-2 delete-icon"}
                    onClick={e => this.deleteNote(ele._id, Index)}
                    id={`Id-${Index}`}
                  >
                    <i className="fa fa-trash" />
                  </span>
                  <UncontrolledTooltip target={`Id-${Index}`}>
                    Delete this note
                  </UncontrolledTooltip>
                  <div className={"user-name"} id={`userId-${Index}`}>
                    <span>{this.props.companyName.slice(0, 1)}</span>
                  </div>

                  <div className={"flex-1"}>
                    <span className={"sent-date"}>
                      {moment(ele.createdAt || "").format("MMM Do YYYY LT")}
                    </span>
                    <div className={"message-input-block border p-1"}>
                      <p
                        className={"message-input"}
                        id={"messageDataText"}
                        dangerouslySetInnerHTML={{
                          __html: ele ? ele.messageData : ""
                        }}
                      />
                      {/* {ele.messageAttachment &&
                      ele.messageAttachment.itemImagePreview.length ? (
                        <ul className={"attachment-preview-group  p-1"}>
                          {ele.messageAttachment
                            ? ele.messageAttachment.itemImagePreview.map(
                                (imgele, index) => {
                                  const type = imgele.dataURL
                                    .split(";")[0]
                                    .split("/")[1];
                                  return (
                                    <li key={index}>
                                      {type === "pdf" ? (
                                        <span
                                          className={"pdf-img"}
                                          onClick={filename =>
                                            this.viewFile(
                                              imgele.dataURL,
                                              type
                                            )
                                          }
                                        >
                                          <i
                                            className={"fa fa-file-pdf-o"}
                                          />
                                          <span className={"file-name"}>
                                            {imgele.name}
                                          </span>
                                        </span>
                                      ) : (
                                        <span
                                          className={"img-block"}
                                          onClick={filename =>
                                            this.viewFile(
                                              imgele.dataURL,
                                              type
                                            )
                                          }
                                        >
                                          <img
                                            src={imgele.dataURL}
                                            alt={imgele.dataURL}
                                          />
                                        </span>
                                      )}
                                    </li>
                                  );
                                }
                              )
                            : ""}
                        </ul>
                      ) : (
                        ""
                      )} */}
                      <div className="clearfix" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={"text-center"}>
              <NoDataFound message={"No any note added yet!"} />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Notes;
