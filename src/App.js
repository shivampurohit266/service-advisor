import { createBrowserHistory } from "history";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { routerMiddleware } from "react-router-redux";
import { ToastContainer, toast, Zoom } from "react-toastify";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import { createLogicMiddleware } from "redux-logic";
import { mode, EnviornmentTypes } from "./config/AppConfig";
import FullPageLoader from "./containers/Loader/FullPageLoader";
import arrLogic from "./logic";
import AppReducer from "./reducers";
import AppRoutes from "./routes/";
import "react-toastify/dist/ReactToastify.css";
import "react-day-picker/lib/style.css";
import "react-dates/lib/css/_datepicker.css";

import "react-dates/initialize";

/**
 *
 */
const logicMiddleware = createLogicMiddleware(arrLogic);
const history = createBrowserHistory({ basename: "/" });
const middlewares = [logicMiddleware, routerMiddleware(history)];
if (mode === EnviornmentTypes.DEV) {
  middlewares.push(logger);
}

export const store = createStore(AppReducer, applyMiddleware(...middlewares));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <React.Suspense fallback={<FullPageLoader />}>
            <AppRoutes />
          </React.Suspense>
        </Router>
        <ToastContainer
          position={toast.POSITION.TOP_RIGHT}
          autoClose={8000}
          hideProgressBar
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          transition={Zoom}
        />
      </Provider>
    );
  }
}

export default App;
