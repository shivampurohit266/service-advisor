import React, { Component } from "react";
import { Form, Row, Col, FormGroup, Input, Label } from "reactstrap";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
export class CrmPaymentChequeType extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { 
      payableAmmount, 
      addPayment, 
      date, 
      chequeNumber, 
      notes,
      totalPaiedAmount, 
      handleChange, 
      handleDateChange } = this.props
    return (
      <>
        <div>
          <span className={"text-center text-primary cursor_pointer"} onClick={() => this.props.handlePaymentChange()}>Change Payment Type</span>
        </div>
        <Form onSubmit={addPayment}>
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
              <Col md={"12"}>
                <FormGroup>
                  <Label>Cheque Number</Label>
                  <div className={"input-block"}>
                    <Input
                      value={chequeNumber}
                      onChange={handleChange}
                      placeholder={"1234PE3478TR"}
                      maxLength={"21"}
                      name={"chequeNumber"} />
                  </div>
                </FormGroup>
              </Col>
              <Col md={"12"}>
                <FormGroup>
                  <Label>Notes</Label>
                  <div className={"input-block"}>
                    <Input
                      value={notes}
                      onChange={handleChange}
                      type={"textarea"}
                      cols={"3"}
                      rows={"4"}
                      maxLength={"1000"}
                      name={"notes"} />
                  </div>
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
        </Form>
      </>
    );
  }
}
