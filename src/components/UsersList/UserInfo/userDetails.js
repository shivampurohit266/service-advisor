import React, { Component } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup
} from "reactstrap";
import { CrmUserModal } from "../../common/CrmUserModal";
import DatePicker from 'react-date-picker';

export class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      technicianData: {}
    };
  }
  editUser = (user) => {
    this.setState({ user }, () => {
      this.props.modelOperate({
        editUserModal: true
      });
    });
  };
  /*
  /*  
  */
  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };
  /*
  /*  
  */
  render() {
    const { technicianData, modelInfoReducer } = this.props
    const { modelDetails } = modelInfoReducer;
    const { editUserModal } = modelDetails;
    const { user } = this.state
    return (
      <>
        <div className={"custom-form-modal pt-3"}>
          <Row className="justify-content-center">
            <Col md="6">
              <FormGroup>
                <InputGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    First Name
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="John"
                      disabled
                      value={technicianData.firstName}
                      name="firstName"
                    />
                  </div>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <InputGroup>
                  <Label
                    htmlFor="name"
                    className="customer-modal-text-style"
                  >
                    Last Name
                  </Label>
                  <div className={"input-block"}>
                    <Input
                      type="text"
                      placeholder="Doe"
                      disabled
                      value={technicianData.lastName}
                      name="lastName"
                    />
                  </div>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Email
                </Label>
                <div className={"input-block"}>
                  <Input
                    type="text"
                    placeholder="john.doe@example.com"
                    value={technicianData.email}
                    name="email"
                    disabled
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Phone
                </Label>
                <div className={"input-block"}>
                  <Input
                    name="phone"
                    disabled
                    className="form-control"
                    value={technicianData.phone}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Type
                </Label>
                <div className={"input-block"}>
                  <Input
                    type="text"
                    className="customer-modal-text-style"
                    id="type"
                    disabled
                    // onChange={this.handleInputChange}
                    value={technicianData.roleType === "5ca3473d70537232f13ff1fa" ? "Technician" : "Admin"}
                    name="roleType"
                  >
                  </Input>
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Rate/hour
                </Label>
                <div className={"input-block"}>
                  <InputGroup>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-dollar"></i>
                      </span>
                    </div>
                    <Input
                      value={technicianData.rate}
                      name={"rate"}
                      disabled
                      className={"form-control"}
                    />
                  </InputGroup>
                </div>
              </FormGroup>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  DOB
                </Label>
                <div className={"input-block"}>
                  <DatePicker
                    name="dob"
                    disabled
                    clearIcon={null}
                    // onChange={this.onChangeDob}
                    value={technicianData.dob ? technicianData.dob : null}
                    maxDate={new Date()}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Anniversary
                </Label>
                <div className={"input-block"}>
                  <DatePicker
                    name="anniversary"
                    disabled
                    clearIcon={null}
                    // onChange={this.onChangeAnniversary}
                    value={technicianData.anniversary ? technicianData.anniversary : null}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>
          {/* <Row className={"custom-label-padding "}>
            {roleType
              ? UserPermissions.map((permission, index) => {
                return (
                  <Col sm={"6"} key={index}>
                    <Row
                      className="justify-content-center pb-2"
                      key={index}
                    >
                      <Col md="2">
                        <AppSwitch
                          className={"mx-1"}
                          name={permission.key}
                          checked={permissions[permission.key]}
                          onClick={this.handleClick}
                          variant={"3d"}
                          color={"primary"}
                          size={"sm"}
                        />
                      </Col>
                      <Col md="10">
                        <p className="customer-modal-text-style">
                          {permission.text}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                );
              })
              : null}
          </Row> */}
        </div>
        <div className={"text-center"}>
          <Button onClick={() => this.editUser(technicianData)} className={"btn-theme"}>Update Technician Details</Button>
        </div>
        <CrmUserModal
          userModalOpen={editUserModal}
          handleUserModal={() => {
            this.setState({ user: {} });
            this.props.modelOperate({
              editUserModal: !editUserModal
            });
          }}
          userData={user}
          updateUser={this.onUpdate}
        />
      </>
    );
  }
}
