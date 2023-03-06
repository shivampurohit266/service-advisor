import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.scss"
import { Button } from "reactstrap";
import logoImg from "../../assets/home-img/logo.png"
import facebookIcon from "../../assets/home-img/facebook-icon.svg";
import twitterIcon from "../../assets/home-img/twitter-icon.svg";
import linkdinIcon from "../../assets/home-img/linkedin-icon.svg";
import instagramIcon from "../../assets/home-img/instagram-icon.svg";
class HomeFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      email: "",
      support_email: "",
      website: "",
      address: "",
      contact: ""
    };
  }
  componentDidMount = () => {
    window.addEventListener("scroll", this.windowScroll);
  };
  windowScroll = () => {
    let featureDiv = document.getElementById("our-features");
    if (featureDiv) {
      let scrollY = featureDiv.getBoundingClientRect().top;
      let scrollEle = document.getElementById("btn-scroll-top");
      if (scrollY <= window.scrollY) {
        scrollEle.style.display = "block";
      } else {
        scrollEle.style.display = "none";
      }
    }
  }
  scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  };
  componentDidUpdate = ({ settingData }) => {
    if (
      this.props.settingData &&
      this.props.settingData.settingDetails &&
      this.props.settingData.settingDetails !== {} &&
      this.props.settingData.settingDetails !== null &&
      settingData.settingDetails &&
      settingData.settingDetails !== this.props.settingData.settingDetails
    ) {
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
      });
    }
  };
  render() {
    const { facebook, twitter, instagram, linkedin } = this.state;
    return (
      <footer>
        <div className="footer-wrap">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-sm-3">
                <Link className="navbar-brand" to={"/home"}>
                  <img src={logoImg} alt="logoImg" />
                </Link>
              </div>
              <div className="col-sm-6">
                {/* <ul>
                  <ul className="footer-nav-listing text-center">
                    <li>
                      <Link to={"/home"} onClick={this.scrollToTop}>Home</Link>
                    </li>
                    <li>
                      <Link to={"/home"} >Features</Link>
                    </li>
                    <li>
                      <Link to={"/pricing"} onClick={this.scrollToTop}>Pricing</Link>
                    </li>
                    <li>
                      <Link to={"/home"} >About Us</Link>
                    </li>
                    <li>
                      <Link to={"/faq"} onClick={this.scrollToTop}>FAQ's</Link>
                    </li>
                  </ul>
                </ul> */}
              </div>
              <div className="col-sm-3">
                <ul className="social-icon-listing text-center">
                  <li>
                    <a
                      href={facebook ? facebook : ""}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={facebookIcon} alt="facebookIcon" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={twitter ? twitter : ""}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={twitterIcon} alt="twitterIcon" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={linkedin ? linkedin : ""}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={linkdinIcon} alt="linkdinIcon" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={instagram ? instagram : ""}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={instagramIcon} alt="instagramIcon" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-wrap text-center">
          All Copyrights Reserved by Service Advisor 2019
        </div>
        <Button
          color={""}
          size={"sm"}
          className={"text-white btn-theme btn-scroll-top"}
          onClick={this.scrollToTop}
          id={"btn-scroll-top"}
        >
          <i className={"fa fa-chevron-up"}></i>
        </Button>
      </footer>
    );
  }
}
export default HomeFooter
