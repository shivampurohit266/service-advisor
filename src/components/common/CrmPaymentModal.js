import React, { Component } from "react";
import { Modal, ModalBody, ModalHeader, Input, ModalFooter, Button } from "reactstrap";
import { CrmPaymentCardType } from "./CrmPaymentCardType"
import { CrmPaymentCashType } from "./CrmPaymentCashType"
import { CrmPaymentChequeType } from "./CrmPaymentChequeType"

const paymentMethod = [
   {
      icon: "/assets/img/credit-card.svg",
      value: "Card"
   },
   {
      icon: "/assets/img/money.svg",
      value: "Cash"
   },
   {
      icon: "/assets/img/cheque.svg",
      value: "Cheque"
   }
]
export class CrmPaymentModel extends Component {
   constructor(props) {
      super(props);
      this.state = {
         remainingAmmount: 0,
         payableAmount: 0,
         paymentType: "Cash",
         showRemainingAmt: false,
         date: new Date(),
         lastFourDigit: "",
         cardType: "",
         notes: "",
         isDebitCard: false,
         chequeNumber: "",
         errors: {}
      };
   }
   componentDidUpdate = ({ openPaymentModel }) => {
      const { payableAmmount, totalPaiedAmount } = this.props
      if ((openPaymentModel !== this.props.openPaymentModel)) {
         this.setState({
            payableAmount: parseFloat(payableAmmount - totalPaiedAmount).toFixed(2),
            paymentType: "Cash",
            showRemainingAmt: false,
            errors: {}
         })
      }
   }
   handlePaymentChange = () => {
      this.setState({
         remainingAmmount: 0,
         paymentType: "",
         showRemainingAmt: false,
         date: new Date(),
         lastFourDigit: "",
         cardType: "",
         notes: "",
         isDebitCard: false,
         chequeNumber: ""
      })
   }
   handlePaymentType = (name) => {
      this.setState({
         paymentType: name
      })
   }
   handleChange = (e, cardValue) => {
      const { name, value, checked } = e.target;
      if (name === 'lastFourDight' && isNaN(value)) {
         return
      }
      if (checked) {
         this.setState({
            isDebitCard: checked
         })
      } else if (cardValue) {
         this.setState({
            cardType: cardValue
         })
      } else if (name === "payableAmount") {
         if (isNaN(value)) {
            return;
         } else {
            this.setState({
               [name]: value,
               errors: {
                  ...this.state.errors,
                  [name]: null
               }
            })
         }
      } else {
         this.setState({
            [name]: value
         })
      }

   }
   handleDateChange = (date) => {
      this.setState({
         date
      })
   }
   hnadleSubmitPayment = () => {
      const {
         cardType,
         paymentType,
         payableAmount,
         date,
         lastFourDigit,
         notes,
         isDebitCard,
         chequeNumber } = this.state
      const { payableAmmount, orderReducer, totalPaiedAmount } = this.props
      let paymentDetials = {}
      if (paymentType === 'Card') {
         paymentDetials = {
            lastFourDigit: lastFourDigit,
            date: date,
            notes: notes,
            isDebitCard: isDebitCard,
            cardType: cardType
         }

      } else if (paymentType === 'Cash') {
         paymentDetials = {
            date: date,
            notes: notes
         }
      } else {
         paymentDetials = {
            date: date,
            chequeNumber: chequeNumber,
            notes: notes
         }
      }

      if (!payableAmount || payableAmount <= 0) {
         const errors = { ...this.state.errors }
         errors.payableAmount = "Please enter payable Amount."
         this.setState({ errors });
         return;
      }

      const remainingAmount = parseFloat(payableAmmount - totalPaiedAmount).toFixed(2) - parseFloat(payableAmount).toFixed(2)
      let payedAmount = [{ amount: payableAmount, date: new Date() }]
      const payload = {
         orderId: orderReducer.orderItems ? orderReducer.orderItems._id : "",
         paymentType: paymentType,
         payedAmount: payedAmount,
         remainingAmount: remainingAmount,
         isFullyPaid: remainingAmount === 0 ? true : false,
         paymentDetails: paymentDetials,
         customerId: orderReducer.orderItems ? orderReducer.orderItems.customerId ? orderReducer.orderItems.customerId._id : null : null
      }
      this.props.addPaymentRequest(payload)
   }
   render() {
      const {
         openPaymentModel,
         handlePaymentModal,
         payableAmmount,
         totalPaiedAmount
      } = this.props
      const {
         paymentType,
         payableAmount,
         date,
         lastFourDigit,
         cardType,
         isDebitCard,
         notes,
         chequeNumber,
         errors } = this.state;
      return (
         <>
            <Modal
               isOpen={openPaymentModel}
               toggle={handlePaymentModal}
               className={paymentType === '' ? 'customer-modal custom-form-modal' : 'customer-modal custom-form-modal modal-lg'}
               backdrop={"static"}
            >
               <ModalHeader toggle={handlePaymentModal}>
                  {paymentType === '' ? "New Payment" : null}
                  {paymentType === 'Card' ? "Record Card Payment" : null}
                  {paymentType === 'Cash' ? "Record Cash Payment" : null}
                  {paymentType === 'Cheque' ? "Record Cheque Payment" : null}
               </ModalHeader>
               <ModalBody>
                  {
                     paymentType === "" ?
                        <>
                           <div className={"text-center payment-body"}>
                              <div className={"box-contain"}>
                                 <div className={"justify-content-center"}>
                                    <Input className={"text-success"} name={"payableAmount"} onChange={this.handleChange} value={payableAmount} />
                                 </div>
                              </div>
                              <span className={"text-primary cursor_pointer"}>Remaining Due</span>
                           </div>
                           <div className={"d-flex m-3 payment-method"}>
                              {
                                 paymentMethod.map((item, index) => {
                                    return (
                                       <div key={index} onClick={() => this.handlePaymentType(item.value)} className={"box-contain"}>
                                          <div className={"justify-content-center"}>
                                             <img src={item.icon} alt="" />
                                             <div className={"welcome-service-text"}>
                                                {item.value}
                                             </div>
                                          </div>
                                       </div>
                                    )
                                 })
                              }
                           </div>
                        </> :
                        null
                  }
                  {
                     paymentType === "Card" ?
                        <CrmPaymentCardType
                           payableAmmount={payableAmmount}
                           handlePaymentChange={this.handlePaymentChange}
                           date={date}
                           lastFourDigit={lastFourDigit}
                           cardType={cardType}
                           notes={notes}
                           totalPaiedAmount={totalPaiedAmount}
                           isDebitCard={isDebitCard}
                           handleDateChange={this.handleDateChange}
                           handleChange={this.handleChange}
                        /> : null
                  }
                  {
                     paymentType === "Cash" ?
                        <CrmPaymentCashType
                           payableAmmount={payableAmmount}
                           date={date}
                           notes={notes}
                           errors={errors}
                           totalPaiedAmount={totalPaiedAmount}
                           handleDateChange={this.handleDateChange}
                           handleChange={this.handleChange}
                           payableAmount={payableAmount}
                           handlePaymentChange={this.handlePaymentChange}
                        /> : null
                  }
                  {
                     paymentType === "Cheque" ?
                        <CrmPaymentChequeType
                           payableAmmount={payableAmmount}
                           chequeNumber={chequeNumber}
                           date={date}
                           notes={notes}
                           totalPaiedAmount={totalPaiedAmount}
                           handleDateChange={this.handleDateChange}
                           handleChange={this.handleChange}
                           handlePaymentChange={this.handlePaymentChange}
                        /> : null
                  }
               </ModalBody>
               {
                  paymentType !== "" ?
                     <ModalFooter>
                        <Button color="primary" onClick={() => this.hnadleSubmitPayment()}>
                           Record ${parseFloat(payableAmount).toFixed(2) && (parseFloat(payableAmount).toFixed(2)) >= 0 ? parseFloat(payableAmount).toFixed(2) : 0}
                        </Button>{" "}
                        <Button color="secondary" onClick={handlePaymentModal}>
                           Cancel
                        </Button>
                     </ModalFooter> :
                     null
               }
            </Modal>
         </>
      );
   }
}
