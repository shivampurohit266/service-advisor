import React, { Component } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  getSubscriptionPlanRequest,
  addSubscriptionRequest,
  getDashboardOverview,
  getDashboardCustomerSale,
  getDashboardAppointments
} from "../../actions";

import CardComponent from "../../components/Dashboard/Card";
import CustomerIcon from "./../../assets/customers.svg";
import OrderIcon from "./../../assets/product.svg";
import DeliveryTruckIcon from "./../../assets/delivery-truck.svg";
import TechnicianIcon from "./../../assets/car-service.svg";
import DashboardPlanDetails from "../../components/Dashboard/PlanDetails";
import InvoiceChart from "../../components/Dashboard/InvoiceChart";
import DashboardAppointments from "../../components/Dashboard/Appointments";
import { AppRoutes } from "../../config/AppRoutes";
import moment from "moment";
import qs from "query-string";
import { logger } from "../../helpers";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          icon: OrderIcon,
          text: "Orders",
          value: 0,
          key: "orderCount",
          url: AppRoutes.WORKFLOW.url
        },
        {
          icon: CustomerIcon,
          text: "Customers",
          value: 0,
          key: "customerCount",
          url: AppRoutes.CUSTOMERS.url
        },
        {
          icon: DeliveryTruckIcon,
          text: "Vehicles",
          value: 0,
          key: "vehicleCount",
          url: AppRoutes.VEHICLES.url
        },
        {
          icon: TechnicianIcon,
          text: "Technicians",
          value: 0,
          key: "technicianCount",
          url: AppRoutes.STAFF_MEMBERS.url
        }
      ],
      customerStartDate: "",
      customerEndDate: "",
      type: "today"
    };
  }
  /**
   *
   */
  componentDidMount = () => {
    this.props.getDashboardOverView();
    this.getCustomerSales();
    this.getDashboardAppointments();
  };
  /**
   *
   */
  componentDidUpdate({ location }) {
    const { search: oldSearch } = location;
    const { search } = this.props.location;
    const {
      customerSales,
      start: customerStart,
      end: oldCustomerEnd,
      appointment: oldAppointment,
      appStart: oldAppStart,
      appEnd: oldAppEnd
    } = qs.parse(search.replace("?", ""));
    const {
      customerSales: oldCustomerSales,
      start,
      end,
      appointment,
      appStart,
      appEnd
    } = qs.parse(oldSearch.replace("?", ""));
    if (
      customerSales !== oldCustomerSales ||
      customerStart !== start ||
      end !== oldCustomerEnd
    ) {
      this.getCustomerSales();
    }
    if (
      appointment !== oldAppointment ||
      appStart !== oldAppStart ||
      oldAppEnd !== appEnd
    ) {
      this.getDashboardAppointments();
    }
  }
  /**
   *
   */
  getCustomerSales = () => {
    const { location } = this.props.history;
    const { search } = location;
    let { customerSales, start, end } = qs.parse(search.replace("?", ""));
    this.setState({
      type: customerSales
    });
    if (!start || !end) {
      let dates = this.getStartAndEnd(customerSales);
      start = dates.start;
      end = dates.end;
    }
    if (!start) {
      start = moment().format("YYYY-MM-DD");
    }
    if (!end) {
      end = moment().format("YYYY-MM-DD");
    }
    this.props.getDashboardCustomerSales({
      start,
      end
    });
  };
  /**
   *
   */
  getDashboardAppointments = () => {
    const { location } = this.props.history;
    const { search } = location;
    let { appointment, appStart: start, appEnd: end } = qs.parse(
      search.replace("?", "")
    );
    this.setState({
      appointmentType: appointment
    });
    if (!start || !end) {
      let dates = this.getStartAndEnd(appointment);
      start = dates.start;
      end = dates.end;
    }

    if (!start) {
      start = moment().format("YYYY-MM-DD");
    }
    if (!end) {
      end = moment().format("YYYY-MM-DD");
    }
    this.props.getDashboardAppointments({
      start,
      end
    });
  };
  /**
   *
   */
  getStartAndEnd = type => {
    switch (type) {
      case "week":
        return {
          start: moment()
            .startOf("week")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      case "month":
        return {
          start: moment()
            .startOf("month")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      case "quarter":
        return {
          start: moment()
            .startOf("quarter")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      case "all":
        return {
          start: moment()
            .subtract(10, "years")
            .format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
      default:
        return {
          start: moment().format("YYYY-MM-DD"),
          end: moment().format("YYYY-MM-DD")
        };
    }
  };
  /**
   *
   */
  onCustomerSaleRangeChange = (value, start, end) => {
    if (value !== "custom") {
      const dates = this.getStartAndEnd(value);
      start = dates.start;
      end = dates.end;
    }
    logger(start, end);
    let { search } = this.props.location;
    if (!search) {
      search = {};
    } else {
      search = qs.parse(search.replace("?", ""));
    }
    search = {
      ...search,
      customerSales: value,
      start,
      end
    };
    logger(search);

    this.props.redirectTo(`${AppRoutes.DASHBOARD.url}?${qs.stringify(search)}`);
  };
  /**
   *
   */
  onAppointmentChange = (value, appStart, appEnd) => {
    if (value !== "custom") {
      const dates = this.getStartAndEnd(value);
      logger(dates, appStart, appEnd);
      appStart = dates.start;
      appEnd = dates.end;
    }
    logger(appStart, appEnd);
    let { search } = this.props.location;
    if (!search) {
      search = {};
    } else {
      search = qs.parse(search.replace("?", ""));
    }
    search = {
      ...search,
      appointment: value,
      appStart,
      appEnd
    };
    logger(search);

    this.props.redirectTo(`${AppRoutes.DASHBOARD.url}?${qs.stringify(search)}`);
  };
  /**
   *
   */
  render() {
    const { dashboardData, redirectTo, profileInfo } = this.props;
    const {
      cards,
      customerStartDate,
      customerEndDate,
      type,
      appointmentType
    } = this.state;
    const { overview, customerSales, appointments } = dashboardData;
    const actualCards = cards.map(card => {
      return {
        ...card,
        value: overview[card.key]
      };
    });
    return (
      <div className="animated fadeIn dashboard-container dashboard-warp">
        <Row className={"dashboard-container-row"}>
          <Col xs="12" sm="12" lg="12" className={"p-0"}>
            <Card className={"white-card"}>
              <CardBody className={"custom-card-body position-relative"}>
                <Row className={"m-0"}>
                  <Col sm={"12"}>
                    <DashboardPlanDetails
                      profileInfo={profileInfo.profileInfo}
                    />
                  </Col>
                  {actualCards.map((card, index) => {
                    return (
                      <Col sm={"3"} key={index} className={"dashboard-card"}>
                        <CardComponent redirectTo={redirectTo} {...card} />
                      </Col>
                    );
                  })}
                </Row>
                <br />
                <Row className={"m-0"}>
                  <Col sm={"6"}>
                    <InvoiceChart
                      customerSales={customerSales}
                      onFilterChange={this.onCustomerSaleRangeChange}
                      customerStartDate={customerStartDate}
                      customerEndDate={customerEndDate}
                      type={type}
                    />
                  </Col>
                  <Col sm={"6"}>
                    <DashboardAppointments
                      onFilterChange={this.onAppointmentChange}
                      type={appointmentType}
                      appointments={appointments}
                      redirectTo={redirectTo}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <CrmSubscriptionModel
          openSubscriptionModel={openSubscriptionModel}
          modelOperate={modelOperate}
          openSubPayementModel={openSubPayementModel}
          getSubscriptionPlanRequest={getSubscriptionPlanRequest}
          subscriptionReducer={subscriptionReducer}
          addSubscriptionRequest={addSubscriptionRequest}
        /> */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  modelInfoReducer: state.modelInfoReducer,
  subscriptionReducer: state.subscriptionReducer,
  profileInfo: state.profileInfoReducer,
  dashboardData: state.dashboardReducer
});
const mapDispatchToProps = dispatch => ({
  getSubscriptionPlanRequest: () => dispatch(getSubscriptionPlanRequest()),
  addSubscriptionRequest: data => dispatch(addSubscriptionRequest(data)),
  getDashboardOverView: data => dispatch(getDashboardOverview(data)),
  getDashboardCustomerSales: data => dispatch(getDashboardCustomerSale(data)),
  getDashboardAppointments: data =>
    dispatch(getDashboardAppointments({ ...data, limit: 5 }))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));
