import React, { Component } from "react";
import "./index.scss"
import logoImg from "../../assets/home-img/logo.png"
import bannerImg from "../../assets/home-img/banner-right-img.png";
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
         ]
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
   componentDidUpdate = ({ pageData }) => {
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
   };
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
      window.open(pageUrl, "_blank");
   };
   render() {
      const { section2Title, section1, section2, section3, backgroundClass } = this.state;

      return (
         <>
            <div className="main-body">
               <nav class={`navbar navbar-expand-md navbar-dark main-header fixed-top ${backgroundClass}`} id="banner">
                  <div class="container">
                     <a class="navbar-brand" href="#"><img src={logoImg} alt="" /></a>
                     <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span class="navbar-toggler-icon"></span>
                     </button>
                     <div class="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul class="navbar-nav ml-auto">
                           <li class="nav-item">
                              <a class="nav-link1 active" href="#"><span>Home</span></a>
                           </li>
                           <li class="nav-item">
                              <a class="nav-link1" href="#our-features"><span>Features</span></a>
                           </li>
                           <li class="nav-item">
                              <a class="nav-link1" href="#"><span>Pricing</span></a>
                           </li>
                           <li class="nav-item">
                              <a class="nav-link1" href="#"><span>About Us</span></a>
                           </li>
                           <li class="nav-item">
                              <a class="nav-link1 cursor_pointer" onClick={() => this.onGoPage('/login')}><span>Sign In</span></a>
                           </li>
                        </ul>
                        <div onClick={() => this.onGoPage('/signup')} class="btn btn-primary">Start Free Trial</div>
                     </div>
                  </div>
               </nav>
               <section class="banner">
                  <div class="container">
                     <div class="row align-items-center">
                        <div class="col-sm-6">
                           <div class="banner-left-section">
                              <div class="banner-left-content">
                                 <h1>The Smart & Simple way to Run Your Auto Shop.</h1>
                                 <p>With the easy to use and customizable CRM for your marketing, sales, and customer service teams.</p>
                                 <div onClick={() => this.onGoPage('/signup')} class="btn btn-primary">Start Free Trial</div>
                              </div>
                           </div>
                        </div>
                        <div class="col-sm-6">
                           <div class="banner-right-img">
                              <img src={bannerImg} alt="" />
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               <section class="main-content">
                  <div class="container">
                     {section1 && section1.length ? section1.map((data, index) => {
                        let title = (data.title).split(" ");
                        return (
                           <React.Fragment key={index}>
                              {index % 2 === 0 ?
                                 <div class="row align-items-center pt-3">
                                    <div class="col-sm-7">
                                       <div class="content-wrap text-right">
                                          <div class="main-heading-wrap">
                                             <p>{data.subTitle ? data.subTitle : ""}</p>
                                             <h2>{title.map((value, index) => { return index < (title.length - 1) ? <span>{value} </span> : <span class="heading-highlighter">{value}</span> })} </h2>
                                          </div>
                                          <p class="padding-left">{data.description ? <div
                                             dangerouslySetInnerHTML={{
                                                __html: `${data.description}`
                                             }} /> : ""}</p>
                                       </div>
                                    </div>
                                    <div class="col-sm-5">
                                       <div class="content-img-wrap">
                                          <img src={data.img} alt="" class="right-img" />
                                       </div>
                                    </div>
                                 </div>
                                 :
                                 <div class="row align-items-center pt-3">
                                    <div class="col-sm-5">
                                       <div class="content-img-wrap">
                                          <img src={data.img} alt="" class="left-img" />
                                       </div>
                                    </div>
                                    <div class="col-sm-7">
                                       <div class="content-wrap text-left">
                                          <div class="main-heading-wrap">
                                          <p>{data.subTitle ? data.subTitle : ""}</p>
                                             <h2>{title.map((value, index) => { return index < (title.length - 1) ? <span>{value} </span> : <span class="heading-highlighter">{value}</span> })} </h2>
                                          </div>
                                          <p class="padding-right">{data.description ? <div
                                             dangerouslySetInnerHTML={{
                                                __html: `${data.description}`
                                             }} /> : ""}</p>
                                       </div>
                                    </div>
                                 </div>
                              }
                           </React.Fragment>
                        )
                     }) : null}
                  </div>
               </section>
               <section class="our-features-section" id="our-features">
                  <div class="container">
                     <div class="main-heading-wrap text-center">
                        <h2>Our <span class="heading-highlighter">Features</span></h2>
                        <p>{section2Title ? section2Title : ""}</p>
                     </div>
                     {section2 && section2.length ? section2.map((data, index) => {
                        return (
                           <React.Fragment key={index}>
                              {index % 2 === 0 ?
                                 <div class="row align-items-center p-3 text-right">
                                    <div class="col-sm-6">
                                       <h3>{data.title ? data.title : ""}</h3>
                                       <p>{data.description ? <div
                                          dangerouslySetInnerHTML={{
                                             __html: `${data.description}`
                                          }} /> : ""}</p>
                                    </div>
                                    <div class="col-sm-6">
                                       <img src={data.img} alt="" />
                                    </div>
                                 </div>
                                 :
                                 <div class="row align-items-center p-3 text-left">
                                    <div class="col-sm-6">
                                       <img src={data.img} alt="" />
                                    </div>
                                    <div class="col-sm-6">
                                       <h3>{data.title ? data.title : ""}</h3>
                                       <p>{data.description ? <div
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
                  </div>
               </section>
               <section class="main-content" style={{ padding: "30px" }}>
                  <div class="container">
                     {section3 && section3.length ? section3.map((data, index) => {
                        return (
                           <React.Fragment key={index}>
                              <div class="zmain-heading-wrap text-center">
                                 <h2>Why Choose <span class="heading-highlighter">Service Advisor</span></h2>
                                 <p>{data.description ? <div
                                    dangerouslySetInnerHTML={{
                                       __html: `${data.description}`
                                    }} /> : ""}</p>
                              </div>
                              <div class="text-center pt-3">
                                 {data.video && data.video.length ?
                                    <iframe width="560" title={index} height="315" src={data.video && data.video.length ? this.validateYouTubeUrl(data.video) : ""} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" >
                                       <p>Your browser does not support iframes.</p>
                                    </iframe>
                                    : null}
                              </div>
                           </React.Fragment>
                        )
                     }) : null}
                  </div>
               </section>
               <section class="main-content" style={{ padding: "50px", position: "relative" }}>
                  <div class="container">
                     <div class="row align-items-center text-center">
                        <div class="col-sm-7">
                           <h3>Get Started for <span class="heading-highlighter">Free</span></h3>
                           <p>No Contracts. No hidden fees. Get started in minutes. </p>
                        </div>
                        <div class="col-sm-5">
                           <div onClick={() => this.onGoPage('/signup')} class="btn btn-primary">Start Free Trial</div>
                        </div>
                     </div>
                  </div>
               </section>
               <section class="our-features-section">
                  <div class="container">
                     <a class="navbar-brand" href="#"><img src={logoImg} /></a>
                  </div>
               </section>
            </div>
         </>
      )
   }
}
export default HomePageComponent