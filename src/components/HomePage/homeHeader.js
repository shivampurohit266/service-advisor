import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import "./index.scss"
import logoImg from "../../assets/home-img/logo.png"
import { AppHeaderDropdown } from "@coreui/react";
import Avtar from "../common/Avtar"
import {
  DropdownMenu,
  DropdownToggle,
  Button
} from "reactstrap";
import "../../App.scss";
import { CrmEnquiryModel } from "../common/CrmEnquiryModal"
class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundClass: "",
      mobClass: false,
      isLogin: false,
      dropdownOpen: false
    };
  }
  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.setState({ isLogin: false });
    } else {
      this.setState({ isLogin: true });
    }
    // window.addEventListener('scroll', this.listenScrollEvent)
  }
  // listenScrollEvent = e => {
  //    if (window.scrollY > 150) {
  //       this.setState({ backgroundClass: "sticky-header" })
  //    } else {
  //       this.setState({ backgroundClass: "" })
  //    }
  // };
  handleScrollToFeature = () => {
    const featureDiv = document.getElementById("our-features");
    const scrollToY = featureDiv.getBoundingClientRect().top;
    window.scroll({
      top: scrollToY,
      behavior: "smooth"
    });
  };

  handleMobileToggle = () => {
    this.setState({
      mobClass: !this.state.mobClass
    });
  };

  onGoPage = pageUrl => {
    this.props.onGoPage(pageUrl);
    // window.open(pageUrl);
  };
  /**
   *
   */
  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };
  /**
   *
   */
  handleOpenEnquiryModal = () => {
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      enquiryModalOpen: !modelDetails.enquiryModalOpen
    };
    this.props.modelOperate(data);
  }

  render() {
    const { dropdownOpen } = this.state
    const { profileInfoReducer, enquiryModalOpen, enquiryRequest } = this.props;
    const { backgroundClass, mobClass, isLogin } = this.state;
    const profileName =
      profileInfoReducer && profileInfoReducer.profileInfo
        ? profileInfoReducer.profileInfo.firstName +
        " " +
        profileInfoReducer.profileInfo.lastName
        : "Loading...";
    const profileEmail =
      profileInfoReducer && profileInfoReducer.profileInfo
        ? profileInfoReducer.profileInfo.email
        : "Loading...";
    return (
      <nav
        className={`navbar navbar-expand-md navbar-dark main-header ${backgroundClass}`}
        id="banner"
      >
        <div className="container">
          <Link className="navbar-brand" to={"/home"}>
            <img src={logoImg} alt="" />
          </Link>
          <button
            onClick={this.handleMobileToggle}
            className={mobClass ? "navbar-toggler mob-nav" : "navbar-toggler"}
            type="button"
            data-toggle="collapse"
            data-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
            {/* <ul className="navbar-nav ml-auto">
               <li className="nav-item">
                 <NavLink className="nav-link" to={"/home"}>
                   <span>Home</span>
                 </NavLink>
               </li>
               <li className="nav-item">
                 <span
                   className="nav-link cursor"
                 >
                   <span>Features</span>
                 </span>
               </li>
               <li className="nav-item">
                 <Link className="nav-link" to={"/pricing"}>
                   <span>Pricing</span>
                 </Link>
               </li>
               <li className="nav-item">
                 <span className="nav-link">
                   <span>About Us</span>
                 </span>
               </li>
               {!isLogin ? (
                 <li className="nav-item">
                   <NavLink
                     className="nav-link"
                     to={
                       "/login"
                     }
                   >
                     <span>Sign In</span>
                   </NavLink>
                 </li>
               ) : null}
             </ul> */}
            {!isLogin ? (
              // <Link
              //   to={"/register"}
              //   /*onClick={() => this.onGoPage('/dev/register')}*/ className="btn btn-theme btn-sm"
              // >
              <Button className={"cursor_pointer btn btn-theme"} color={""} onClick={this.handleOpenEnquiryModal}>
                Request Early Access
              </Button>
              //</div></Link>
            ) : (
                <ul className="app-header position-relative home-header">
                  <AppHeaderDropdown
                    direction="down"
                    className="user-Info-dropdown"
                    isOpen={dropdownOpen}
                    onMouseEnter={this.toggle}
                    onMouseLeave={this.toggle}
                  >
                    <DropdownToggle className="nav-link pl-2 pr-2 ">
                      <span className={"fa-user-icon"}>
                        <span className="fas fa-user" />
                      </span>
                    </DropdownToggle>
                    <DropdownMenu
                      right
                      style={{ right: "auto" }}
                      className="home-header"
                    >
                      <div>
                        <div className={"top-block d-flex"}>
                          <span className={"avtar-icon"}>
                            <Avtar value={profileName} class={"name"} />
                          </span>
                          <div>
                            <div className={"text-capitalize name-block"}>
                              {profileName}
                            </div>
                            <div className={"email"}>{profileEmail}</div>
                          </div>
                        </div>
                        <NavLink to="/profile" className="nav-link">
                          <i className={"fa fa-institution"} /> Company Profile
                      </NavLink>

                        <NavLink
                          to="/profile?tab=Subscription"
                          className="nav-link"
                        >
                          <i className={"fa fa-dollar"} /> Subscription
                      </NavLink>
                        <NavLink to="/profile" className="nav-link">
                          <i className={"fa fa-user"} /> My Profile
                      </NavLink>
                        <NavLink to="/home" className="nav-link">
                          <i className={"fas fa-home"} /> Home
                      </NavLink>
                        <NavLink to="#" className="nav-link logout-link">
                          <span
                            className={"logout-btn"}
                            onClick={e => this.props.onLogout(e)}
                          >
                            <i className={"fa fa-sign-out"} /> Logout
                        </span>
                        </NavLink>
                      </div>
                    </DropdownMenu>
                  </AppHeaderDropdown>
                </ul>
              )}
          </div>
        </div>
        <CrmEnquiryModel
          enquiryModalOpen={enquiryModalOpen}
          handleEnquiryModal={this.handleOpenEnquiryModal}
          enquiryRequest={enquiryRequest}
        />
      </nav>
    );
  }
}
export default HomeHeader
