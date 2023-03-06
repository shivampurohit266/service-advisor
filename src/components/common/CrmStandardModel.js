import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Col,
  FormGroup,
  Input,
  Label,
  InputGroup
} from "reactstrap";
import Validator from "js-object-validation";
import {
  CreateRateValidations,
  CreateRateValidMessaages
} from "../../validations";

export class CrmStandardModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openStadardRateModel: false,
      name: "",
      hourRate: "",
      isSubmitted: false
    };
  }
  /**
   *
   */
  componentDidUpdate({ openStadardRateModel }) {
    if (this.props.openStadardRateModel !== openStadardRateModel) {
      this.setState({
        openStadardRateModel: false,
        name: "",
        hourRate: "",
        isSubmitted: false
      });
    }
  }
  /**
   *
   */
  toggle = () => {
    this.props.stdModelFun();
    this.setState({
      errors: {}
    });
  };
  /**
   *
   */
  handleChange = event => {
    const { name, value } = event.target;
    if (name === "hourRate" && isNaN(value)) {
      return;
    } else {
      this.setState({
        [name]: value
      });
    }
  };
  /**
   *
   */
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      isSubmitted: true
    });
    const data = {
      name: this.state.name.trim(),
      hourRate: this.state.hourRate.trim()
    };
    const { isValid, errors } = Validator(
      data,
      CreateRateValidations,
      CreateRateValidMessaages
    );
    if (!isValid) {
      this.setState({
        errors: errors
      });
      return;
    }
    this.props.handleRateAdd(data);
  };
  /**
   *
   */
  render() {
    const { name, hourRate, errors } = this.state;
    const { openStadardRateModel } = this.props;
    return (
      <>
        <Modal
          isOpen={openStadardRateModel}
          toggle={this.toggle}
          className="customer-modal custom-form-modal "
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggle}>Create New Labor Rate</ModalHeader>
          <ModalBody>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Name <span className="asteric">*</span>
                </Label>
                <div className={"input-block"}>
                  <Input
                    type="text"
                    placeholder="Rate Name"
                    name="name"
                    value={name}
                    maxLength="20"
                    onChange={this.handleChange}
                    id="name"
                  />
                  {errors && !name.trim() && errors.name ? (
                    <p className="text-danger">Name is required</p>
                  ) : null}
                </div>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label htmlFor="name" className="customer-modal-text-style">
                  Hour Rate <span className="asteric">*</span>
                </Label>
                <div className={"input-block"}>
                  <InputGroup>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-dollar" />
                      </span>
                    </div>
                    <Input
                      type="text"
                      name="hourRate"
                      value={hourRate}
                      placeholder="20"
                      onChange={this.handleChange}
                      id="make"
                      maxLength="3"
                    />
                  </InputGroup>
                  {errors && !hourRate.trim() && errors.hourRate ? (
                    <p className="text-danger">Hour rate is required</p>
                  ) : null}
                </div>
              </FormGroup>
            </Col>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>
              Add Labor Rate
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
