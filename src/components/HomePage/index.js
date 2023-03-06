import React, { Component } from "react";
//import { Link } from "react-router-dom";
import "./index.scss"
import bannerImg from "../../assets/home-img/banner-right-img.png";
import HomeHeader from "./homeHeader";
import HomeFooter from "./homeFooter";
import Loader from "../../containers/Loader/Loader";
import {
   Button
} from "reactstrap";
class HomePageComponent extends Component {
   constructor(props) {
      super(props);
      this.state = {
         title: "",
         backgroundClass: "",
         section2Title: "",
         section1: [
            { title: "", subTitle: "", description: "", img: "" }
         ],
         section2: [
            { title: "", description: "", img: "" }
         ],
         section3: [
            { title: "", description: "", video: "" }
         ],
         mobClass: false,
         facebook: "",
         twitter: "",
         instagram: "",
         linkedin: "",
         email: "",
         support_email: "",
         website: "",
         address: "",
         contact: "",
      }
   }

   componentDidMount() {
      window.addEventListener('scroll', this.listenScrollEvent)
   }
   listenScrollEvent = e => {
      if (window.scrollY > 150) {
         this.setState({ backgroundClass: "sticky-header" })
      } else {
         this.setState({ backgroundClass: "" })
      }
   }
   componentDidUpdate = ({ pageData, settingData }) => {
      if (this.props.pageData && this.props.pageData.homePageDetails && this.props.pageData.homePageDetails !== {} && pageData.homePageDetails && this.props.pageData.homePageDetails !== pageData.homePageDetails) {
         const {
            title,
            section2Title,
            section1,
            section2,
            section3,
         } = this.props.pageData.homePageDetails;
         this.setState({
            title,
            section2Title,
            section1,
            section2,
            section3,
         });
      }
      if (this.props.settingData && this.props.settingData.settingDetails && this.props.settingData.settingDetails !== {} && this.props.settingData.settingDetails !== null && settingData.settingDetails && settingData.settingDetails !== this.props.settingData.settingDetails) {
         const {
            facebook,
            twitter,
            instagram,
            linkedin,
            email,
            support_email,
            website,
            contact,
            address
         } = this.props.settingData.settingDetails;
         this.setState({
            facebook,
            twitter,
            instagram,
            linkedin,
            email,
            support_email,
            website,
            contact,
            address

         })
      }
   };

