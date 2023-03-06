import React, { Component } from "react";
import HomeHeader from "../HomePage/homeHeader";
import HomeFooter from "../HomePage/homeFooter";
import {
   Card,
   CardBody,
   Collapse
} from "reactstrap";
import Loader from "../../containers/Loader/Loader";
class FaqPageComponent extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isExpand: false,
         index: -1,
      };
   }
   changeState = (index) => {
      this.setState({
         isExpand: this.state.index === index || this.state.index === -1 ? !this.state.isExpand : this.state.isExpand,
         index: this.state.index === index ? -1 : index
      })
   }
   render() {
      const { faqData, settingData, profileInfoReducer } = this.props;
      const { faqPageDetails, isLoading } = faqData;
      const { isExpand } = this.state;
      return (
         <>
            <div>
               <div className="faq-section">
                  <HomeHeader profileInfoReducer={profileInfoReducer} onLogout={e => this.props.onLogout(e)} />
               </div>
               <div >
                  <div className="section">
                     <div className="container" style={{ minHeight: "454px" }}>
                        <h2 className="pb-3 text-center">FAQ's</h2>
                        {!isLoading ? (
                           faqPageDetails && faqPageDetails.length ? (
                              faqPageDetails.map((faq, index) => {
                                 return (
                                    <React.Fragment key={index}>
                                       <Card className="faq-card">
                                          <CardBody id={`faq-${faq._id}`} className="cursor_pointer" onClick={() => this.changeState(index)}>
                                             <div className="faq-card-header d-flex">
                                                <span>{faq.question ? faq.question : ""}</span>
                                                <span
                                                   className={"ml-auto"}
                                                >
                                                   <i className={"icons icon-arrow-" + (isExpand && this.state.index === index  ? "up faqOpen" : "down")} />
                                                </span>
                                             </div>
                                             <div>
                                                <Collapse isOpen={isExpand && this.state.index === index ? true : false}>
                                                   <span className="faq-card-body">{faq.answer ? <div
                                                      dangerouslySetInnerHTML={{
                                                         __html: `${faq.answer}`
                                                      }} className="pl-3 pr-3"/> : ""}</span>
                                                </Collapse>
                                             </div>
                                          </CardBody>
                                       </Card>
                                    </React.Fragment>
                                 )
                              })
                           ) : ""
                        ) : <div className="text-center">
                              <Loader />
                           </div>}
                     </div>
                  </div>
               </div>
               <div>
                  <HomeFooter settingData={settingData} />
               </div>
            </div>
         </>
      )
   }
}
export default FaqPageComponent