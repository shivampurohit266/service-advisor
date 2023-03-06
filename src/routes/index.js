import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { hideLoader, showLoader, redirectTo } from "../actions";
import "../App.scss";
import FullPageLoader from "../containers/Loader/FullPageLoader";
import Helmet from "react-helmet";
import { pageTitle } from "../helpers/Object"
// Containers
const DefaultLayout = React.lazy(() => import("../containers/DefaultLayout"));
const token = localStorage.getItem("token");
// Pages
const Login = React.lazy(() => import("../containers/Auth/Login"));
const Register = React.lazy(() => import("../containers/Auth/Register"));
const ForGotPassword = React.lazy(() =>
  import("../containers/Auth/ForGotPassword")
);
const ResetPassword = React.lazy(() =>
  import("../containers/Auth/ResetPassword")
);
const VerifyAccount = React.lazy(() =>
  import("../containers/Auth/VerifyAccount")
);
const GeneratePassword = React.lazy(() =>
  import("../containers/Auth/GeneratePassword")
);

const VerifyLoginForWildcard = React.lazy(() =>
  import("../containers/Auth/VerifyLoginForWildcard")
);

const OrderSummary = React.lazy(() => import("../containers/OrderSummary"));

const Page404 = React.lazy(() => import("../views/Pages/Page404"));

const HomePage = React.lazy(() => import("../containers/HomePage"));
const FaqPage = React.lazy(() => import("../containers/Faq"));

const Pricing = React.lazy(() => import("../containers/Pricing"));

const Routes = [
  {
    exact: true,
    path: "/home",
    name: "Home Page",
    component: HomePage
  },
  {
    exact: true,
    path: "/pricing",
    name: "Pricing Page",
    component: Pricing
  },
  {
    exact: true,
    path: "/login",
    name: "Login Page",
    component: Login
  },
  {
    exact: true,
    path: "/signup",
    name: "SignUp Page",
    component: Register
  },
  {
    exact: true,
    path: "/forgot-password",
    name: "Forgot Password",
    component: ForGotPassword
  },
  {
    exact: true,
    path: "/reset-password",
    name: "Reset Password",
    component: ResetPassword
  },
  {
    exact: true,
    path: "/404",
    name: "Page Not Found",
    component: Page404
  },
  {
    exact: false,
    path: "/register/confirm/:userId/:activationCode",
    name: "Verify Account",
    component: VerifyAccount
  },
  {
    exact: false,
    path: "/register/create-password/:userId/:activationCode",
    name: "Create Password",
    component: GeneratePassword
  },
  {
    exact: false,
    path: "/verify-user-details",
    name: "Verify User Details",
    component: VerifyLoginForWildcard
  },
  {
    exact: false,
    path: "/order-summary/",
    name: "OrderSummary",
    component: OrderSummary
  },
  {
    exact: true,
    path: "/faq",
    name: "Faq",
    component: FaqPage
  },
  {
    exact: false,
    path: "/",
    name: "Home",
    component: token ? DefaultLayout : HomePage
  },
];

class AppRoutes extends Component {
  componentDidMount() { }
  render() {
    const { appState } = this.props;
    const { showLoader } = appState;
    const pathname = this.props.location.pathname;
    let titleName = pageTitle(pathname);
    return (
      <>
        <Helmet>
          <title>{titleName}</title>
        </Helmet>
        {showLoader ? <FullPageLoader /> : null}
        <Switch>
          {Routes.map((route, index) => {
            return (
              <Route
                key={index}
                exact={route.exact}
                path={route.path}
                name={route.name}
                render={props => <route.component {...props} {...this.props} />}
              />
            );
          })}
        </Switch>
      </>
    );
  }
}
const mapStateToProps = state => ({
  appState: state.mainReducer
});
const mapDispatchToProps = dispatch => {
  return {
    showLoader: () => {
      dispatch(showLoader());
    },
    hideLoader: () => {
      dispatch(hideLoader());
    },
    redirectTo: path => {
      dispatch(redirectTo({ path }));
    }
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppRoutes)
);