   handleMobileToggle = () => {
      this.setState({
         mobClass: !this.state.mobClass
      })
   }
   validateYouTubeUrl = (url) => {
      let result = "";
      if (url !== undefined || url !== '') {
         var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=|\?v=)([^#]*).*/;
         var match = url.match(regExp);
         if (match && match[2].length === 11) {
            // Do anything for being valid
            // if need to change the url to embed url then use below line            
            result = ('https://www.youtube.com/embed/' + match[2] + '?autoplay=0&enablejsapi=1');
         }
      }
      return result
   };
   onGoPage = (pageUrl) => {
      //this.props.onGoPage(pageUrl);
      window.open(pageUrl);
   };
   handleOpenEnquiryModal = () => {
      const { modelDetails } = this.props.modelInfoReducer;
      let data = {
         enquiryModalOpen: !modelDetails.enquiryModalOpen
      };
      this.props.modelOperate(data);
   }
   render() {
      const {
         section2Title,
         section1,
         section2,
         section3,
      } = this.state;
      const {
         settingData,
         profileInfoReducer,
         pageData,
         modelOperate,
         enquiryModalOpen,
         modelInfoReducer,
         enquiryRequest } = this.props;
      const { isLoading } = pageData
      return (
         <>
            {!isLoading ? <>
               <div className="main-body home-page">
                  <HomeHeader
                     modelOperate={modelOperate}
                     enquiryModalOpen={enquiryModalOpen}
                     profileInfoReducer={profileInfoReducer}
                     modelInfoReducer={modelInfoReducer}
                     enquiryRequest={enquiryRequest}
                     onLogout={e => this.props.onLogout(e)} />
                  <section className="banner">
                     <div className="container">
                        <div className="row align-items-center">
                           <div className="col-sm-6">
                              <div className="banner-left-section">
                                 <div className="banner-left-content">
                                    <h1>The Smart & Simple way to Run Your Auto Shop.</h1>
                                    <p>With the easy to use and customizable CRM for your marketing, sales, and customer service teams.</p>
                                    <Button
                                       onClick={this.handleOpenEnquiryModal} /*onClick={() => this.onGoPage('/dev/register')}*/
                                       className="btn btn-theme btn-trail"
                                    >
                                       Request Early Access
                                    </Button>
                                 </div>
                              </div>
                           </div>
                           <div className="col-sm-6">
                              <div className="banner-right-img">
                                 <img src={bannerImg} alt="" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>
                  <section className="main-content main-info-section">
                     <div className="">
                        {section1 && section1.length ? section1.map((data, index) => {
                           let title = (data.title).split(" ");
                           return (
                              <React.Fragment key={index}>
                                 {index % 2 === 0 ? (
                                    <div className="row align-items-center pt-3 mob-row">
                                       <div className="col-sm-7">
                                          <div className="content-wrap text-right pr-5">
                                             <div className="main-heading-wrap">
                                                <p>
                                                   {data.subTitle ? data.subTitle : ""}
                                                </p>
                                                <h2>
                                                   {title.map((value, index) => {
                                                      return (
                                                         <React.Fragment key={index}>
                                                            {index < title.length - 1 ? (
                                                               <span>{value} </span>
                                                            ) : (
                                                                  <span className="heading-highlighter">
                                                                     {value}
                                                                  </span>
                                                               )}
                                                         </React.Fragment>
                                                      );
                                                   })}{" "}
                                                </h2>
                                             </div>
                                             <p className="padding-left">
                                                {data.description ? (
                                                   <div className="d-inline-block"
                                                      dangerouslySetInnerHTML={{
                                                         __html: `${data.description}`
                                                      }}
                                                   />
                                                ) : (
                                                      ""
                                                   )}
                                             </p>
                                          </div>
                                       </div>
                                       <div className="col-sm-5">
                                          <div className="content-img-wrap">
                                             <img
                                                src={data.img}
                                                alt=""
                                                className="right-img"
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 ) : (
                                       <div className="row align-items-center pt-3">
                                          <div className="col-sm-5">
                                             <div className="content-img-wrap d-flex justify-content-end">
                                                <img
                                                   src={data.img}
                                                   alt=""
                                                   className="left-img"
                                                />
                                             </div>
                                          </div>
                                          <div className="col-sm-7">
                                             <div className="content-wrap text-left pl-5">
                                                <div className="main-heading-wrap">
                                                   <p>
                                                      {data.subTitle ? data.subTitle : ""}
                                                   </p>
                                                   <h2>
                                                      {title.map((value, index) => {
                                                         return (
                                                            <React.Fragment key={index}>
                                                               {index < title.length - 1 ? (
                                                                  <span>{value} </span>
                                                               ) : (
                                                                     <span className="heading-highlighter">
                                                                        {value}
                                                                     </span>
                                                                  )}
                                                            </React.Fragment>
                                                         );
                                                      })}{" "}
                                                   </h2>
                                                </div>
                                                <p className="padding-right">
                                                   {data.description ? (
                                                      <div className="d-inline-block"
                                                         dangerouslySetInnerHTML={{
                                                            __html: `${data.description}`
                                                         }}
                                                      />
                                                   ) : (
                                                         ""
                                                      )}
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                    )}
                              </React.Fragment>
                           );
                        }) : null}
                     </div>
                  </section>
                  <section className="our-features-section" id="our-features">
                     <div className="container">
                        <div className="main-heading-wrap text-center">
                           <h2>Our <span className="heading-highlighter">Features</span></h2>
                           <p>{section2Title ? section2Title : ""}</p>
                        </div>
                        {section2 && section2.length ? section2.map((data, index) => {
                           return (
                              <React.Fragment key={index}>
                                 {index % 2 === 0 ?
                                    <div className="row align-items-center p-3 text-right mob-row">
                                       <div className="col-sm-6">
                                          <h3>{data.title ? data.title : ""}</h3>
                                          <p>{data.description ? <div className="d-inline-block"
                                             dangerouslySetInnerHTML={{
                                                __html: `${data.description}`
                                             }} /> : ""}</p>
                                       </div>
                                       <div className="col-sm-6">
                                          <img src={data.img} alt="" />
                                       </div>
                                    </div>
                                    :
                                    <div className="row align-items-center p-3 text-left">
                                       <div className="col-sm-6">
                                          <img src={data.img} alt="" />
                                       </div>
                                       <div className="col-sm-6">
                                          <h3>{data.title ? data.title : ""}</h3>
                                          <p>{data.description ? <div className="d-inline-block"
                                             dangerouslySetInnerHTML={{
                                                __html: `${data.description}`
                                             }} /> : ""}</p>
                                       </div>
                                    </div>
                                 }
                              </React.Fragment>
                           )
                        })
                           : null}
                        <div className="our-features-note">
                           <h4 className="text-center">Invoicing, Inspections, CRM, Texting, Workflow and much more...!</h4>
                        </div>
                     </div>
                  </section>
                  <section className="main-content why-choose-section" >
                     <div className="container">
                        {section3 && section3.length ? section3.map((data, index) => {
                           let title = (data.title).split(" ");
                           return (
                              <React.Fragment key={index}>
                                 <div className="main-heading-wrap text-center">
                                    <h2>{title.map((value, index) => {
                                       return (
                                          <React.Fragment key={index}>
                                             {index < (title.length - 1) ? <span>{value} </span> : <span className="heading-highlighter">{value}</span>}
                                          </React.Fragment>
                                       )
                                    })} </h2>
                                    {data.description ? <div className="d-inline-block"
                                       dangerouslySetInnerHTML={{
                                          __html: `${data.description}`
                                       }} /> : ""}
                                 </div>
                                 <div className="text-center pt-3">
                                    {data.video && data.video.length ?
                                       <div className={"video-block"}><iframe width="800" title={index} height="415" src={data.video && data.video.length ? this.validateYouTubeUrl(data.video) : ""} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" >
                                          <p>Your browser does not support iframes.</p>
                                       </iframe></div>
                                       : null}
                                 </div>
                              </React.Fragment>
                           )
                        }) : null}
                     </div>
                  </section>
                  <section className="main-content" >
                     <div className="container">
                        <div className="get-started-wrap">
                           <div className="get-started">
                              <div className="get-started-left">
                                 <h3>Get Started for <span className="heading-highlighter">Free</span></h3>
                                 <p className={"mb-0"}>No Contracts. No hidden fees. Get started in minutes. </p>
                              </div>
                              <div className="get-started-right">
                                 <Button
                                    onClick={this.handleOpenEnquiryModal}
                                    /*onClick={() => this.onGoPage('/register')}*/ className="btn btn-theme">Request Early Access
                              </Button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>
                  <HomeFooter settingData={settingData} />
               </div>
            </> :
               <section className="main-content" >
                  <div className="container" style={{ marginTop: "200px" }}>
                     <Loader />
                  </div>
               </section>
            }
         </>
      )
   }
}
export default HomePageComponent