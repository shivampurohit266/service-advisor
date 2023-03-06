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
import Loader from "../../containers/Loader/Loader";
import { formateDate } from "../../helpers/Date";
import PaginationHelper from "../../helpers/Pagination";
import { withRouter, Link } from "react-router-dom";
import * as qs from "query-string";
import { AppConfig } from "../../config/AppConfig";
import { ConfirmBox } from "../../helpers/SweetAlert";
import { CrmUserModal } from "../common/CrmUserModal";
//import { RoleOptions } from "../../config/Constants";
import { toast } from "react-toastify";
import { logger } from "../../helpers/Logger";
import NoDataFound from "../common/NoFound"
import { AppRoutes } from "../../config/AppRoutes"

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      status: "",
      invitaionStatus: "",
      sort: "",
      type: "",
      user: {},
      openEditModal: false,
      selectedUsers: [],
      filterApplied: false,
      bulkAction: ""
    };
  }
  componentDidMount() {
    window.addEventListener("scroll", this.windowScroll);
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort, status, type, invitaionStatus } = qs.parse(
      lSearch
    );
    this.setState({
      page: page > 1 ? parseInt(page) : 1,
      sort: sort || "",
      status: status || "",
      search: search || "",
      type: type || "",
      invitaionStatus: invitaionStatus || "",
      filterApplied: status || search || type || invitaionStatus || false
    });
  }
  windowScroll = () => {
    let featureDiv = document.getElementById(`user10`);
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
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onSearch = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      selectedUsers: []
    });
    const { search, sort, status, type, invitaionStatus } = this.state;
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
    if (status) {
      param.status = status;
      hasFilter = true;
    }
    if (type) {
      param.type = type;
      hasFilter = true;
    }
    if (invitaionStatus) {
      param.invitaionStatus = invitaionStatus;
      hasFilter = true;
    }
    this.setState({ filterApplied: hasFilter });
    this.props.onSearch(param);
  };
  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      status: "",
      invitaionStatus: "",
      sort: "",
      type: "",
      user: {},
      selectedUsers: [],
      filterApplied: false
    });
    this.props.onSearch({});
  };
  onDelete = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to delete selected user(s)?"
        : "Do you want to delete this user?"
    });
    if (!value) {
      this.setState({
        selectedUsers: []
      });
      return;
    }
    this.props.onDelete(this.state.selectedUsers);
  };
  editUser = user => {
    this.setState({ user }, () => {
      this.props.modelOperate({
        editUserModal: true
      });
    });
  };
  onUpdate = (id, data) => {
    this.props.onUpdate(id, data);
  };
  handleCheckboxChnage = e => {
    const { target } = e;
    const { checked, value } = target;
    const { selectedUsers } = this.state;
    if (checked) {
      selectedUsers.push(value);
      this.setState({
        selectedUsers
      });
      return;
    }
    const index = selectedUsers.indexOf(value);
    selectedUsers.splice(index, 1);
    this.setState({
      selectedUsers
    });
  };
  handleCheckAllCheckBox = e => {
    const { target } = e;
    const { checked } = target;
    if (!checked) {
      this.setState({
        selectedUsers: [],
        bulkAction: ""
      });
      return;
    }
    const { userData } = this.props;
    const { users } = userData;
    const selectedUsers = [];
    users.forEach(user => {
      selectedUsers.push(user._id);
    });
    this.setState({ selectedUsers });
  };
  activateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to active selected user(s)?"
        : "Do you want to active this user?"
    });
    if (!value) {
      this.setState({
        selectedUsers: [],
        bulkAction: ""
      });
      return;
    }
    this.props.onStatusUpdate({ status: 1, users: this.state.selectedUsers });
  };
  deactivateUsers = async (isMultiple = false) => {
    const { value } = await ConfirmBox({
      text: isMultiple
        ? "Do you want to inactive selected user(s)?"
        : "Do you want to inactive this user?"
    });
    if (!value) {
      this.setState({
        selectedUsers: [],
        bulkAction: ""
      });
      return;
    }
    this.props.onStatusUpdate({ status: 0, users: this.state.selectedUsers });
  };
  handleActionChange = e => {
    const { selectedUsers } = this.state;
    const { target } = e;
    const { value } = target;
    this.setState({
      bulkAction: value
    });
    if (!value) {
      return;
    }
    if (!selectedUsers.length) {
      toast.error("Please select at least one user.");
      return;
    }
    if (value === "active") {
      this.activateUsers(true);
    } else if (value === "inactive") {
      this.deactivateUsers(true);
    } else if (value === "delete") {
      this.onDelete(true);
    }
  };

  onAddClick = () => {
    this.props.modelOperate({
      addUserModal: true
    });
  }
  handleUserView = userId => {
    this.props.redirectTo(AppRoutes.STAFF_MEMBERS_DETAILS.url.replace(":id", `${userId}`));
  };

  render() {
    const { userData, openEdit } = this.props;
    const { users, isLoading, totalUsers } = userData;
    logger(openEdit, this.state);

    const {
      page,
      search,
      sort,
      status,
      invitaionStatus,
      //type,
      user,
      selectedUsers,
      filterApplied,
      bulkAction
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
                      placeholder="Search by member name and email"
                    />
                  </InputGroup>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  {/* <Label htmlFor="exampleSelect" className="label">
                    Invitation Status
                  </Label> */}
                  <Input
                    type="select"
                    name="invitaionStatus"
                    id="exampleSelect"
                    onChange={this.handleChange}
                    value={invitaionStatus}
                  >
                    <option className="form-control" value={""}>
                      Invitation Status
                    </option>
                    <option value={1}>Accepted</option>
                    <option value={0}>Pending</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"2"} md={"2"} className="mb-0">
                <FormGroup className="mb-0">
                  {/* <Label htmlFor="exampleSelect" className="label">
                    User Status
                  </Label> */}
                  <Input
                    type="select"
                    name="status"
                    id="exampleSelect"
                    onChange={this.handleChange}
                    value={status}
                  >
                    <option className="form-control" value={""}>
                      User Status
                    </option>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
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
                    <option value={"createddesc"}>Last Created</option>
                    <option value={"loginasc"}>Last login</option>
                    <option value={"nasc"}>Name A-Z</option>
                    <option value={"ndesc"}>Name Z-A</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg={"3"} md={"3"} className="mb-0">
                <Row>
                  {/* <Col md={"6"}>
                    <FormGroup className="mb-0">
                      <Label htmlFor="SortFilter" className="label">
                        User Type
                      </Label>
                      <Input
                        type="select"
                        name="type"
                        id="SortFilter"
                        onChange={this.handleChange}
                        value={type}
                      >
                        <option className="form-control" value={""}>
                          User Type
                        </option>
                        {RoleOptions.map((role, index) => {
                          return (
                            <option value={role.key} key={index}>
                              {role.text}
                            </option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                  </Col> */}
                  <Col lg={"6"} md={"6"} className="mb-0">
                    <div className="filter-btn-wrap">
                      <Label className="height17 label" />
                      <div className="form-group mb-0">
                        <span className="mr-2">
                          <Button
                            type="submit"
                            className="btn btn-theme-transparent"
                            id="Tooltip-1"
                          >
                            <i className="icons cui-magnifying-glass"></i>
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
                            <i className="icon-refresh icons"></i>
                          </Button>
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
        <Table responsive>
          <thead>
            <tr>
              <th width="90px">
                <div className="table-checkbox-wrap">
                  <span className="checkboxli checkbox-custom checkbox-default">
                    <Input
                      type="checkbox"
                      name="checkbox"
                      id="checkAll"
                      checked={
                        selectedUsers.length === users.length && users.length
                      }
                      onChange={this.handleCheckAllCheckBox}
                    />
                    <label className="" htmlFor="checkAll" />
                  </span>
                  <Input
                    className="commonstatus"
                    type="select"
                    id="exampleSelect"
                    onChange={this.handleActionChange}
                    disabled={!users.length}
                    value={bulkAction}
                  >
                    <option value={""}>Select</option>
                    {users.length ? (
                      <>
                        <option value={"active"}>Active</option>
                        <option value={"inactive"}>Inactive</option>
                        <option value={"delete"}>Delete</option>
                      </>
                    ) : null}
                  </Input>
                </div>
              </th>
              <th width={"300"}><i className={"fa fa-users"} /> {AppRoutes.STAFF_MEMBERS.name} Details</th>
              {/* <th>Email</th> */}
              <th width={"130"}><i className={"fa fa-dollar"} /> Hourly Rate</th>
              <th width={"150"} ><i className={"fa fa-user-circle"} /> Role</th>
              {/* <th><i class="fa fa-clock-o"></i> Created</th> */}
              {/* <th>Last Login IP</th> */}
              <th width={"150"} className={"text-center"}><i className={"fa fa-share-alt"} /> Invitation Status</th>
              <th width={"150"} className={"text-center"}><i className={"fa fa-exclamation-circle"} /> Status</th>
              <th width={"200"}><i className={"fa fa-sign-in"} /> Created /  Login Details</th>
              <th width={"140"} className={"text-center"}>Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              users.length ? (
                users.map((user, index) => {
                  return (
                    <tr key={index} id={`user${index}`}>
                      <td>
                        <div className="checkbox-custom checkbox-default coloum-checkbox">
                          <Input
                            type="checkbox"
                            value={user._id}
                            checked={
                              selectedUsers.indexOf(
                                user._id
                              ) > -1
                            }
                            name="checkbox"
                            onChange={
                              this.handleCheckboxChnage
                            }
                          />
                          <label htmlFor={user._id}>
                            {(page - 1) *
                              AppConfig.ITEMS_PER_PAGE +
                              index +
                              1}
                            .
                          </label>
                        </div>
                      </td>
                      <td>
                        <Link to={AppRoutes.STAFF_MEMBERS_DETAILS.url.replace(":id", user._id)} target="_blank"
                          className={
                            "text-capitalize font-weight-semibold cursor_pointer text-primary"
                          }
                        >
                          {[user.firstName, user.lastName]
                            .join(" ")
                            .trim()}
                        </Link>
                        <div>
                          {user.email ? (
                            <a
                              href={`mailto:${user.email}`}
                              className={"text-body"}
                            >
                              {user.email}
                            </a>
                          ) : (
                              "-"
                            )}{" "}
                        </div>
                      </td>
                      <td>
                        {user.rate ? (
                          <span className="dollar-price">
                            <i className="fa fa-dollar dollar-icon" />
                            {[user.rate.toFixed(2)]}
                          </span>
                        ) : (
                            "-"
                          )}
                      </td>
                      <td className={"text-capitalize"}>
                        {"Technician"}
                      </td>
                      {/* <td>
                        {user.createdAt ? formateDate(user.createdAt) : "-"}
                      </td> */}
                      <td className={"text-center"}>
                        {user.userSideActivation ? (
                          <Badge color="success">
                            Accepted
                          </Badge>
                        ) : (
                            <Badge color="warning">
                              Pending
                          </Badge>
                          )}
                      </td>
                      <td className={"text-center"}>
                        {user.status ? (
                          <Badge
                            className={"badge-button"}
                            color="success"
                            onClick={() => {
                              this.setState(
                                {
                                  selectedUsers: [user._id]
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
                                    selectedUsers: [user._id]
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
                        <div id={`create${index}`}>
                          {user.createdAt
                            ? formateDate(user.createdAt)
                            : " "}
                          {user.createdAt ? (
                            <UncontrolledTooltip
                              target={`create${index}`}
                            >
                              Created At
                            </UncontrolledTooltip>
                          ) : null}
                        </div>
                        <div id={`loginip-${index}`}>
                          {user.loggedInAt || "-"}
                          {user.loggedInAt ? (
                            <UncontrolledTooltip
                              target={`loginip-${index}`}
                            >
                              Last Login Ip Address
                            </UncontrolledTooltip>
                          ) : null}
                        </div>
                      </td>
                      <td className={"text-center"}>
                        <span className="mr-1">
                          <Button
                            className={
                              "btn-theme-transparent"
                            }
                            size={"sm"}
                            onClick={() =>
                              this.handleUserView(user._id)
                            }
                            id={`view-${user._id}`}
                          >
                            <i className="fas fa-eye" />
                          </Button>
                          <UncontrolledTooltip
                            target={`view-${user._id}`}
                          >
                            View
                          </UncontrolledTooltip>
                        </span>
                        <span >
                          <Button
                            size={"sm"}
                            onClick={() =>
                              this.editUser(user)
                            }
                            id={`edit-${user._id}`}
                            className={
                              "btn-theme-transparent"
                            }
                          >
                            <i
                              className={"icons cui-pencil"}
                            />
                          </Button>{" "}
                          <UncontrolledTooltip
                            target={`edit-${user._id}`}
                          >
                            Edit
                          </UncontrolledTooltip>
                        </span>
                        <span className="mr-1">
                          <Button
                            size={"sm"}
                            onClick={() =>
                              this.setState(
                                {
                                  selectedUsers: [user._id]
                                },
                                () => {
                                  this.onDelete();
                                }
                              )
                            }
                            id={`delete-${user._id}`}
                            className={
                              "btn-theme-transparent"
                            }
                          >
                            <i
                              className={"icons cui-trash"}
                            />
                          </Button>
                          <UncontrolledTooltip
                            target={`delete-${user._id}`}
                          >
                            Delete
                          </UncontrolledTooltip>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={12}>
                      {filterApplied ? <NoDataFound message={"No Technician details found related to your search"} noResult /> :
                        <NoDataFound showAddButton message={"Currently there are no technican details added."} onAddClick={this.onAddClick} />
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
          </tbody>
        </Table>
        {users && users.length && !isLoading ?
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
        {totalUsers && !isLoading ? (
          <PaginationHelper
            totalRecords={totalUsers}
            onPageChanged={page => {
              this.setState({ page });
              this.props.onPageChange(page);
            }}
            currentPage={page}
            pageLimit={AppConfig.ITEMS_PER_PAGE}
          />
        ) : null}

        <CrmUserModal
          userModalOpen={openEdit}
          handleUserModal={() => {
            this.setState({ user: {} });
            this.props.modelOperate({
              editUserModal: false
            });
          }}
          userData={user}
          updateUser={this.onUpdate}
        />
      </>
    );
  }
}

export default withRouter(UserList);
