import React, { Component } from "react";
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
  Button
} from "reactstrap";
import Loader from "../../../containers/Loader/Loader";
import PaginationHelper from "../../../helpers/Pagination";
import { withRouter } from "react-router-dom";
import * as qs from "query-string";
import { AppConfig } from "../../../config/AppConfig";
import { ConfirmBox } from "../../../helpers/SweetAlert";
import { toast } from "react-toastify";
import { carsOptions } from "../../../config/Color";
import NoDataFound from "../../common/NoFound";
import { logger } from "../../../helpers/Logger";
import VehicleIcons from "../../../containers/Icons/Vehicles";
import { notExist } from "../../../config/Constants";
// import { Data} from "../../../config/Constants";

class VehiclesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      sort: "",
      user: {},
      openEditModal: false,
      selectedVehicles: [],
      filterApplied: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.windowScroll);
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort, status } = qs.parse(lSearch);
    let filterApplied = false;
    if (search || sort) {
      filterApplied = true;
    }
    this.setState({
      page: parseInt(page) || 1,
      sort: sort || "",
      status: status || "",
      search: search || "",
      filterApplied
    });
    // let abc = [];
    // let data = Data.map((data)=>{
    //   let obj = {}
    //   obj["make"]=data.make;
    //   obj["model"] =data.model;
    //   abc.push(obj);
    //   return true;
    // })
    // console.log("abc",abc);
  }
  windowScroll = () => {
    let featureDiv = document.getElementById(`vehicle10`);
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
  componentDidUpdate({ openEdit, vehicleData }) {
    if (this.props.openEdit !== openEdit) {
      this.setState({
        openEditModal: false
      });
    }
    if (this.props.vehicleData && this.props.vehicleData.vehicleList && vehicleData && vehicleData.vehicleList && this.props.vehicleData.vehicleList !== vehicleData.vehicleList) {
      const { location } = this.props;
      const lSearch = location.search;
      const { page, search, sort, status } = qs.parse(lSearch);
      let filterApplied = false;
      if (search || sort) {
        filterApplied = true;
      }
      this.setState({
        page: parseInt(page) || 1,
        sort: sort || "",
        status: status || "",
        search: search || "",
        filterApplied
      });
    }
  }

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
    });
  };

  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      status: "",
      sort: "",
      user: {},
      selectedVehicles: [],
      filterApplied: false
    });
    this.props.onSearch({});
  };

  editUser = customer => {
    this.props.updateModel(customer);
  };

  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };

  handleCheckboxChnage = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedVehicles } = this.state;
    if (checked) {
      selectedVehicles.push(value);
      this.setState({
        selectedVehicles
      });
      return;
    }
    const index = selectedVehicles.indexOf(value);
    selectedVehicles.splice(index, 1);
    this.setState({
      selectedVehicles
    });
  };

  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    const { vehicleData } = this.props;
    const { vehicleList } = vehicleData;
    const selectedVehicles = [];
    vehicleList.forEach(user => {
      selectedVehicles.push(user._id);
    });
    this.setState({ selectedVehicles });
  };

  handleActionChange = e => {
    const { selectedVehicles } = this.state;
    const { target } = e;
    const { value } = target;
    if (!value) {
      return;
    }
    if (!selectedVehicles.length) {
      toast.error("Please select at least one vehicle.");
      return;
    }
    if (value === "active") {
      this.activateVehicle(true);
    } else if (value === "inactive") {
      this.deactivateVehicle(true);
    } else if (value === "delete") {
      this.onDelete(true);
    }
  };

  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected vehicle(s)?"
        : "Do you want to delete this vehicle?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    this.props.onDelete(this.state.selectedVehicles);
    this.setState({ selectedVehicles: [] });
  };

  activateVehicle = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to active selected vehicle(s)?"
        : "Do you want to active this vehicle?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    this.props.onStatusUpdate({
      status: true,
      vehicles: this.state.selectedVehicles
    });
    this.setState({ selectedVehicles: [] });
  };

  deactivateVehicle = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to inactive selected vehicle(s)?"
        : "Do you want to inactive this vehicle?"
    });
    if (!value) {
      this.setState({
        selectedVehicles: []
      });
      return;
    }
    this.props.onStatusUpdate({
      status: false,
      vehicles: this.state.selectedVehicles
    });
    this.setState({ selectedVehicles: [] });
  };
  carType = type => {
    const ind = carsOptions.findIndex(d => d.value === type);
    if (ind > -1) {
      let src = null;
      try {
        src = require(`../../../assets/img/vehicles/${carsOptions[ind].icons}`);
      } catch (error) {
        logger(error);
      }
      return <img src={src} alt={"type"} width={"80"} />;
    }
    return null;
  };
  handleVehicleDetails = vehicleId => {
    const vehicleDetailsUrl = "/vehicles/details/:id";
    this.props.history.push(vehicleDetailsUrl.replace(":id", `${vehicleId}`));
  };

  render() {
    const { vehicleData } = this.props;
    const { vehicleList, isLoading, totalVehicles } = vehicleData;
    const { page, search, sort, filterApplied } = this.state;

    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row className={"w-auto"}>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  <InputGroup className="mb-2">
                    <input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      className="form-control"
                      value={search}
                      aria-describedby="searchUser"
                      placeholder="Search by make, model, license plate and vin number"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
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
                    <option value={"nasc"}>Make A-Z</option>
                    <option value={"ndesc"}>Make Z-A</option>
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
              {totalVehicles ?
                <Col lg={"4"} md={"4"} className="mb-0 text-right">
                  <div className="total-block mt-1">
                    <span className="">Total Vehicles :</span>&nbsp;
                  <span>{totalVehicles ? totalVehicles : 0}</span>
                  </div>
                </Col>
                : null}
            </Row>
          </Form>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th width="60px">S No.</th>
              <th width={"150"}>
                <i className={"fa fa-car"} /> Type
              </th>
              {/* <th width={"100"}>Color</th> */}
              <th width={"90"}>
                <i className={"fa fa-calendar"} /> Year
              </th>
              <th width={"120"}>
                <i className={"fa fa-industry"} /> Make
              </th>
              <th width={"120"}>
                <i className={"fa fa-automobile"} /> Model
              </th>
              <th width={"100"}>
                <i className={"fa fa-dashboard"} /> Miles
              </th>
              <th width={"150"}> VIN</th>
              <th width={"150"}>
                <i className={"fa fa-address-card-o"} /> License Plate
              </th>
              <th width={"90"} className={"text-center"}>
                <i className={"fa fa-snowflake-o"} /> Unit
              </th>
              <th width={"120"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              vehicleList && vehicleList.length ? (
                vehicleList.map((vehicle, index) => {
                  return (
                    <tr key={index} id={`vehicle${index}`}>
                      <td>
                        {(page - 1) * AppConfig.ITEMS_PER_PAGE + index + 1}.
                      </td>
                      <td>
                        <div
                          className={"vehicle-type-img d-inline-block"}
                          id={`type${index}`}
                        >
                          <VehicleIcons
                            type={vehicle.type.value}
                            color={vehicle.color.color}
                          />
                        </div>
                        <UncontrolledTooltip target={`type${index}`}>
                          {vehicle.type.value}
                        </UncontrolledTooltip>
                        {/* <div className="vehicle-type-title">{vehicle.type ? vehicle.type.label : "N/A"}</div> */}
                      </td>
                      <td>{vehicle.year}</td>
                      <td className={"text-capitalize"}>{vehicle.make}</td>
                      <td className={"text-capitalize"}>{vehicle.modal}</td>
                      <td style={{ maxWidth: 100 }}>
                        {vehicle.miles ? vehicle.miles : notExist}
                      </td>
                      <td style={{ maxWidth: 100 }}>
                        {vehicle.vin ? vehicle.vin : notExist}
                      </td>
                      <td className={"text-uppercase"}>
                        {vehicle.licensePlate ? vehicle.licensePlate : notExist}
                      </td>
                      <td className={"text-center"}>
                        {vehicle.unit ? vehicle.unit : notExist}
                      </td>

                      <td className={"text-center"}>
                        <div className={"d-flex justify-content-center"}>
                          <span className="mr-2">
                            <Button
                              className={"btn-theme-transparent"}
                              size={"sm"}
                              onClick={() =>
                                this.handleVehicleDetails(vehicle._id)
                              }
                              id={`view-${vehicle._id}`}
                            >
                              <i className="fas fa-eye" />
                            </Button>
                            <UncontrolledTooltip target={`view-${vehicle._id}`}>
                              View Details
                            </UncontrolledTooltip>
                          </span>
                          <span className="mr-2">
                            <Button
                              size={"sm"}
                              onClick={() => this.editUser(vehicle)}
                              className={"btn-theme-transparent"}
                              id={"Tooltip-3"}
                            >
                              <i className={"icons cui-pencil"} />
                            </Button>
                            <UncontrolledTooltip target="Tooltip-3">
                              Edit Details
                            </UncontrolledTooltip>
                          </span>
                          <span className="mr-2">
                            <Button
                              className={"btn-theme-transparent"}
                              size={"sm"}
                              onClick={() =>
                                this.setState(
                                  {
                                    selectedVehicles: [vehicle._id]
                                  },
                                  () => {
                                    this.onDelete();
                                  }
                                )
                              }
                              id={`delete-${vehicle._id}`}
                            >
                              <i className={"icons cui-trash"} />
                            </Button>
                            <UncontrolledTooltip
                              target={`delete-${vehicle._id}`}
                            >
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
                    <td className={"text-center"} colSpan={12}>
                      {filterApplied ? (
                        <NoDataFound
                          message={
                            "No Vehicle details found related to your search"
                          }
                          noResult
                        />
                      ) : (
                          <NoDataFound
                            showAddButton
                            message={
                              "Currently there are no Vehicle details added."
                            }
                            onAddClick={this.props.onAddClick}
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
        {vehicleList && vehicleList.length && !isLoading ?
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
        {totalVehicles && !isLoading ? (
          <PaginationHelper
            totalRecords={totalVehicles}
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

export default withRouter(VehiclesList);
