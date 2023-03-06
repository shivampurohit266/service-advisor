import React, { Component } from "react";
import {
  getTiersList,
  updateTierStatus,
  deleteTier,
  editTier,
  getInventoryPartVendors,
  getMatrixList
} from '../../../actions'
import { connect } from "react-redux";
import * as qs from "query-string";
import {
  Table,
  UncontrolledTooltip,
  Form,
  FormGroup,
  Row,
  Col,
  Label,
  InputGroup,
  Input,
  Button,
  Badge
} from "reactstrap";
import { AppConfig } from "../../../config/AppConfig";
import Loader from "../../../containers/Loader/Loader";
import PaginationHelper from "../../../helpers/Pagination";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import { toast } from "react-toastify";
import { CrmTyreModal } from "../../common/Tires/CrmTyreModal"
import { Async } from "react-select";
import moment from 'moment';
import NoDataFound from "../../common/NoFound"
import { logger } from "../../../helpers/Logger";
import { notExist } from "../../../config/Constants";

class Tires extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      invitaionStatus: "",
      sort: "",
      type: "",
      vendorId: "",
      vendorInput: "",
      tire: {},
      openEditModal: false,
      selectedTires: [],
      filterApplied: false,
      bulkAction: "",
      isTireSizeOpen: -1,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.windowScroll);
    const { location } = this.props;
    this.props.getPriceMatrix()
    const query = qs.parse(location.search);
    const lSearch = location.search;
    const { page, search, sort } = qs.parse(lSearch);
    let filterApplied = false;
    if (search || sort) {
      filterApplied = true;
    }
    this.props.getTires({ ...query, page: query.page || 1 });
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      search: search || "",
      filterApplied
    })
  }

  windowScroll = () => {
    let featureDiv = document.getElementById(`tire10`);
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
  componentDidUpdate({ tireReducer, location }) {
    if (
      this.props.tireReducer.tireData.isSuccess !==
      tireReducer.tireData.isSuccess
    ) {
      if (this.props.tireReducer.tireData.isSuccess) {
        const query = qs.parse(this.props.location.search);
        this.props.getTires({ ...query, page: query.page || 1 });
      }
    }
    if (
      this.props.tireReducer.tireData.isEditSuccess !==
      tireReducer.tireData.isEditSuccess
    ) {
      if (this.props.tireReducer.tireData.isEditSuccess) {
        const query = qs.parse(this.props.location.search);
        this.props.getTires({ ...query, page: query.page || 1 });
      }
    }
    const { location: currentLocation } = this.props;
    const { search } = location;
    const { search: currentSearch } = currentLocation;
    if (search !== currentSearch) {
      let query = qs.parse(currentSearch);
      this.setState({ ...query, page: query.page ? parseInt(query.page) : 1 });
      if (query.vendorId) {
        const vendorId = qs.parse(query.vendorId);
        this.setState({
          vendorId
        });
        query.vendorId = vendorId.value;
      }
      this.props.getTires(query)
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      selectedTires: []
    });
    const { search, status, sort, vendorId } = this.state;
    const query = {
      page: 1,
      search,
      status,
      sort,
      vendorId: vendorId ? qs.stringify(vendorId) : undefined,
      vendorInput: ""
    };
    this.setState({
      filterApplied: true,
      page: 1
    });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(query)].join("?"))
  };

  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      status: "",
      sort: "",
      type: "",
      vendorId: "",
      tire: {},
      selectedTires: [],
      filterApplied: false
    });
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo(`${pathname}`);
  };

  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected tier(s)?"
        : "Do you want to delete this tier?"
    });
    if (!value) {
      this.setState({
        selectedTires: []
      });
      return;
    }
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    const data = {
      ...query,
      tireId: this.state.selectedTires,
    };
    this.props.deleteTire(data);
    this.setState({ selectedTires: [] });
  };

  editTire = tier => {
    logger(tier, "!!!!!!!!!!!!!!!!!!!!!")
    this.setState({ tire: tier }, () => {
      this.props.modelOperate({
        tireEditModalOpen: true
      });
    });
  };

  onUpdate = (id, data) => {
    this.props.updateTire(id, data);
  };

  handleCheckboxChnage = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedTires } = this.state;
    if (checked) {
      selectedTires.push(value);
      this.setState({
        selectedTires
      });
      return;
    }
    const index = selectedTires.indexOf(value);
    selectedTires.splice(index, 1);
    this.setState({
      selectedTires
    });
  };

  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedTires: [],
        bulkAction: ""
      });
      return;
    }
    const { tireReducer } = this.props;
    const { tires } = tireReducer;
    const selectedTires = [];
    tires.forEach(tire => {
      selectedTires.push(tire._id);
    });
    this.setState({ selectedTires });
  };

  handleActionChange = e => {
    const { selectedTires } = this.state;
    const { target } = e;
    const { value } = target;
    this.setState({
      bulkAction: value
    });
    if (!value) {
      return;
    }
    if (!selectedTires.length) {
      toast.error("Please select at least one tire.");
      return;
    }
    if (value === "active") {
      this.activateTires(true);
    } else if (value === "inactive") {
      this.deactivateTires(true);
    } else if (value === "delete") {
      this.onDelete(true);
    }
  };
  loadOptions = (input, callback) => {
    this.setState({ vendorInput: input.length > 1 ? input : null });
    this.props.getInventoryPartsVendors({ input, callback });
  };
  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join('?')
    );
  };
  handleSize = (id, index) => {
    this.setState({
      toggle: !this.state.toggle,
      isTireSizeOpen: this.state.isTireSizeOpen === index ? -1 : index,
      tireSizeid: id
    })
  }

  render() {
    const { tireReducer, modelInfoReducer, modelOperate, matrixListReducer, getPriceMatrix, onAddClick } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { tireEditModalOpen } = modelDetails;
    const { tires, isLoading, totalTires } = tireReducer;
    const {
      page,
      search,
      sort,
      tire,
      vendorId,
      status,
      vendorInput,
      isTireSizeOpen,
      filterApplied
    } = this.state;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"3"} md={"3"} className="mb-0">
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
                      placeholder="Search by brand, modal and seasonality"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  {/* <Label htmlFor="exampleSelect" className="label">
                    Filter by
                  </Label> */}
                  <Input
                    type="select"
                    name="status"
                    id="exampleSelect"
                    onChange={this.handleChange}
                    value={status}
                  >
                    <option className="form-control" value={""}>
                      Filter by
                    </option>
                    <option value={"critical"}>Critical Quantity</option>
                    <option value={"ncritical"}>
                      Non-Critical Quantity
                    </option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  {/* <Label htmlFor="SortFilter" className="label">
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
                    <option value={"qltoh"}>Quantity(Low to High)</option>
                    <option value={"qhtol"}>Quantity(High to High)</option>
                    <option value={"cltoh"}>Cost(Low to High)</option>
                    <option value={"chtol"}>Cost(High to High)</option>
                    <option value={"rpltoh"}>
                      Retail Price(Low to High)
                    </option>
                    <option value={"rphtol"}>
                      Retail Price(High to High)
                    </option>
                    <option value={"cdltoh"}>Last created</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"5"} md={"5"} className="mb-0">
                <Row>
                  <Col md={"6"}>
                    <FormGroup className="mb-0">
                      {/* <Label htmlFor="SortFilter" className="label">
                        Vendor
                      </Label> */}
                      <Async
                        placeholder={"Type vendor name"}
                        loadOptions={this.loadOptions}
                        value={vendorId}
                        onChange={e => {
                          this.setState({
                            vendorId: e
                          });
                        }}
                        isClearable={true}
                        noOptionsMessage={() =>
                          vendorInput
                            ? "No vendor found"
                            : "Type vendor name"
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col lg={"6"} md={"6"} className="mb-0">
                    <div className="filter-btn-wrap">
                      <Label className="height17 label" />
                      <div className="form-group mb-0">
                        <span className="mr-2">
                          <button
                            type="submit"
                            className="btn btn-theme-transparent btn-secondary"
                            id="Tooltip-1"
                          >
                            <i className="icons cui-magnifying-glass" />
                          </button>
                          <UncontrolledTooltip target="Tooltip-1">
                            Search
                          </UncontrolledTooltip>
                        </span>
                        <span className="">
                          <button
                            type="button"
                            className="btn btn-theme-transparent btn-secondary"
                            id="Tooltip-2"
                            onClick={this.onReset}
                          >
                            <i className="icon-refresh icons" />
                          </button>
                          <UncontrolledTooltip target={"Tooltip-2"}>
                            Reset all filters
                          </UncontrolledTooltip>
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
        <Table responsive className={"tire-table"}>
          <thead>
            <tr>
              <th width="90px" className={"s-no-th"}>
                {/* <div className="table-checkbox-wrap">
                  {tires && tires.length ?
                    <span className='checkboxli checkbox-custom checkbox-default' >
                      <Input
                        type='checkbox'
                        name='checkbox'
                        id='checkAll'
                        checked={tires && tires.length ? selectedTires.length === tires.length : null}
                        onChange={this.handleCheckAllCheckBox}
                      />
                      <label className='' htmlFor='checkAll'></label>
                    </span> :
                    <span className='checkboxli checkbox-custom checkbox-default' >
                      <label></label>
                    </span>
                  }
                  {tires && tires.length ? (
                    <Input
                      className='commonstatus'
                      type='select'
                      id='exampleSelect'
                      onChange={this.handleActionChange}
                    >
                      <option value={''}>Select</option>
                      <option value={'delete'}>Delete</option>
                    </Input>
                  ) :
                    <Input
                      className='commonstatus'
                      type='select'
                      id='exampleSelect'
                      disabled
                      onChange={this.handleActionChange}
                    >
                      <option value={''}>Select</option>
                      <option value={'delete'}>Delete</option>
                    </Input>}
                </div> */}
                S No.
              </th>
              <th width={"280"}>
                <i className="fa fa-cube" /> Brand Info
              </th>
              <th width={"200"}>
                <i className="fa fa-life-saver" /> Size
              </th>
              <th width={"280"}>
                <i className="fa fa-id-badge" /> Vendor
              </th>
              <th width={"280"}>
                <i className="fa fa-cloud" /> Seasonality
              </th>
              <th width={"280"}>
                <i className="fa fa-clock-o" /> Created
              </th>
              <th width={"130"} className={"text-center action-td"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              tires.length ? (
                tires.map((tire, index) => {
                  return (
                    <>
                      <tr key={index} id={`tire${index}`}>
                        <td>
                          {/* <div className="checkbox-custom checkbox-default coloum-checkbox">
                            <Input
                              type="checkbox"
                              value={tire._id}
                              checked={selectedTires.indexOf(tire._id) > -1}
                              name="checkbox"
                              onChange={this.handleCheckboxChnage}
                            />
                            <label htmlFor={tire._id}>
                            </label>
                          </div> */}
                          {(page - 1) * AppConfig.ITEMS_PER_PAGE +
                            index +
                            1}
                          .
                        </td>
                        <td className={"text-capitalize"}>
                          <div className={"font-weight-semibold"}>
                            {tire.brandName || "-"}
                          </div>
                          {tire.modalName ? (
                            <div className={"modal-info"}>
                              Modal : <Badge>{tire.modalName}</Badge>
                            </div>
                          ) : (
                              " "
                            )}
                        </td>
                        {/* <td className={"text-capitalize"}>{tire.modalName || "-"}</td> */}
                        <td>
                          {tire.tierSize && tire.tierSize.length ? (
                            <Button
                              size={"sm"}
                              className={"btn-square btn-light second"}
                              onClick={() =>
                                this.handleSize(tire._id, index)
                              }
                            >
                              <b>Size Details</b>
                              {isTireSizeOpen === index ? (
                                <i class="icons icon-arrow-up ml-2" />
                              ) : (
                                  <i class="icons icon-arrow-down ml-2" />
                                )}
                            </Button>
                          ) : (
                              notExist
                            )}
                        </td>
                        <td>
                          {tire.vendorId && tire.vendorId.name ? (
                            <a
                              href={`/inventory/vendors?page=1&search=${
                                tire.vendorId && tire.vendorId.name
                                  ? tire.vendorId.name
                                  : null
                                }`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={"text-body"}
                            >
                              {tire.vendorId && tire.vendorId.name
                                ? tire.vendorId.name
                                : "-"}
                            </a>
                          ) : tire.vendorId && tire.vendorId.name ? (
                            tire.vendorId.name
                          ) : (
                                notExist
                              )}
                        </td>
                        <td className={"season-td text-capitalize"}>
                          {tire.seasonality || "-"}
                        </td>
                        <td>
                          <div>
                            {moment(tire.createdAt).format("MMM Do YYYY")}
                          </div>
                          <div>
                            {moment(tire.createdAt).format("h:mm a")}
                          </div>
                        </td>
                        <td className={"text-center action-td"}>
                          <Button
                            size={"sm"}
                            onClick={() => this.editTire(tire)}
                            id={`edit-${tire._id}`}
                            className={"btn-theme-transparent"}
                          >
                            <i className={"icons cui-pencil"} />
                          </Button>{" "}
                          <UncontrolledTooltip target={`edit-${tire._id}`}>
                            Edit
                          </UncontrolledTooltip>
                          &nbsp;
                          <Button
                            size={"sm"}
                            onClick={() =>
                              this.setState(
                                {
                                  selectedTires: [tire._id]
                                },
                                () => {
                                  this.onDelete();
                                }
                              )
                            }
                            id={`delete-${tire._id}`}
                            className={"btn-theme-transparent"}
                          >
                            <i className={"icons cui-trash"} />
                          </Button>
                          <UncontrolledTooltip
                            target={`delete-${tire._id}`}
                          >
                            Delete
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      {/* {isTireSizeOpen && tire.tierSize && tireSizeid === tire._id && tire.tierSize.length ? */}

                      {tire.tierSize && tire.tierSize.length ? (
                        <tr
                          className={
                            isTireSizeOpen === index ? "active" : "inactive"
                          }
                        >
                          <td colSpan={"7"} key={index} className={"p-0"}>
                            <Table className={"size-desc-table"}>
                              <thead>
                                <tr>
                                  <th width={"90"} className={"s-no-th"} />
                                  <th className={"tire-th"} width={"280"}>
                                    Size
                                  </th>
                                  <th className={"tire-th"} width={"200"}>
                                    Part
                                  </th>
                                  <th className={"tire-th"} width={"280"}>
                                    Cost
                                  </th>
                                  <th className={"tire-th"} width={"280"}>
                                    Retails Price
                                  </th>
                                  <th className={"tire-th"} width={"280"}>
                                    Quatity
                                  </th>
                                  <th
                                    className={"tire-bin-th"}
                                    width={"130"}
                                  >
                                    BIN/Location
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {tire.tierSize.length
                                  ? tire.tierSize.map((size, index) => {
                                    return (
                                      <tr key={index}>
                                        <td />
                                        <td width={"100"}>
                                          {size.baseInfo.replace(
                                            "_ __" || "_" || "___",
                                            ""
                                          ) || "-"}
                                        </td>
                                        <td>{size.part || notExist}</td>
                                        <td width={"70"}>
                                          {size.cost ? (
                                            <span class="dollar-price">
                                              <i class="fa fa-dollar dollar-icon" />
                                              {size.cost}
                                            </span>
                                          ) : (
                                              notExist
                                            )}
                                        </td>
                                        <td width={"70"}>
                                          {size.retailPrice ? (
                                            <span class="dollar-price">
                                              <i class="fa fa-dollar dollar-icon" />
                                              {size.retailPrice}
                                            </span>
                                          ) : (
                                              notExist
                                            )}
                                        </td>
                                        <td width={"70"}>
                                          {size.quantity || 0}&nbsp;
                                            {size.quantity <=
                                            size.criticalQuantity ? (
                                              <Badge color={"warning"}>
                                                Reorder
                                              </Badge>
                                            ) : null}
                                        </td>
                                        <td width={"70"}>
                                          {size.bin || notExist}
                                        </td>
                                      </tr>
                                    );
                                  })
                                  : null}
                              </tbody>
                            </Table>
                          </td>
                        </tr>
                      ) : null}
                    </>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={12}>
                      {filterApplied ? (
                        <NoDataFound
                          message={
                            "No Tire details found related to your search"
                          }
                          noResult
                        />
                      ) : (
                          <NoDataFound
                            showAddButton
                            message={"Currently there are no Tires added."}
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
        {tires && tires.length && !isLoading ?
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
        {totalTires && !isLoading ? (
          <PaginationHelper
            totalRecords={totalTires}
            onPageChanged={page => {
              this.setState({ page });
              this.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}

        <CrmTyreModal
          tyreModalOpen={tireEditModalOpen}
          handleTierModal={() => {
            this.setState({ tier: {} });
            modelOperate({
              tireEditModalOpen: !tireEditModalOpen
            });
          }}
          tireData={tire}
          updateTire={this.onUpdate}
          matrixList={matrixListReducer.matrixList}
          getPriceMatrix={getPriceMatrix}
          getInventoryPartsVendors={this.props.getInventoryPartsVendors}
          vendorList={this.props.vendorReducer}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  tireReducer: state.tiresReducer,
  modelInfoReducer: state.modelInfoReducer,
  vendorReducer: state.vendorsReducer,
  matrixListReducer: state.matrixListReducer,
});
const mapDispatchToProps = dispatch => ({
  getTires: data => {
    dispatch(getTiersList(data));
  },
  onStatusUpdate: data => {
    dispatch(updateTierStatus(data));
  },
  deleteTire: data => {
    dispatch(deleteTier(data));
  },
  updateTire: (id, data) => {
    dispatch(editTier({ id, data }));
  },
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
  getPriceMatrix: (data) => {
    dispatch(getMatrixList(data))
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tires);
