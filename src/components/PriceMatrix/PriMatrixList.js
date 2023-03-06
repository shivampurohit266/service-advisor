import {
  Col,
  Button,
  UncontrolledTooltip,
  Label,
  InputGroup,
  Table,
  Form,
  Row,
  FormGroup,
  Badge,
  Input
} from "reactstrap";
import { withRouter } from "react-router-dom";
import * as qs from "query-string";
import moment from "moment";
import React, { Component } from "react";

import { AppConfig } from "../../config/AppConfig";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";

class PriMatrixList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      search: "",
      sort: "",
      isTireSizeOpen: -1,
      filterApplied: false
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const lSearch = location.search;
    const { page, search, sort } = qs.parse(lSearch);
    let filterApplied = false;
    if (search || sort) {
      filterApplied = true;
    }
    this.setState({
      page: parseInt(page) || 1,
      search: search || "",
      sort: sort || "",
      filterApplied
    });
  }

  componentDidUpdate = ({ matrixList }) => {
    if (matrixList !== this.props.matrixList) {
      const { location } = this.props;
      const lSearch = location.search;
      const { page, search, sort } = qs.parse(lSearch);
      this.setState({
        page: parseInt(page) || 1,
        search: search || "",
        sort: sort || ""
      });
    }
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
      filterApplied: true
    });
    const { search, sort } = this.state;
    let param = {};
    param.page = 1;
    if (search) {
      param.search = search.trim(" ");
    }
    if (sort) {
      param.sort = sort.trim("");
    }
    this.props.onSearch(param);
  };

  onReset = e => {
    e.preventDefault();
    this.setState({
      page: 1,
      search: "",
      sort: "",
      filterApplied: false
    });
    this.props.onSearch({});
  };
  handleMatrixOpen = index => {
    this.setState({
      isTireSizeOpen: this.state.isTireSizeOpen === index ? -1 : index
    });
  };
  render() {
    const {
      matrixList,
      handleUpdateMatrix,
      handleMatrixDelete,
      isLoading
    } = this.props;
    const { page, search, sort, isTireSizeOpen, filterApplied } = this.state;
    return (
      <>
        <div className={"filter-block"}>
          <Form onSubmit={this.onSearch}>
            <Row>
              <Col lg={"4"} md={"4"} className="mb-0">
                <FormGroup className="mb-0">
                  <InputGroup className="mb-2">
                    <input
                      type="text"
                      name="search"
                      onChange={this.handleChange}
                      value={search}
                      className="form-control"
                      aria-describedby="searchUser"
                      placeholder="Search by matrix name"
                    />
                  </InputGroup>
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
                        className="btn btn-secondary btn-theme-transparent"
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
                        className="btn btn-secondary btn-theme-transparent"
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
        <Table responsive className={"matrix-table"}>
          <thead>
            <tr>
              <th className={"text-center"} width={"60"}>
                S No.
              </th>
              <th width={"320"}>
                <i className={"fas fa-hand-holding-usd"} /> Matrix Name
              </th>
              <th width={"550"} colSpan={"3"}>
                <div className={"d-flex matrix-range-th"}>
                  <span>
                    <i className={"fa fa-dollar"} /> Cost Range
                  </span>
                  <span>
                    <i className={"fa fa-money"} /> Markup
                  </span>
                  <span>
                    <i className={"fa fa-line-chart"} /> Margin
                  </span>
                </div>
              </th>
              <th width={"200"}>
                <i className="fa fa-clock-o" /> Created At
              </th>
              {/*<th width={"200"}>Markup</th> */}
              {/* <th width={"200"}>Creted At</th> */}
              <th width={"140"} className={"text-center"}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              matrixList && matrixList.length ? (
                matrixList.map((matrix, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="checkbox-custom checkbox-default coloum-checkbox">
                          {(page - 1) * AppConfig.ITEMS_PER_PAGE +
                            index +
                            1}
                        </div>
                      </td>
                      <td>{matrix.matrixName || "-"}</td>
                      <td colSpan={"3"}>
                        {matrix.matrixRange && matrix.matrixRange.length ? (
                          <div>
                            <div className={"d-flex matrix-range-th"}>
                              <span className={"p-1"}>
                                <span className="dollar-price">
                                  <i className="fa fa-dollar dollar-icon" />
                                  {matrix.matrixRange[0].lower}
                                </span>{" "}
                                &nbsp;-&nbsp;
                                <span className="dollar-price">
                                  {matrix.matrixRange[0].upper !==
                                    "beyond" ? (
                                      <i className="fa fa-dollar dollar-icon" />
                                    ) : null}
                                  {matrix.matrixRange[0].upper}
                                </span>
                              </span>
                              <span className={"p-1"}>
                                {matrix.matrixRange[0].markup + "%"}
                              </span>
                              <span className={"p-1"}>
                                {matrix.matrixRange[0].margin + "%"}
                              </span>
                            </div>
                            <div
                              className={
                                isTireSizeOpen === index
                                  ? "active"
                                  : "inactive"
                              }
                            >
                              {matrix.matrixRange &&
                                matrix.matrixRange.length
                                ? matrix.matrixRange.map((range, i) => {
                                  return i === 0 ? null : (
                                    <div
                                      key={i}
                                      className={
                                        "d-flex matrix-range-th "
                                      }
                                    >
                                      <span className={"p-1"}>
                                        <span className="dollar-price">
                                          <i className="fa fa-dollar dollar-icon" />
                                          {range.lower}
                                        </span>{" "}
                                        &nbsp;-&nbsp;
                                          <span className="dollar-price">
                                          {range.upper !== "beyond" ? (
                                            <i className="fa fa-dollar dollar-icon" />
                                          ) : null}
                                          {range.upper}
                                        </span>
                                      </span>
                                      <span className={"p-1"}>
                                        {range.markup + "%"}
                                      </span>
                                      <span className={"p-1"}>
                                        {range.margin + "%"}
                                      </span>
                                    </div>
                                  );
                                })
                                : null}
                            </div>
                            {matrix.matrixRange &&
                              matrix.matrixRange.length &&
                              matrix.matrixRange[1] ? (
                                <span className={"m-1 d-block"}>
                                  <Badge
                                    onClick={() =>
                                      this.handleMatrixOpen(index)
                                    }
                                    className={"cursor_pointer"}
                                  >
                                    {isTireSizeOpen === index
                                      ? "View Less"
                                      : "View More"}
                                  </Badge>
                                </span>
                              ) : null}
                          </div>
                        ) : null}
                      </td>

                      <td>
                        <div>
                          {moment(matrix.createdAt).format("MMM Do YYYY")}
                        </div>
                        <div>
                          {moment(matrix.createdAt).format("h:mm a")}
                        </div>
                      </td>

                      <td width={"140"} className={"text-center"}>
                        <span className="mr-2">
                          <Button
                            color={"secondary"}
                            size={"sm"}
                            onClick={() => handleUpdateMatrix(matrix)}
                            className={"btn-theme-transparent"}
                            id={`Tooltip-1${matrix._id}`}
                          >
                            <i className={"icons cui-pencil"} />
                          </Button>
                          <UncontrolledTooltip
                            target={`Tooltip-1${matrix._id}`}
                          >
                            Edit
                          </UncontrolledTooltip>
                        </span>
                        <Button
                          color={"secondary"}
                          size={"sm"}
                          className={"btn-theme-transparent"}
                          onClick={() => handleMatrixDelete(matrix._id)}
                          id={`Tooltip-${matrix._id}`}
                        >
                          <i className={"icons cui-trash"} />
                        </Button>
                        <UncontrolledTooltip
                          target={`Tooltip-${matrix._id}`}
                        >
                          Delete
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td className={"text-center"} colSpan={7}>
                      {filterApplied ? (
                        <NoDataFound
                          message={
                            "No Matrix details found related to your search"
                          }
                          noResult
                        />
                      ) : (
                          <NoDataFound
                            showAddButton
                            message={
                              "Currently there are no Price Matrix added."
                            }
                            onAddClick={this.props.onClick}
                          />
                        )}
                    </td>
                  </tr>
                )
            ) : (
                <tr>
                  <td className={"text-center"} colSpan={7}>
                    <Loader />
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
      </>
    );
  }
}

export default withRouter(PriMatrixList);
