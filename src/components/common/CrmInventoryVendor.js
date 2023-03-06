import React, { Component } from 'react';
import * as classnames from "classnames";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  FormFeedback,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Validator from "js-object-validation";
import { VendorValidations, VendorValidationMessage } from "../../validations/inventoryVendor";
import { PhoneOptions } from "../../config/Constants";
import MaskedInput from "react-text-mask";
import { isValidURL } from "../../helpers/Object";
import LastUpdated from "../common/LastUpdated";

export class CrmInventoryVendor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
      name: '',
      accountNumber: '',
      url: '',
      contactPerson: {
        firstName: '',
        email: '',
        lastName: '',
        phoneNumber: {
          phone: 'mobile',
          value: ''
        }
      },
      address: {
        address: '',
        city: '',
        state: '',
        zip: ''
      },
      errors: {},
      urlError: ''
    }
  }

  componentDidUpdate = ({ vendorAddModalOpen, vendorData }) => {
    if (vendorAddModalOpen !== this.props.vendorAddModalOpen && !this.props.vendorData) {
      this.resetState();
    }

    if (
      this.props.vendorData && this.props.vendorData._id &&
      (vendorData._id !== this.props.vendorData._id)
    ) {

      const {
        name,
        accountNumber,
        url,
        contactPerson,
        address,
      } = this.props.vendorData

      this.setState({
        isEditMode: true,
        name,
        accountNumber,
        url,
        contactPerson,
        address,
      })
    }
  }
  resetState = () => {
    this.setState({
      name: '',
      accountNumber: '',
      url: '',
      contactPerson: {
        firstName: '',
        email: '',
        lastName: '',
        phoneNumber: {
          phone: 'mobile',
          value: ''
        }
      },
      address: {
        address: '',
        city: '',
        state: '',
        zip: ''
      },
      errors: {},
      urlError: '',
    });
  }

  handleChange = (label, event) => {
    const { name, value } = event.target;
    if ((name === "accountNumber" && isNaN(value)) || (name === "zip" && isNaN(value))) {
      return
    }
    if (label !== '') {
      this.setState(state => {
        return {
          [label]: {
            ...state[label],
            [name]: value
          },
          errors: {
            ...state.errors,
            [name]: ""
          }

        };
      });
    } else {
      this.setState({
        [name]: value
      });
    }

  }
  handlePhoneValueChange = (event) => {
    const { value } = event.target;
    this.setState({
      contactPerson: {
        ...this.state.contactPerson,
        phoneNumber: {
          ...this.state.contactPerson.phoneNumber,
          value: value
        }
      },
      errors: {
        ...this.state.errors,
        phoneNumber: null
      }
    })
  }
  handlePhoneNameChange = (event) => {
    const { value } = event.target;
    this.setState({
      contactPerson: {
        ...this.state.contactPerson,
        phoneNumber: {
          value: "",
          phone: value
        }
      }
    })
  }

  handleAddVendor = e => {
    e.preventDefault();
    const {
      name,
      accountNumber,
      url,
      contactPerson,
      address,
      isEditMode
    } = this.state;
    let validData
    if (contactPerson.email !== '') {
      validData = {
        name: name.trim(),
        accountNumber: accountNumber.trim(),
        email: contactPerson.email.trim()
      }
    } else {
      validData = {
        name: name.trim(),
        accountNumber: accountNumber.trim(),
      }
    }
    if (url && !isValidURL(url)) {
      this.setState({
        urlError: "Please enter Valid URL( http:// )"
      })
    }
    else {
      this.setState({
        urlError: ""
      })
    }
    const data = {
      name,
      accountNumber,
      url,
      contactPerson,
      address
    }
    try {
      let { isValid, errors } = Validator(validData, VendorValidations, VendorValidationMessage);
      if (contactPerson.phoneNumber.value !== "") {
        const phoneTrimed = (contactPerson.phoneNumber.value.replace(/[- )(_]/g, ""))
        if (phoneTrimed.length <= 9) {
          errors.phoneNumber = "Phone number should not be less than ten digit."
          isValid = false;
        }
      }
      if (!isValid || (url && !isValidURL(url))) {
        this.setState({
          errors: errors,
          isLoading: false
        });

        return;
      }
      if (!isEditMode) {
        this.props.addVendor(data);
      }
      const vendorId = this.props.vendorData._id
      this.props.updateVendor(vendorId, data);

    } catch (error) {
      console.log(error)
    }
  };

  render() {
    const { vendorData } = this.props;
    const {
      isEditMode,
      name,
      url,
      accountNumber,
      contactPerson,
      address,
      errors,
      urlError
    } = this.state;

    const phoneOptions = PhoneOptions.map((item, index) => <option key={index} value={item.key}>{item.text}</option>);
    return (
      <>
        <Modal
          isOpen={this.props.vendorAddModalOpen}
          toggle={this.props.handleVendorAddModal}
          backdrop={"static"}
          className='customer-modal custom-form-modal custom-modal-lg'
        >
          <ModalHeader toggle={this.props.handleVendorAddModal}>
            {!isEditMode ? 'Create New Vendor' : `Update Vendor Details`}
            {isEditMode ? <>
              {vendorData && vendorData.updatedAt ?
                <LastUpdated updatedAt={vendorData.updatedAt} />
                : null}
            </> : null}
          </ModalHeader>
          <ModalBody>
            <div className=''>
              <h5 className={"section-divid-head head-top"}>Vendor Details</h5>
              <Row className='justify-content-center'>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Vendor Name <span className={"asteric"}>*</span>
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='name'
                        onChange={
                          (e) => this.handleChange('', e)
                        }
                        placeholder='Bosch'
                        value={name}
                        maxLength='50'
                        id='name'
                        invalid={errors.name && !(name.trim())}
                      />
                      <FormFeedback>
                        {errors.name && !(name.trim()) ? errors.name : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Vendor URL
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='url'
                        onChange={(e) => this.handleChange('', e)}
                        placeholder='http://google.com'
                        value={url}
                        id='name'
                        invalid={urlError && url ? true : false}
                      />
                      <FormFeedback>
                        {urlError && url ? urlError : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Account Number <span className={"asteric"}>*</span>
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='accountNumber'
                        onChange={(e) => this.handleChange('', e)}
                        placeholder='898989898998'
                        value={accountNumber}
                        maxLength='20'
                        id='accountNumber'
                        invalid={errors.accountNumber && !(accountNumber.trim())}
                      />
                      <FormFeedback>
                        {errors.accountNumber && !(accountNumber.trim()) ? errors.accountNumber : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <h5 className={"section-divid-head"}>Contact Person</h5>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      First Name
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='firstName'
                        onChange={(e) => this.handleChange('contactPerson', e)}
                        placeholder='John'
                        value={contactPerson.firstName}
                        maxLength='35'
                        id='name'
                      // invalid={errors.companyName}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Last Name
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='lastName'
                        onChange={(e) => this.handleChange('contactPerson', e)}
                        placeholder='Deo'
                        value={contactPerson.lastName}
                        maxLength='35'
                        id='name'
                      // invalid={errors.companyName}
                      />
                      <FormFeedback>
                        {/* {errors && !companyName && errors.companyName ? "Company name is requiered" : null} */}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Email
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='email'
                        onChange={(e) => this.handleChange('contactPerson', e)}
                        placeholder='john@gmail.com'
                        value={contactPerson.email}
                        id='email'
                        invalid={errors.email}
                      />
                      <FormFeedback>
                        {errors.email ? errors.email : null}
                      </FormFeedback>
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup className={"phone-number-feild"}>
                    <Label htmlFor='contactPhone' className='customer-modal-text-style'>
                      Phone Number
                    </Label>
                    <Input
                      onChange={this.handlePhoneNameChange}
                      type="select"
                      name="phone"
                      value={contactPerson.phoneNumber.phone}
                      id="contactPhone"
                    >
                      {phoneOptions}
                    </Input>
                    <div className={'input-block'}>
                      <MaskedInput
                        mask={contactPerson.phoneNumber.phone === "mobile" ? ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/] : ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', 'ext', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                        // "(111) 111-111 ext 1111"
                        placeholder={contactPerson.phoneNumber.phone === "mobile" ? "(555) 055-0555" : "(555) 055-0555 ext 1234"}
                        name='value'
                        maxLength={contactPerson.phoneNumber.phone === "mobile" ? 14 : 22}
                        guide={false}
                        onChange={this.handlePhoneValueChange}
                        value={contactPerson.phoneNumber.value || null}
                        className={classnames("form-control", {
                          "is-invalid":
                            (errors.phoneNumber !== null && contactPerson.phoneNumber.value !== "")
                        })}
                        size='20'
                        id='phoneNumber'
                      // invalid={errors.phoneNumber}
                      />
                      <FormFeedback>
                        {errors.phoneNumber ? errors.phoneNumber : null}
                      </FormFeedback>

                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <h5 className={"section-divid-head"}>Address</h5>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Address
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='address'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='19 High Noon,West Babylon'
                        value={address.address}
                        maxLength='250'
                        id='address'
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      City
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='city'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='New York'
                        value={address.city}
                        maxLength='35'
                        id='city'
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      State
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='state'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='NY'
                        value={address.state}
                        maxLength='35'
                        id='name'
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md='6'>
                  <FormGroup>
                    <Label htmlFor='name' className='customer-modal-text-style'>
                      Zip
                    </Label>
                    <div className={'input-block'}>
                      <Input
                        type='text'
                        name='zip'
                        onChange={(e) => this.handleChange('address', e)}
                        placeholder='10009'
                        value={address.zip}
                        maxLength='7'
                        id='name'
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className={"flex-1"}>
              <div className="required-fields">*Fields are Required.</div>
            </div>
            <Button
              color='primary'
              onClick={this.handleAddVendor}
            >
              {!isEditMode ? "Add New Vendor " : "Update Vendor"}
            </Button>{' '}
            <Button color='secondary' onClick={this.props.handleVendorAddModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default CrmInventoryVendor;