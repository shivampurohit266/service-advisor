import React, { Component } from "react";

import {
  Row,
  Col,
  Input,
  Button,
  UncontrolledTooltip,
  FormFeedback,
  FormGroup,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import LastUpdated from "../common/LastUpdated";
import shortUp from "../../assets/img/short-up.svg";
import shortDown from "../../assets/img/short-down.svg";

class PriceMatrixComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditable: false
    };
  }
  render() {
    const {
      matrixRange,
      handleAddBelowMatrixRange,
      handleCostChange,
      handleRemoveMatrixRange,
      handleAddMatrixRange,
      handleAddMatrix,
      matrixName,
      handleChange,
      errors,
      updateDate,
      isEditMatrix,
      addNewMatrix,
      matrixModalOpen,
      handleMatrixModal
    } = this.props;
    return (
      <>
        {addNewMatrix || isEditMatrix ? (
          <>
            <Modal
              isOpen={matrixModalOpen}
              toggle={handleMatrixModal}
              backdrop={"static"}
              className="customer-modal custom-form-modal custom-modal-lg"
            >
              <ModalHeader toggle={handleMatrixModal}>
                {!isEditMatrix
                  ? "Add New Pricing Matrix"
                  : "Update Pricing Matrix"}
                {isEditMatrix && updateDate ? <LastUpdated updatedAt={updateDate} /> : null}
              </ModalHeader>
              <ModalBody>
                <Row>
                  <Col md={"12"}>
                    <div className={"matrix-input"}>
                      <FormGroup className={"matrix-name-input"}>
                        <Label>
                          Matrix Name<span className="asteric">*</span>{" "}
                        </Label>
                        <div className={"input-block"}>
                          <Input
                            name="matrixName"
                            value={matrixName}
                            onChange={e => handleChange(0, e)}
                            maxLength={"40"}
                            placeholder={"Example Matrix A"}
                            invalid={errors.matrixName && !(matrixName.trim())}
                          />
                          <FormFeedback>
                            {errors && errors.matrixName && !(matrixName.trim())
                              ? errors.matrixName
                              : null}
                          </FormFeedback>
                        </div>
                        {/* {
                        isEditMatrix ?
                          <div className={"matrix-action"}>
                            <Button onClick={handleMatrixDelete} className={"btn btn-danger"}>
                              <i className="fas fa-trash" />
                            </Button>
                          </div> :
                          null
                      } */}
                      </FormGroup>
                    </div>
                  </Col>
                </Row>
                <table className={"table matrix-table"}>
                  <thead>
                    <tr>
                      <th width="250" className={"text-center"}>
                        Cost
                      </th>
                      <th width="250" className={"text-center"}>
                        Markup
                      </th>
                      <th width="250" className={"text-center"}>
                        Margin
                      </th>
                      <th className={"text-center"}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrixRange && matrixRange.length
                      ? matrixRange.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              <tr key={index}>
                                <td className={"justify-content-center"}>
                                  <div
                                    className={
                                      "d-flex align-items-center matrix-input-control"
                                    }
                                  >
                                    <div className={"d-inline-block"}>
                                      <Input
                                        className={
                                          "form-control text-center cost-input"
                                        }
                                        name={"costPrice1"}
                                        value={item.lower}
                                        onChange={e =>
                                          handleCostChange(index, e)
                                        }
                                        disabled={
                                          parseFloat(item.lower) === 0.0
                                        }
                                      />
                                    </div>
                                    <span className={"value-sprate"}>
                                      <i className="far fa-window-minimize" />
                                    </span>
                                    <div className={"d-inline-block"}>
                                      <Input
                                        className={
                                          "form-control text-center cost-input"
                                        }
                                        onChange={e =>
                                          handleCostChange(index, e)
                                        }
                                        name={"costPrice2"}
                                        value={item.upper}
                                        maxLength="6"
                                        placeholder={"0.00"}
                                        disabled={item.upper === "beyond"}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className={
                                      "d-flex justify-content-center matrix-input-control"
                                    }
                                  >
                                    <InputGroup className={"markup-input"}>
                                      <Input
                                        className={"form-control text-center "}
                                        value={item.markup}
                                        name="markup"
                                        maxLength="6"
                                        onChange={e => handleChange(index, e)}
                                        placeholder={"100.00"}
                                      />
                                      <div className="input-group-append">
                                        <span className="input-group-text">
                                          <i className="fa fa-percent" />
                                        </span>
                                      </div>
                                    </InputGroup>
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className={
                                      "d-flex justify-content-center matrix-input-control"
                                    }
                                  >
                                    <InputGroup className={"markup-input"}>
                                      <Input
                                        className={"form-control text-center"}
                                        value={item.margin}
                                        name="margin"
                                        maxLength={"6"}
                                        onChange={e => handleChange(index, e)}
                                        placeholder={"100.00"}
                                      />
                                      <div className="input-group-append">
                                        <span className="input-group-text">
                                          <i className="fa fa-percent" />
                                        </span>
                                      </div>
                                    </InputGroup>
                                  </div>
                                </td>
                                <td className={"text-center"}>
                                  <div
                                    className={"d-flex justify-content-center"}
                                  >
                                    <span className={"matrix-drop-down"}>
                                      {index >= 1 ? (
                                        <span
                                          onClick={() =>
                                            handleAddBelowMatrixRange(
                                              index,
                                              "above"
                                            )
                                          }
                                          id={`tooltip-1-${index}`}
                                        >
                                          <span
                                            className={"icon cursor_pointer"}
                                          >
                                            <img
                                              src={shortUp}
                                              width={"20"}
                                              alt={"shortUp"}
                                            />
                                            <UncontrolledTooltip
                                              target={`tooltip-1-${index}`}
                                            >
                                              Add range above
                                            </UncontrolledTooltip>
                                          </span>
                                        </span>
                                      ) : null}

                                      <span
                                        onClick={() =>
                                          handleAddBelowMatrixRange(
                                            index,
                                            "below"
                                          )
                                        }
                                        id={`tooltip-2-${index + 1}`}
                                      >
                                        <span className={"icon cursor_pointer"}>
                                          <img
                                            src={shortDown}
                                            width={"20"}
                                            alt={"shortUp"}
                                          />
                                          <UncontrolledTooltip
                                            target={`tooltip-2-${index + 1}`}
                                          >
                                            Add range below
                                          </UncontrolledTooltip>
                                        </span>
                                      </span>
                                      {index >= 1 ? (
                                        <span className={"icon cursor_pointer"}>
                                          <span
                                            className={
                                              "btn btn-theme-transparent btn-secondary"
                                            }
                                            size={"sm"}
                                            onClick={() =>
                                              handleRemoveMatrixRange(index)
                                            }
                                            id={`tooltip-3-${index + 1}`}
                                          >
                                            <i className="icons cui-trash" />
                                          </span>
                                          <UncontrolledTooltip
                                            target={`tooltip-3-${index + 1}`}
                                          >
                                            Delete
                                          </UncontrolledTooltip>
                                        </span>
                                      ) : null}

                                      {/* 
                                    <UncontrolledDropdown>
                                       <DropdownToggle >
                                        <i className="fas fa-ellipsis-h" />
                                      </DropdownToggle> 
                                      <DropdownMenu>
                                         {index >= 1 ? (
                                          <DropdownItem
                                            onClick={() =>
                                              handleAddBelowMatrixRange(
                                                index,
                                                "above"
                                              )
                                            }
                                          >
                                            Add range above
                                          </DropdownItem>
                                        ) : null} 
                                        <DropdownItem
                                          onClick={() =>
                                            handleAddBelowMatrixRange(index, "below")
                                          }
                                        >
                                          Add range below
                                          </DropdownItem>
                                        {index >= 1 ? (
                                          <DropdownItem>
                                            <span
                                              className={"btn btn-danger btn-round"}
                                              onClick={() =>
                                                handleRemoveMatrixRange(index)
                                              }
                                            >
                                              Delete &nbsp;{" "}
                                              <i className="fas fa-trash" />
                                            </span>
                                          </DropdownItem>
                                        ) : null}
                                      </DropdownMenu>
                                    </UncontrolledDropdown> */}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          );
                        })
                      : null}
                    <tr>
                      <td colSpan="5">
                        <Row className={"m-0"}>
                          <Col md="6" className={"mt-2"}>
                            <span
                              onClick={handleAddMatrixRange}
                              className="customer-add-phone customer-anchor-text customer-click-btn"
                            >
                              Add Range
                            </span>
                          </Col>
                        </Row>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ModalBody>
              <ModalFooter>
                <div className="flex-1">
                  <div className="required-fields">*Fields are Required.</div>
                </div>

                <Button color={"primary"} onClick={() => handleAddMatrix()}>
                  {isEditMatrix ? "Update Matrix" : "Add Matrix"}
                </Button>
                <Button color="secondary" onClick={handleMatrixModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </>
        ) : null}
      </>
    );
  }
}

export default PriceMatrixComponent;
