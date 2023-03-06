import React, { Component } from "react";
import {
  Table,
  Badge,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  InputGroup,
  Input,
  Button
} from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import PaginationHelper from "../../../helpers/Pagination";
import { withRouter, Link } from "react-router-dom";
import * as qs from "query-string";
import { AppConfig } from "../../../config/AppConfig";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import { toast } from "react-toastify";
import moment from "moment";
import NoDataFound from "../../common/NoFound";
import { notExist } from "../../../config/Constants";
import { AppRoutes } from "../../../config/AppRoutes";

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      sort: "",
      selectedCustomers: [],
      filterApplied: false,
      selectedAction: "",
      phoneToggle: -1
    };
  }

  componentDidMount = () => {
    window.addEventListener("scroll", this.windowScroll);
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort, status } = qs.parse(lSearch);
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      status: status || "",
      search: search || "",
      filterApplied: status || search || false
    });
  };

  windowScroll = () => {
    let featureDiv = document.getElementById(`customer10`);
    if (featureDiv) {
      let scrollY = featureDiv.getBoundingClientRect().top;
      let scrollEle = document.getElementById("btn-scroll-top");
      if (scrollY <= window.scrollY) {
        scrollEle.style.display = "block";
      } else {
        scrollEle.style.display = "none";
      }
    }
  };
  scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  };
  componentDidUpdate({ openEdit }) {
    if (this.props.openEdit !== openEdit) {
      this.setState({
        openEditModal: false
      });
    }
  }

  handleCheckboxChnage = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedCustomers } = this.state;
    if (checked) {
      selectedCustomers.push(value);
      this.setState({
        selectedCustomers
      });
      return;
    }
    const index = selectedCustomers.indexOf(value);
    selectedCustomers.splice(index, 1);
    this.setState({
      selectedCustomers
    });
  };

  handleCheckAllCheckBox = e => {
    const { customerData } = this.props;
    const { customers } = customerData;
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedCustomers: []
      });
      return;
    }
    const selectedCustomers = [];
    customers.forEach(user => {
      selectedCustomers.push(user._id);
    });
    this.setState({ selectedCustomers });
  };

  handleActionChange = e => {
    const { selectedCustomers } = this.state;
    const { target } = e;
    const { value } = target;
    if (!value) {
      return;
    }
    this.setState({
      selectedAction: value
    });
    if (!selectedCustomers.length) {
      toast.error("Please select at least one customer.");
      this.setState({
        selectedAction: ""
      });
      return;
    }
    if (value === "active") {
      this.activateCustomers(true);
    } else if (value === "inactive") {
      this.deactivateCustomers(true);
    } else if (value === "delete") {
      this.onDelete(true);
    }
    this.setState({
      selectedAction: ""
    });
  };

  activateCustomers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to active selected customer(s)?"
        : "Do you want to active this customer?"
    });
    if (value) {
      this.props.onStatusUpdate({
        status: true,
        customers: this.state.selectedCustomers
      });
    }
    this.setState({
      selectedCustomers: []
    });
  };

  deactivateCustomers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to inactive selected customer(s)?"
        : "Do you want to inactive this customer?"
    });
    if (value) {
      this.props.onStatusUpdate({
        status: false,
        customers: this.state.selectedCustomers
      });
    }
    this.setState({
      selectedCustomers: []
    });
  };

  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected customer(s)?"
        : "Do you want to delete this customer?"
    });
    if (value) {
      this.props.onDelete(this.state.selectedCustomers);
    }
    this.setState({
      selectedCustomers: []
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSearch = e => {
    e.preventDefault();
    const { search, sort, status } = this.state;
    let param = {};
    param.page = 1;
    let hasFilter = false;
    if (search) {
      param.search = search !== "" ? search.trim() : "";
      // this.setState({
      //   filterApplied: true
      // })
      hasFilter = true;
    }
    if (sort) {
      param.sort = sort;
      hasFilter = true;
    }
    if (status) {
      param.status = status;
      hasFilter = true;
    }
    this.setState({
      filterApplied: hasFilter
    });
    this.props.onSearch(param);
  };

  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      status: "",
      sort: "",
      user: {}
    });
    this.props.onSearch({});
    this.setState({
      filterApplied: false
    });
  };

  editUser = customer => {
    this.props.updateModel(customer);
  };
  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };
  handleCustomerView = customerId => {
    this.props.history.push(
      AppRoutes.CUSTOMER_DETAILS.url.replace(":id", `${customerId}`)
    );
    this.props.getCustomerDetailsRequest();
  };
  handleCustomerVehicleView = customerId => {
    this.props.redirectTo(
      AppRoutes.CUSTOMER_DETAILS.url.replace(
        ":id",
        `${customerId}?tab=${encodeURIComponent("Vehicles")}`
      )
    );
  };

  handlePhoneToggle = index => {
    this.setState({
      phoneToggle: this.state.phoneToggle === index ? -1 : index
    });
  };

  render() {
    const { customerData } = this.props;
    const { customers, isLoading, totalCustomers } = customerData;
    const {
      page,
      search,
      sort,
      status,
      selectedCustomers,
      filterApplied,
      selectedAction,
      phoneToggle
    } = this.state;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row className={"w-auto"}>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  {/* <Label className="label">Search</Label> */}
                  <InputGroup className="mb-2">
                    <input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      className="form-control"
                      value={search}
                      aria-describedby="searchUser"
                      placeholder="Search by name and email"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  {/* <Label for="exampleSelect" className="label">
                    Status
                  </Label> */}
                  <Input
                    type="select"
                    name="status"
                    id="exampleSelect"
                    onChange={this.handleChange}
                    value={status}
                  >
                    <option className="form-control" value={""}>
                      Status
                    </option>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  {/* <Label for="SortFilter" className="label">
                    Sort By
                  </Label> */}
                  <Input
                    type="select"
                    name="sort"
                    id="SortFilter"
                    onChange={this.handleChange}
                    value={sort}
                  >
                    <option className="form-control" value={""}>
                      Sort By
                    </option>
                    <option value={"createddesc"}>Last Created</option>
                    <option value={"nasc"}>Name A-Z</option>
                    <option value={"ndesc"}>Name Z-A</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <div className="filter-btn-wrap">
                  <Label className="height17 label" />
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
                        type="button"
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
                </div>
              </Col>
              {totalCustomers ? (
                <Col lg={"2"} md={"2"} className="mb-0 text-right">
                  <div className="total-block mt-1">
                    <span className="">Total Customers :</span>&nbsp;
                    <span>{totalCustomers ? totalCustomers : 0}</span>
                  </div>
                </Col>
              ) : null}
            </Row>
          </Form>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width="90px">
                {customers.length ? (
                  <div className="table-checkbox-wrap">
                    <span className="checkboxli checkbox-custom checkbox-default">
                      <Input
                        type="checkbox"
                        name="checkbox"
                        id="checkAll"
                        checked={selectedCustomers.length === customers.length}
                        onChange={this.handleCheckAllCheckBox}
                      />
                      <label className="" htmlFor="checkAll" />
                    </span>
                    <Input
                      className="commonstatus"
                      type="select"
                      id="exampleSelect"
                      value={selectedAction}
                      onChange={this.handleActionChange}
                    >
                      <option value={""}>Select</option>
                      <option value={"active"}>Active</option>
                      <option value={"inactive"}>Inactive</option>
                      <option value={"delete"}>Delete</option>
                    </Input>
                  </div>
                ) : (
                  "S No."
                )}
              </th>
              <th width={"300"}>
                <i className={"fa fa-user"} /> Cutomer Details
              </th>
              <th width={"280"}>
                <i className={"fa fa-phone"} /> Phone No.
              </th>
              {/* <th>Address</th> */}
              <th width={"130"}>
                <i className={"fa fa-cab"} /> Vehicle
              </th>
              {/* <th width={"130"}>
                <i className={"fa fa-list-ol"} /> Orders
              </th> */}
              <th width={"130"}>
                <i className={"fa fa-exclamation-circle"} /> Status
              </th>
              <th width={"200"}>
                <i className={"fa fa-clock-o"} /> Created
              </th>
              <th width={"140"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              customers && customers.length ? (
                customers.map((user, index) => {
                  return (
                    <tr key={index} id={`customer${index}`}>
                      <td>
                        <div className="checkbox-custom checkbox-default coloum-checkbox">
                          <Input
                            type="checkbox"
                            value={user._id}
                            checked={selectedCustomers.indexOf(user._id) > -1}
                            name="checkbox"
                            onChange={this.handleCheckboxChnage}
                          />
                          <label htmlFor={user._id}>
                            {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                          </label>
                        </div>
                      </td>
                      <td>
                        <Link to={`${AppRoutes.CUSTOMER_DETAILS.url.replace(":id", user._id)}`} target="_blank">
                          <div
                            className={
                              "font-weight-semibold text-capitalize pb-1 cursor_pointer text-primary"
                            }
                          >
                            {user.firstName + " " + user.lastName || notExist}
                          </div>
                        </Link>
                        <div>
                          {user.email ? (
                            <a
                              href={`mailto:${user.email}`}
                              className={"text-body"}
                            >
                              {user.email}
                            </a>
                          ) : null}
                        </div>
                        {/* {user.email || null} */}
                      </td>
                      <td>
                        {user.phoneDetail ? (
                          <div className="text-capitalize">
                            {user.phoneDetail[0].phone || notExist}
                            {" |"}
                            {"  "}
                            {user.phoneDetail[0].value ? (
                              <a
                                href={`tel:${user.phoneDetail[0].value}`}
                                className={"text-body"}
                              >
                                {user.phoneDetail[0].value}
                              </a>
                            ) : (
                              notExist
                            )}
                          </div>
                        ) : null}
                        <div
                          className={
                            phoneToggle === index ? "d-block" : "d-none"
                          }
                        >
                          {user.phoneDetail
                            ? user.phoneDetail.map((data, ind) => {
                                return ind === 0 ? null : (
                                  <div className="text-capitalize" key={ind}>
                                    {data.phone || notExist}
                                    {" |"}
                                    {"  "}
                                    {data.value ? (
                                      <a
                                        href={`tel:${data.value}`}
                                        className={"text-body"}
                                      >
                                        {data.value}
                                      </a>
                                    ) : (
                                      notExist
                                    )}
                                  </div>
                                );
                              })
                            : notExist}
                        </div>
                        {user.phoneDetail.length > 1 ? (
                          <span className={"m-1 d-block"}>
                            <Badge
                              onClick={() => this.handlePhoneToggle(index)}
                              className={"cursor_pointer"}
                            >
                              {phoneToggle === index
                                ? "View Less"
                                : "View More"}
                            </Badge>
                          </span>
                        ) : null}
                      </td>
                      {/* <td>
                        {user.address1 || ""} {user.city || ""}{" "}
                        {user.state || ""} {user.zipCode || ""}{" "}
                      </td> */}
                      <td
                        className={"pl-4 cursor_pointer text-primary"}
                        onClick={() => this.handleCustomerVehicleView(user._id)}
                      >
                        <div id={`customer-vehicle-${user._id}`}>
                          {user.vehicles && user.vehicles.length ? (
                            <span className={"qty-value"}>
                              {user.vehicles.length}
                            </span>
                          ) : (
                            <span className={"qty-no-value"}>Not Added</span>
                          )}
                        </div>
                        <UncontrolledTooltip
                          target={`customer-vehicle-${user._id}`}
                        >
                          Click to add vehicle
                        </UncontrolledTooltip>
                      </td>
                      {/* <td className={"pl-4"}>
                        <span className={"qty-value"}>0</span>
                      </td> */}
                      <td>
                        {user.status ? (
                          <Badge
                            className={"badge-button"}
                            color="success"
                            onClick={() => {
                              this.setState(
                                {
                                  selectedCustomers: [user._id]
                                },
                                () => {
                                  this.deactivateCustomers();
                                }
                              );
                            }}
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            className={"badge-button"}
                            color="danger"
                            onClick={() => {
                              this.setState(
                                {
                                  selectedCustomers: [user._id]
                                },
                                () => {
                                  this.activateCustomers();
                                }
                              );
                            }}
                          >
                            Inactive
                          </Badge>
                        )}
                      </td>
                      <td>
                        {/* {user.createdAt ? formateDate(user.createdAt) : "-"} */}
                        <div>
                          {moment(user.createdAt).format("MMM Do YYYY")}
                        </div>
                        <div>{moment(user.createdAt).format("h:mm a")}</div>
                      </td>
                      <td className={"text-center"} width={150}>
                        <div className={"d-flex justify-content-center"}>
                          <span className="mr-2">
                            <Button
                              className={"btn-theme-transparent"}
                              size={"sm"}
                              onClick={() => this.handleCustomerView(user._id)}
                              id={`view-${user._id}`}
                            >
                              <i className="fas fa-eye" />
                            </Button>
                            <UncontrolledTooltip target={`view-${user._id}`}>
                              View {user.firstName || notExist} 's Details
                            </UncontrolledTooltip>
                          </span>
                          <span className={"mr-2"}>
                            <Button
                              size={"sm"}
                              onClick={() => this.editUser(user)}
                              className={"btn-theme-transparent"}
                              id={`edit-${user._id}`}
                            >
                              <i className={"icons cui-pencil"} />
                            </Button>
                            <UncontrolledTooltip target={`edit-${user._id}`}>
                              Edit {user.firstName || notExist} 's Details
                            </UncontrolledTooltip>
                          </span>
                          <span className={"mr-2"}>
                            <Button
                              size={"sm"}
                              onClick={() =>
                                this.setState(
                                  {
                                    selectedCustomers: [user._id]
                                  },
                                  () => {
                                    this.onDelete();
                                  }
                                )
                              }
                              id={`delete-${user._id}`}
                              className={"btn-theme-transparent"}
                            >
                              <i className={"icons cui-trash"} />
                            </Button>
                            <UncontrolledTooltip target={`delete-${user._id}`}>
                              Delete
                            </UncontrolledTooltip>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className={"text-center"} colSpan={10}>
                    {filterApplied ? (
                      <NoDataFound
                        message={
                          "No Customer details found related to your search"
                        }
                        noResult
                      />
                    ) : (
                      <NoDataFound
                        showAddButton
                        message={
                          "Currently there are no Customer details added."
                        }
                        onAddClick={this.props.onAddClick}
                      />
                    )}
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td className={"text-center"} colSpan={10}>
                  <Loader />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {customers && customers.length && !isLoading ? (
          <Button
            color={""}
            size={"sm"}
            className={"text-white btn-theme btn-scroll-top"}
            onClick={this.scrollToTop}
            id={"btn-scroll-top"}
            style={{ display: "none" }}
          >
            <i className={"fa fa-chevron-up"}></i>
          </Button>
        ) : null}
        {totalCustomers && !isLoading ? (
          <PaginationHelper
            totalRecords={totalCustomers}
            onPageChanged={page => {
              this.setState({ page });
              this.props.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}
      </>
    );
  }
}

export default withRouter(CustomerList);
