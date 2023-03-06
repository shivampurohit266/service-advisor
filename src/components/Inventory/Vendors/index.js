import React, { Component } from "react";
import { connect } from "react-redux";
import * as qs from "query-string";
import { AppConfig } from "../../../config/AppConfig";
import Loader from "../../../containers/Loader/Loader";
import CrmInventoryVendor from "../../../components/common/CrmInventoryVendor";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import PaginationHelper from "../../../helpers/Pagination";
import { isEqual } from "../../../helpers/Object";
import moment from "moment";
import NoDataFound from "../../common/NoFound";
import { notExist } from "../../../config/Constants";

import {
  Table,
  Button,
  Form,
  Row,
  Col,
  FormGroup,
  InputGroup,
  Input,
  UncontrolledTooltip
} from "reactstrap";
import { getVendorsList, editVendor, deleteVendor } from "../../../actions";

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendor: {},
      page: 1,
      search: "",
      sort: "",
      filterApplied: false
    };
  }

  componentDidMount = () => {
    window.addEventListener("scroll", this.windowScroll);
    const query = qs.parse(this.props.location.search);
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort } = qs.parse(lSearch);
    this.props.getVendorsList({ ...query, page: query.page || 1 });
    if (location.search !== "") {
      this.setState({
        filterApplied: true,
        page: parseInt(page) || 1,
        sort: sort || "",
        search: search || ""
      });
    } else {
      this.setState({
        page: parseInt(page) || 1,
        sort: sort || "",
        search: search || ""
      });
    }
  };

  windowScroll = () => {
    let featureDiv = document.getElementById(`vendor10`);
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
  componentDidUpdate({ vendorReducer, location }) {
    if (
      this.props.vendorReducer.vendorData.isSuccess !==
      vendorReducer.vendorData.isSuccess
    ) {
      if (
        this.props.vendorReducer &&
        this.props.vendorReducer.vendorData &&
        this.props.vendorReducer.vendorData.isSuccess
      ) {
        const query = qs.parse(this.props.location.search);
        this.props.getVendorsList({ ...query, page: query.page || 1 });
      }
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getVendorsList({ ...currQuery, page: currQuery.page || 1 });
    }
  }

  editVendor = vendor => {
    this.setState({ vendor: vendor }, () => {
      this.props.modelOperate({
        vendorEditModalOpen: true
      });
    });
  };

  onUpdate = (id, data) => {
    this.props.updateVendor(id, data);
  };

  deleteVendor = async vendorId => {
    const { value } = await ConfirmBox({
      text: "You want to delete this Vendor"
    });
    if (!value) {
      return;
    }
    const data = { vendorId: vendorId };
    this.props.deleteVendor(data);
  };

  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join("?")
    );
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      vendor: {},
      filterApplied: true
    });
    const { search, sort } = this.state;
    let param = {};
    param.page = 1;
    let hasFilter = false;
    if (search) {
      param.search = search;
      hasFilter = true;
    }
    if (sort) {
      param.sort = sort;
    }

    this.setState({ filterApplied: hasFilter });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(param)].join("?"));
  };

  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      status: "",
      sort: "",
      type: "",
      vendors: {},
      filterApplied: false
    });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname]);
  };

  render() {
    const { vendor, page, search, sort, filterApplied } = this.state;
    const {
      vendorReducer,
      modelOperate,
      modelInfoReducer,
      onAddClick
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { vendorEditModalOpen } = modelDetails;
    const { vendors, isLoading, totalVendors } = vendorReducer;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"5"} md={"5"} className="mb-0">
                <FormGroup className="mb-2">
                  <InputGroup>
                    <input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      className="form-control"
                      value={search}
                      aria-describedby="searchUser"
                      placeholder="Search by vendor name, account number, contact person name, email"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"3"} md={"3"} className="mb-0">
                <FormGroup className="mb-2">
                  <Input
                    type="select"
                    name="sort"
                    id="SortFilter"
                    onChange={this.handleChange}
                    value={sort}
                  >
                    <option className="form-control" value={""}>
                      All Records
                    </option>
                    <option value={"nasc"}>Name A-Z</option>
                    <option value={"ndesc"}>Name Z-A</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"3"} md={"3"} className="mb-0">
                <Row>
                  <Col lg={"12"} md={"12"} className="mb-0">
                    <div className="filter-btn-wrap">
                      {/* <Label className="height17 label" /> */}

                      <span className="mr-2">
                        <Button
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
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width={"60"} className={"text-center"}>
                S No.
              </th>
              <th width={"350"}>
                <i className="fa fa-id-badge" /> Vendor Details
              </th>
              <th width={"300"}>
                <i className="fa fa-user-circle-o " /> Contact Person
                Details
              </th>
              <th width="350">
                <i className="fa fa-address-card-o" /> Address Details
              </th>
              <th width="150">
                <i className="fa fa-clock-o" /> Created At
              </th>
              <th width={"140"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              vendors.length ? (
                vendors.map((vendor, index) => {
                  return (
                    <tr key={index} id={`vendor${index}`}>
                      <td className={"text-center"}>
                        {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                      </td>
                      <td>
                        <div className={"font-weight-semibold"}>
                          {vendor.name}
                        </div>
                        <div>
                          {vendor.url ? (
                            <a
                              href={vendor.url}
                              target={"_blank"}
                              className="link-elipsis"
                            >
                              {vendor.url}
                            </a>
                          ) : (
                            notExist
                          )}
                        </div>
                        <div>
                          A/C :{" "}
                          {vendor.accountNumber
                            ? vendor.accountNumber
                            : notExist}
                        </div>
                      </td>
                      <td>
                        {!vendor.contactPerson.firstName &&
                        !vendor.contactPerson.lastName &&
                        !vendor.contactPerson.phoneNumber.value &&
                        !vendor.contactPerson.email ? (
                          notExist
                        ) : (
                          <>
                            <div
                              className={
                                "text-capitalize font-weight-semibold"
                              }
                            >
                              {vendor.contactPerson.firstName ? (
                                <span>
                                  {vendor.contactPerson.firstName}{" "}
                                </span>
                              ) : (
                                " "
                              )}
                              {vendor.contactPerson.firstName &&
                              vendor.contactPerson.lastName
                                ? vendor.contactPerson.lastName
                                : null}
                            </div>
                            {vendor.contactPerson.email ? (
                              <a
                                href={`mailto:${
                                  vendor.contactPerson.email
                                }`}
                                className={"text-body"}
                              >
                                {" "}
                                {vendor.contactPerson.email}
                              </a>
                            ) : null}
                            <div className={"text-capitalize dfsd"}>
                              {vendor.contactPerson.phoneNumber &&
                              vendor.contactPerson.phoneNumber.phone &&
                              vendor.contactPerson.phoneNumber.value !== ""
                                ? vendor.contactPerson.phoneNumber.phone
                                : null}
                              {vendor.contactPerson.phoneNumber.value ? (
                                <span>
                                  &nbsp;<b>|</b>&nbsp;
                                </span>
                              ) : (
                                ""
                              )}
                              {vendor.contactPerson.phoneNumber &&
                              vendor.contactPerson.phoneNumber.value ? (
                                <a
                                  href={`tel:${
                                    vendor.contactPerson.phoneNumber.value
                                  }`}
                                  className={"text-body"}
                                >
                                  {vendor.contactPerson.phoneNumber.value}
                                </a>
                              ) : null}
                            </div>
                          </>
                        )}
                      </td>
                      <td>
                        {!vendor.address.address &&
                        !vendor.address.state &&
                        !vendor.address.city &&
                        !vendor.address.zip ? (
                          notExist
                        ) : (
                          <>
                            <div className="pr-3">
                              {vendor.address.address || null}
                            </div>
                            <div className={"font-weight-semibold pr-3"}>
                              {vendor.address.state
                                ? vendor.address.state
                                : null}
                              {vendor.address.city
                                ? ", " + vendor.address.city
                                : null}
                              {vendor.address.zip
                                ? " - " + vendor.address.zip
                                : null}
                            </div>
                          </>
                        )}
                      </td>
                      <td>
                        <div>
                          {moment(vendor.createdAt).format("MMM Do YYYY")}
                        </div>
                        <div>
                          {moment(vendor.createdAt).format("h:mm a")}
                        </div>
                      </td>
                      <td className={"text-center"}>
                        <Button
                          size={"sm"}
                          onClick={() => this.editVendor(vendor)}
                          id={`edit-${vendor._id}`}
                          className={"btn-theme-transparent"}
                        >
                          <i className={"icons cui-pencil"} />
                        </Button>
                        <UncontrolledTooltip target={`edit-${vendor._id}`}>
                          Edit
                        </UncontrolledTooltip>
                        &nbsp;
                        <Button
                          size={"sm"}
                          id={`delete-${vendor._id}`}
                          onClick={() => this.deleteVendor(vendor._id)}
                          className={"btn-theme-transparent"}
                        >
                          <i className={"icons cui-trash"} />
                        </Button>
                        <UncontrolledTooltip
                          target={`delete-${vendor._id}`}
                        >
                          Delete
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={"9"} className={"text-center"}>
                    {filterApplied ? (
                      <NoDataFound
                        message={
                          "No Vendor details found related to your search"
                        }
                        noResult
                      />
                    ) : (
                      <NoDataFound
                        showAddButton
                        message={"Currently there are no Vendors added."}
                        onAddClick={onAddClick}
                      />
                    )}
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
          </tbody>
        </Table>
        {vendors && vendors.length && !isLoading ?
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
        {totalVendors && !isLoading ? (
          <PaginationHelper
            totalRecords={totalVendors}
            onPageChanged={page => {
              this.setState({ page });
              this.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}

        <CrmInventoryVendor
          updateVendor={this.onUpdate}
          vendorAddModalOpen={vendorEditModalOpen}
          handleVendorAddModal={() =>
            modelOperate({
              vendorEditModalOpen: !vendorEditModalOpen
            })
          }
          vendorData={vendor}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  vendorReducer: state.vendorsReducer,
  modelInfoReducer: state.modelInfoReducer
});

const mapDispatchToProps = dispatch => ({
  getVendorsList: data => {
    dispatch(getVendorsList(data));
  },
  updateVendor: (id, data) => {
    dispatch(editVendor({ id, data }));
  },
  deleteVendor: data => {
    dispatch(deleteVendor(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Vendors);
