import React, { Component } from "react";
import { Row, Col, FormGroup, Input, ButtonGroup, Button, Label, CustomInput } from "reactstrap";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";

export class CrmPaymentCardType extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    const {
      payableAmmount,
      lastFourDigit,
      cardType,
      notes,
      handleChange,
      isDebitCard,
      date,
      totalPaiedAmount,
      handleDateChange } = this.props;
    return (
      <>
        <div>
          <span className={"text-center text-primary cursor_pointer"} onClick={() => this.props.handlePaymentChange()}>Change Payment Type</span>
        </div>
        <div>
          <Row>
            <Col md={"8"}>
              <Col md={"12"}>
                <FormGroup>
                  <Label>Date</Label>
                  <div className={"input-block"}>
                    <SingleDatePicker
                      date={moment(date)} // momentPropTypes.momentObj or null
                      onDateChange={date => handleDateChange(date)} // PropTypes.func.isRequired
                      id="Date" // PropTypes.string.isRequired,
                      focused={this.state.focused} // PropTypes.bool
                      onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                    />
                  </div>
                </FormGroup>
              </Col>
              <Row className={"m-0"}>
                <Col md={"6"}>
                  <FormGroup>
                    <Label>Last 4 digits</Label>
                    <div className={"input-block"}>
                      <Input
                        placeholder={"0000"}
                        maxLength={"4"}
                        value={lastFourDigit}
                        onChange={handleChange}
                        name={"lastFourDigit"}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label for={`debit-card`}>Debit card</Label>
                    <div className={"payment-debit-card"}>
                      <CustomInput value={isDebitCard} id={`debit-card`} onChange={handleChange} name={"isDebitCard"} type={"checkbox"} />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Col md={"12"}>
                <FormGroup>
                  <Label>Card Type</Label>
                  <ButtonGroup >
                    <Button
                      onClick={e => handleChange(e, "marsterCard")}
                      name={"cardType"}
                      className={cardType === "marsterCard" ? 'margin-markup-btn-active' : 'margin-markup-btn'}
                      value={cardType}>
                      Mastercard
                    </Button>
                    <Button
                      onClick={e => handleChange(e, "visa")}
                      name={"cardType"}
                      className={cardType === "visa" ? 'margin-markup-btn-active' : 'margin-markup-btn'}
                      value={cardType}>
                      Visa
                    </Button>
                    <Button
                      onClick={e => handleChange(e, "amex")}
                      name={"cardType"}
                      className={cardType === "amex" ? 'margin-markup-btn-active' : 'margin-markup-btn'}
                      value={cardType}>
                      Amex
                    </Button>
                    <Button
                      onClick={e => handleChange(e, "other")}
                      name={"cardType"}
                      className={cardType === "other" ? 'margin-markup-btn-active' : 'margin-markup-btn'}
                      value={cardType}>
                      Other
                    </Button>
                  </ButtonGroup>
                </FormGroup>
              </Col>
              <Col md={"12"}>
                <FormGroup>
                  <Label>Confirmation</Label>
                  <Input />
                </FormGroup>
              </Col>
              <Col md={"12"}>
                <FormGroup>
                  <Label>Notes</Label>
                  <Input
                    type={"textarea"}
                    cols={"3"}
                    value={notes}
                    onChange={handleChange}
                    name={"notes"}
                    rows={"4"}
                    maxLength={"1000"}
                    placeholder={"notes"} />
                </FormGroup>
              </Col>
            </Col>
            <Col md={"4"}>
              <div className={"remaining-amount-section"}>
                <div className={"w-100 text-right pull-right pr-2 order-total-block"}>
                  <div>Total Due : {parseFloat(payableAmmount).toFixed(2)}</div>
                  <hr />
                  <div>Paid To Date : {parseFloat(totalPaiedAmount).toFixed(2)}</div>
                  <div>Payment Amount : {parseFloat(payableAmmount).toFixed(2)}</div>
                  <div className={"pt-2 border-top mt-2 text-success"}>Remaining Amount: {parseFloat(payableAmmount - totalPaiedAmount).toFixed(2)}</div>
                </div>
                <div className={"clearfix"}></div>
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
