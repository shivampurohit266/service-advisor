import React, { Component } from "react";
import {
  Table,
  Badge,
  Button,
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  InputGroup,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import { connect } from "react-redux";
import { fleetEditRequest } from "../../../actions";
import PaginationHelper from "../../../helpers/Pagination";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import * as qs from "query-string";
import { withRouter } from "react-router-dom";
import { AppConfig } from "../../../config/AppConfig";
import { toast } from 'react-toastify';
import moment from 'moment';
import NoDataFound from "../../common/NoFound";
import { notExist } from "../../../config/Constants";

class FleetList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFleetModal: false,
      fleetListdata: {},
      error: {},
      isLoading: false,
      search: "",
      status: "",
      sort: "",
      type: "",
      page: 1,
      selectedFleets: [],
      filterApplied: false,
      bulkAction: ""
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.windowScroll);
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort, status, type } = qs.parse(lSearch);
    let filterApplied = false;
    if (search || sort) {
      filterApplied = true;
    }
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      status: status || "",
      search: search || "",
      type: type || "",
      filterApplied
    });
  }
  windowScroll = () => {
    let featureDiv = document.getElementById(`data10`);
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
  componentDidUpdate({ openEdit }) {
    if (this.props.openEdit !== openEdit) {
      this.setState({
        openFleetModal: false
      });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleCheckAllCheckBox = e => {
    const { fleetListData } = this.props;
    const { fleetData } = fleetListData;
    const { data } = fleetData
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedFleets: [],
      });
      return;
    }
    const selectedFleets = [];
    data.forEach(data => {
      selectedFleets.push(data._id);
    });
    this.setState({ selectedFleets });
  };

  handleCheckboxChange = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedFleets } = this.state;
    if (checked) {
      selectedFleets.push(value);
      this.setState({
        selectedFleets,
      });
      return;
    }
    const index = selectedFleets.indexOf(value);
    selectedFleets.splice(index, 1);
    this.setState({
      selectedFleets,
    });
  };

  handleActionChange = e => {
    const { selectedFleets } = this.state;
    const { target } = e;
    const { value } = target;
    if (!value) {
      return;
    }
    if (!selectedFleets.length) {
      toast.error('Please select at least one customer.');
      return;
    }
    this.setState({
      bulkAction: value
    });
    if (value === 'active') {
      this.activateUsers(true);
    } else if (value === 'inactive') {
      this.deactivateUsers(true);
    } else if (value === 'delete') {
      this.onDelete(true);
    }

  };
  activateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? 'Do you want to active selected fleet(s)?'
        : 'Do you want to active this fleet?',
    });
    if (!value) {
      this.setState({
        selectedFleets: [],
        bulkAction: ""
      });
      return;
    }
    this.props.onStatusUpdate({ status: true, fleetId: this.state.selectedFleets });
    this.setState({ selectedFleets: [], bulkAction: "" });
  };

  deactivateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? 'Do you want to inactive selected fleet(s)?'
        : 'Do you want to inactive this fleet?',
    });
    if (!value) {
      this.setState({
        selectedFleets: [],
        bulkAction: ""
      });
      return;
    }
    this.props.onStatusUpdate({ status: false, fleetId: this.state.selectedFleets });
    this.setState({ selectedFleets: [], bulkAction: "" });

  };

  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      selectedFleets: []
    });
    const { search, sort, status } = this.state;
    let param = {};
    param.page = 1;
    if (search) {
      param.search = search.trim(" ");
    }
    if (sort) {
      param.sort = sort;
    }
    if (status) {
      param.status = status;
    }
    this.props.onSearch(param);
    this.setState({
      filterApplied: true
    })
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
    })
  };

  editFleet = fleetData => {
    this.props.updateFleetModel(fleetData)
  };

  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };

  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected fleet(s)?"
        : "Do you want to delete this fleet?"
    });
    if (!value) {
      this.setState({
        selectedFleets: [],
        bulkAction: ""
      });
      return;
    }
    this.props.onDelete(this.state.selectedFleets);
    this.setState({ selectedFleets: [], bulkAction: "" });
  };

  render() {
    const {
      search,
      status,
      sort,
      page,
      selectedFleets,
      filterApplied,
      bulkAction
    } = this.state
    const { fleetListData } = this.props;
    const { isLoading, fleetData } = fleetListData;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
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
                      placeholder="Search by company name and email"
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
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
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
            </Row>
          </Form>
        </div>
        <Table responsive >
          <thead>
            <tr>
              <th width="90px">
                <div className="table-checkbox-wrap">
                  {fleetData.data && fleetData.data.length ? (
                    <span className="checkboxli checkbox-custom checkbox-default">
                      <Input
                        type="checkbox"
                        name="checkbox"
                        id="checkAll"
                        checked={
                          fleetData.data && fleetData.data.length
                            ? selectedFleets.length ===
                            fleetData.data.length
                            : null
                        }
                        onChange={this.handleCheckAllCheckBox}
                      />
                      <label className="" htmlFor="checkAll" />
                    </span>
                  ) : (
                      <span className="checkboxli checkbox-custom checkbox-default">
                        <label />
                      </span>
                    )}

                  {fleetData && fleetData.data && fleetData.data.length ? (
                    <Input
                      className="commonstatus"
                      type="select"
                      id="exampleSelect"
                      onChange={this.handleActionChange}
                      value={bulkAction}
                    >
                      <option value={""}>Select</option>
                      <option value={"active"}>Active</option>
                      <option value={"inactive"}>Inactive</option>
                      <option value={"delete"}>Delete</option>
                    </Input>
                  ) : (
                      <Input
                        className="commonstatus"
                        type="select"
                        id="exampleSelect"
                        disabled
                        onChange={this.handleActionChange}
                        value={bulkAction}
                      >
                        <option value={""}>Select</option>
                        <option value={"active"}>Active</option>
                        <option value={"inactive"}>Inactive</option>
                        <option value={"delete"}>Delete</option>
                      </Input>
                    )}
                </div>
              </th>
              <th width={"250"}>
                <i className={"fa fa-building-o"} /> Company Name
              </th>
              <th width={"250"}>
                <i className={"fa fa-phone"} /> Phone
              </th>
              {/* <th width={"250"}>Email</th> */}
              <th>
                <i className={"fa fa-calculator"} /> Tax Exempted
              </th>
              <th>
                <i className="fa fa-percent" /> Discount
              </th>
              {/* <th><i className={"fa fa-bookmark"} /> Lables</th> */}
              <th>
                <i className={"fa fa-exclamation-circle"} /> Status
              </th>
              <th>
                <i className={"fa fa-clock-o"} /> Created
              </th>
              <th width={"140"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              fleetData && fleetData.data && fleetData.data.length ? (
                fleetData.data.map((data, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr key={index} id={`data${index}`}>
                        <td>
                          <div className="checkbox-custom checkbox-default coloum-checkbox">
                            <Input
                              type="checkbox"
                              value={data._id}
                              checked={selectedFleets.indexOf(data._id) > -1}
                              name="checkbox"
                              onChange={this.handleCheckboxChange}
                            />
                            <label htmlFor={data._id}>
                              {(page - 1) * AppConfig.ITEMS_PER_PAGE +
                                index +
                                1}
                              .
                          </label>
                          </div>
                        </td>
                        <td>
                          <div className={"text-capitalize font-weight-bold"}>
                            {data.companyName || notExist}
                          </div>
                          <div>
                            {data.email ? (
                              <a
                                href={`mailto:${data.email}`}
                                className={"text-body"}
                              >
                                {data.email}
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          <div>
                            {data.phoneDetail
                              ? data.phoneDetail.map((data, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    <div className="text-capitalize">
                                      {data.phone ? data.phone : "mobile"}
                                      {"  "}
                                      <b>|</b>
                                      {"  "}
                                      {data.value ? (
                                        <a
                                          href={`tel:${data.value}`}
                                          className={"text-body"}
                                        >
                                          {data.value}
                                        </a>
                                      ) : null}
                                    </div>
                                  </React.Fragment>
                                );
                              })
                              : "-"}
                          </div>
                        </td>
                        <td className={"pl-4"}>
                          <span className={"qty-value"}>
                            {data.fleetDefaultPermissions &&
                              !data.fleetDefaultPermissions
                                .isCorporateFleetTaxExempt.status ? (
                                <i className={"fa fa-times text-danger"} />
                              ) : (
                                <i className="fa fa-check text-success" />
                              )}
                          </span>
                        </td>
                        <td className={"pl-4 qty-value"}>
                          <span className={"qty-value"}>
                            {data.fleetDefaultPermissions &&
                              data.fleetDefaultPermissions.shouldReceiveDiscount
                                .status
                              ? `${
                              data.fleetDefaultPermissions
                                .shouldReceiveDiscount.percentageDiscount
                              }%`
                              : "0%"}
                          </span>
                        </td>
                        {/* <td >
                        <button className="btn btn-sm btn-primary btn-round"><i className="fas fa-plus-square" /></button>
                      </td> */}
                        <td>
                          {data.status ? (
                            <Badge
                              className={"badge-button"}
                              color="success"
                              onClick={() => {
                                this.setState(
                                  {
                                    selectedFleets: [data._id]
                                  },
                                  () => {
                                    this.deactivateUsers();
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
                                      selectedFleets: [data._id]
                                    },
                                    () => {
                                      this.activateUsers();
                                    }
                                  );
                                }}
                              >
                                Inactive
                          </Badge>
                            )}
                        </td>
                        <td>
                          <div>
                            {moment(data.createdAt).format("MMM Do YYYY")}
                          </div>
                          <div>{moment(data.createdAt).format("h:mm a")}</div>
                        </td>
                        <td className={"text-center"}>
                          <span className="mr-2">
                            <Button
                              size={"sm"}
                              onClick={() => this.editFleet(data)}
                              className={"btn-theme-transparent"}
                              id={"Tooltip-3"}
                            >
                              <i className={"icons cui-pencil"} />
                            </Button>
                            <UncontrolledTooltip target="Tooltip-3">
                              Edit
                          </UncontrolledTooltip>
                          </span>
                          <span className="mr-2">
                            <Button
                              size={"sm"}
                              onClick={() =>
                                this.setState(
                                  {
                                    selectedFleets: [data._id]
                                  },
                                  () => {
                                    this.onDelete();
                                  }
                                )
                              }
                              className={"btn-theme-transparent"}
                              id={"Tooltip-4"}
                            >
                              <i className={"icons cui-trash"} />
                            </Button>
                            <UncontrolledTooltip target="Tooltip-4">
                              Delete
                          </UncontrolledTooltip>
                          </span>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={10}>
                      {filterApplied ? (
                        <NoDataFound
                          message={
                            "No Fleet details found related to your search"
                          }
                          noResult
                        />
                      ) : (
                          <NoDataFound
                            showAddButton
                            message={"Currently there are no Fleets added"}
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
        {fleetData && fleetData.data && fleetData.data.length && !isLoading ?
          <Button
            color={""}
            size={"sm"}
            className={"text-white btn-theme btn-scroll-top"}
            onClick={this.scrollToTop}
            id={"btn-scroll-top"}
            style={{ display: "none" }}
          >
            <i className={"fa fa-chevron-up"}></i>
          </Button> : null}
        {fleetData.totalfleet && !isLoading ? (
          <PaginationHelper
            totalRecords={fleetData.totalfleet}
            onPageChanged={page => {
              this.setState({ page });
              this.props.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}
        {/* <CrmFleetEditModal
          fleetModalOpen={openFleetModal}
          handleFleetModal={() => {
            this.setState({
              openFleetModal: false,
              fleetData: {}
            });
          }}
          fleetData={fleetListdata}
          handleAddFleet={this.handleAddFleet}
          errorMessage={error}
          updateFleet={this.onUpdate}
        /> */}
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
});

const mapDispatchToProps = dispatch => ({
  updateFleet: (data) => {
    dispatch(fleetEditRequest(data))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FleetList));
