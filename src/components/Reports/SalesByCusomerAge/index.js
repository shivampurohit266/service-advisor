import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Table,
  FormGroup,
  InputGroup,
  Input,
  UncontrolledTooltip,
  Button,
} from "reactstrap";
import { AppConfig } from "../../../config/AppConfig";
import Loader from "../../../containers/Loader/Loader";
import { CustomerAgeTypes } from "../../../config/Constants";
import { AppRoutes } from "../../../config/AppRoutes";
// import { logger } from "../../../helpers";
import NoDataFound from "../../common/NoFound";
import Dollor from "../../common/Dollor";
import PaginationHelper from "../../../helpers/Pagination";
import * as qs from "query-string";
import { ReferralSource } from "../../../config/Constants";

class SalesByCusomerAge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilter: "",
      sort: "",
      page: 1,
      filterApplied: false
    };
  }
  /**
   * 
   */
  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { page, customerSearch, sort } = qs.parse(lSearch);
    let filterApplied = false
    if (customerSearch || sort) {
      filterApplied = true
    }
    this.setState({
      page: parseInt(page) || 1,
      selectedFilter: customerSearch || "",
      sort: sort || "",
      filterApplied
    });
  }
  /**
   *
   */
  // componentDidUpdate({ searchKey: oldSearchKey, searchPage: oldSearchPage }) {
  //   const { searchKey, searchPage } = this.props;
  //   logger(searchKey, oldSearchKey);
  //   if (searchKey !== oldSearchKey || searchPage !== oldSearchPage) {
  //     this.setState({
  //       selectedFilter: searchKey,
  //       page: searchPage
  //     });
  //   }
  // }
  /**
   *
   */
  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  /**
   *
   */
  onSearch = e => {
    e.preventDefault();
    this.setState({ page: 1, filterApplied: true });
    let page = 1;
    this.props.onSearch(this.state.selectedFilter, page, this.state.sort);
  };
  /**
   *
   */
  onReset = e => {
    e.preventDefault();
    this.setState({
      selectedFilter: "",
      page: 1,
      sort: "",
      filterApplied: false
    });
    this.props.onReset();
  };

  /**
   *
   */
  render() {
    const { customerReport } = this.props;
    const { isLoading, data, totalReports } = customerReport;
    const { selectedFilter, page, filterApplied, sort } = this.state;
    let totalPaid = 0;
    let totalUnPaid = 0;
    let totalThirty = 0;
    let totalSixty = 0;
    //let totalNinenty = 0;
    let ninentyPlus = 0;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-2">
                  <InputGroup>
                    <Input
                      type={"text"}
                      className={"form-control"}
                      value={selectedFilter}
                      onChange={this.handleChange}
                      name={"selectedFilter"}
                      placeholder={"Enter customer name or email"}
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <div className={"input-block"}>
                  <Input
                    type="select"
                    placeholder="Referral"
                    name="sort"
                    value={sort}
                    onChange={this.handleChange}
                    maxLength="100"
                  >
                    <option value={""}>Select Referral Source</option>
                    {ReferralSource.length
                      ? ReferralSource.map((item, index) => {
                        return (
                          <option
                            selected={item.key === sort}
                            value={item.key}
                            key={index}
                          >
                            {item.text}
                          </option>
                        );
                      })
                      : null}
                  </Input>
                </div>
              </Col>
              <Col lg={"6"} md={"6"} className="mb-0">
                <div className="filter-btn-wrap justify-content-between">
                  <div className="form-group mb-0">
                    <span className="mr-2">
                      <Button
                        type="submit"
                        className="btn btn-theme-transparent"
                        id="Tooltip-1"
                      >
                        <i className="icons cui-magnifying-glass" />
                      </Button>
                      <UncontrolledTooltip target="Tooltip-1">
                        Search
                      </UncontrolledTooltip>
                    </span>
                    <span className="">
                      <Button
                        className="btn btn-theme-transparent"
                        id="Tooltip-2"
                        onClick={this.onReset}
                      >
                        <i className="icon-refresh icons" />
                      </Button>
                      <UncontrolledTooltip target={"Tooltip-2"}>
                        Reset all filters
                      </UncontrolledTooltip>
                    </span>
                  </div>
                  <div>
                    {data && data.length ? (
                      <div className={"mb-0 total-block"}>Total Records : {totalReports}</div>
                    ) : null}
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width="60px" className={"pl-2"}>
                S No.
              </th>
              <th width={"250"}>
                <i className={"fa fa-user"} /> Customer
              </th>
              <th width={"150"}>
                <i className={"fa fa-calendar"} /> 0-30 Days
              </th>
              <th width={"150"}>
                <i className={"fa fa-calendar"} /> 31-60 Days
              </th>
              <th width={"150"}>
                <i className={"fa fa-calendar"} /> 61-90 Days
              </th>
              <th width={"200"}>
                <i className={"fa fa-calendar"} /> Above 91 Days
              </th>
              <th width={"150"}>
                <i className={"fa fa-dollar"} /> Credit
              </th>
              <th width={"150"}>
                <i className={"fa fa-dollar"} /> Due
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              data && data.length ? (
                <>
                  {data.map((customer, index) => {
                    totalPaid += parseFloat(customer["paid"]);
                    totalUnPaid += parseFloat(customer["due"]);
                    totalThirty += parseFloat(
                      customer[CustomerAgeTypes.THIRTY_DAYS] || 0
                    );
                    totalSixty += parseFloat(
                      customer[CustomerAgeTypes.SIXTY_DAYS] || 0
                    );
                    // totalNinenty += parseFloat(
                    //   customer[CustomerAgeTypes.NINETY_DAYS] || 0
                    // );
                    ninentyPlus += parseFloat(
                      customer[CustomerAgeTypes.NINENTY_PLUS] || 0
                    );
                    return (
                      <tr key={index}>
                        <td className={"pl-2"}>
                          {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                        </td>
                        <td>
                          <Link to={AppRoutes.CUSTOMER_DETAILS.url.replace(
                            ":id",
                            customer.customerId._id
                          )} target="_blank"
                            className={"cursor_pointer text-primary text-capitalize"}
                          >
                            {" "}
                            {[
                              customer.customerId.firstName,
                              customer.customerId.lastName
                            ]
                              .join(" ")
                              .trim()}
                          </Link><br />
                          {customer.customerId.email ? (
                            <>
                              <a
                                href={`mailto:${customer.customerId.email}`}
                                target={"_blank"}
                                className={"text-body modal-info"}
                              >
                                {customer.customerId.email}
                              </a>
                              <br />
                            </>
                          ) : null}
                          {customer.customerId.phoneDetail &&
                            customer.customerId.phoneDetail[0] ? (
                              <a
                                href={`tel:${customer.customerId.phoneDetail[0].value}`}
                                target={"_blank"}
                                className={"text-body modal-info"}
                              >
                                {customer.customerId.phoneDetail[0].value}
                              </a>
                            ) : null}
                        </td>
                        <td>
                          <Dollor value={customer["0-30 Days"] || 0} />
                        </td>
                        <td>
                          <Dollor value={customer["31-60 Days"] || 0} />
                        </td>
                        <td>
                          <Dollor value={customer["61-90 Days"] || 0} />
                        </td>
                        <td>
                          <Dollor value={customer["91 Days and above"] || 0} />
                        </td>
                        <td className={"font-weight-semibold"}>
                          <Dollor value={customer["due"] || 0} />
                        </td>
                        <td className={"font-weight-semibold"}>
                          <Dollor value={customer["paid"] || 0} />
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={12}>
                      {filterApplied ? <NoDataFound noResult /> :
                        <NoDataFound message={"Currently there are no Sales Summary."} />
                      }
                    </td>
                  </tr>
                )
            ) : (
                <tr>
                  <td className={"text-center"} colSpan={12}>
                    <Loader />
                  </td>
                </tr>
              )}
            <tr className={"bg-light"}>
              {!isLoading ? (
                data && data.length ? (
                  <>
                    <td
                      className={"text-right font-weight-semibold pr-3"}
                      colSpan={2}
                    >
                      <h6 className={"mb-0"}>
                        <b>Total</b>
                      </h6>
                    </td>
                    <td>
                      <b>
                        <Dollor value={totalThirty} />
                      </b>
                    </td>
                    <td>
                      <b>
                        <Dollor value={totalSixty} />
                      </b>
                    </td>
                    <td>
                      <b>
                        <Dollor value={totalSixty} />
                      </b>
                    </td>
                    <td>
                      <b>
                        <Dollor value={ninentyPlus} />
                      </b>
                    </td>
                    <td>
                      <b>
                        <Dollor value={totalUnPaid} />
                      </b>
                    </td>
                    <td>
                      <b>
                        <Dollor value={totalPaid} />
                      </b>
                    </td>
                  </>
                ) :
                  null) : null}
            </tr>
          </tbody>
        </Table>
        {totalReports && !isLoading ? (
          <PaginationHelper
            totalRecords={totalReports}
            currentPage={page}
            onPageChanged={page => {
              this.setState({ page });
              this.props.onPageChange(page);
            }}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}
      </>
    );
  }
}

export default SalesByCusomerAge;
