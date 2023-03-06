import React, { Component } from "react";
import { Form, Row, Col, FormGroup, Input, Label, FormFeedback } from "reactstrap";
import "react-dates/initialize";
import { SingleDatePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from "moment";
export class CrmPaymentCashType extends Component {
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
      notes,
      handleChange,
      payableAmount,
      totalPaiedAmount,
      handleDateChange,
      errors } = this.props
    let remain = (parseFloat(payableAmmount - totalPaiedAmount).toFixed(2)) - (parseFloat(payableAmount).toFixed(2) && parseFloat(payableAmount).toFixed(2) >= 0 ? parseFloat(payableAmount).toFixed(2) : 0);
    return (
      <>
        {/* <div>
          <span className={"text-center text-primary cursor_pointer"} onClick={() => this.props.handlePaymentChange()}>Change Payment Type</span>
        </div> */}
        <Form onSubmit={addPayment}>
          <Row>
            <Col md={"8"}>
              <Col md={"12"}>
                <FormGroup>
                  <Label>Payable Amount</Label>
                  <div className={"input-block"}>
                    <Input className={"text-success"} name={"payableAmount"} onChange={handleChange} value={payableAmount} invalid={errors.payableAmount?true:false} />
                    <FormFeedback>
                      {errors.payableAmount ? errors.payableAmount : null}
                    </FormFeedback>
                  </div>
                </FormGroup>
              </Col>
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
                      numberOfMonths={1}
                      hideKeyboardShortcutsPanel
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col md={"12"}>
                <FormGroup>
                  <Label>Notes</Label>
                  <div className={"input-block"}>
                    <Input value={notes} onChange={handleChange} name={"notes"} type={"textarea"} cols={"3"} rows={"4"} maxLength={"1000"} />
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
                  <div>Payment Amount : {parseFloat(payableAmount).toFixed(2) && (parseFloat(payableAmount).toFixed(2)) >= 0 ? parseFloat(payableAmount).toFixed(2) : 0}</div>
                  <div className={"pt-2 border-top mt-2 text-success"}>Remaining Amount: {isNaN(remain) ? 0.00 : remain.toFixed(2)}</div>
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
