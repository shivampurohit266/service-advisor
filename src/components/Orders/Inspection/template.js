import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table
} from "reactstrap";
import { Async } from "react-select";
import NoFound from "../../common/NoFound";
import closeIcon from "../../../assets/img/close-btn.svg";

class Templates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateData: [],
      page: 1,
      search: "",
      sort: "",
      filterApplied: false,
      searchInput: "",
      isClearable: false
    };
  }

  componentDidMount = () => {
    this.props.getTemplateList();
  };

  componentDidUpdate = ({ inspectionData }) => {
    let propdata = this.props.inspectionData;
    if (propdata.templateData && inspectionData !== propdata) {
      this.setState({
        templateData: propdata.templateData
      });
    }
  };

  handleChange = e => {
    if (e && e.value) {
      this.setState(
        {
          search: e,
          isClearable: true
        },
        () => {
          this.props.getTemplateList({ search: this.state.search.label });
        }
      );
      this.props.getTemplateList({ search: this.state.search.label });
    } else {
      this.setState(
        {
          search: ""
          //isClearable: false
        },
        () => {
          this.props.getTemplateList();
        }
      );
    }
  };

  onInputChange = e => {
    if (e.length > 1) {
      this.setState({
        isClearable: true
      });
    }
    else{
      this.setState({
        isClearable: false
      });
    }
  };

  onBlur = () => {
    this.setState({
      search: "",
      isClearable: false
    });
    this.props.getTemplateList({ search: "" });
  };

  handleClear = () => {
    this.setState({
      search: "",
      isClearable: false
    });
    this.props.getTemplateList({ search: "" });
  };

  loadOptions = (search, callback) => {
    if (search.length > 1) {
      this.setState({
        search: search
      });
      this.props.getTemplateList({ search, callback });
    } else {
      this.props.getTemplateList({ search: "", callback });
    }

    // this.setState({ search: search.length > 1 ? search : null });
    // this.props.getTemplateList({ search, callback });
  };

  handleCloseModal =()=>{
    this.handleClear();
    this.props.toggle()
  }

  addTemplateToInspection = data => {
    this.setState({
      search: ""
    });
    this.props.addTemplate(data);
    setTimeout(() => {
     // this.props.getTemplateList({ search: "" });
    }, 200);
  };

  render() {
    const { templateData, search, isClearable } = this.state;
    return (
      <>
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          backdrop={"static"}
          className="customer-modal custom-form-modal custom-modal-lg"
        >
          <ModalHeader>
            <Button className="close" onClick={this.handleCloseModal} color={""}>
              <span aria-hidden="true">×</span>
            </Button>
            Template List
          </ModalHeader>
          <ModalBody>
            <div className={"search-block mb-2 bg-secondary p-2"}>
              {/* <Input type={"text"} value={search} name="search" onChange={this.handleChange}/> */}
              {isClearable ? (
                <span className={"btn-clear"} onClick={this.handleClear}>
                  <img src={closeIcon} alt={"close-btn"} />
                </span>
              ) : null}
              <Async
                placeholder={"Type template title"}
                loadOptions={this.loadOptions}
                value={search}
                onChange={e => this.handleChange(e)}
                onInputChange={e => this.onInputChange(e)}
                isClearable={isClearable}
                onBlur={this.onBlur}
                noOptionsMessage={() =>
                  search ? "No Template found" : "Type Template Title"
                }
              />
            </div>
            <div className={"inspection-list-table"}>
              <Table>
                <thead>
                  <tr>
                    <th width={"70"}>#</th>
                    <th width={"300"}>Template Title</th>
                    <th className={"text-center"}>
                      Items
                    </th>
                    <th width={""}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {templateData && templateData.length ? (
                    templateData.map((data, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td width={"300"}>
                            {data.inspectionName || "-"}
                          </td>
                          <td className={"text-center"}>
                            {data.items.length || 0}
                          </td>
                          <td>
                            <span>
                              <Button
                                onClick={() =>
                                  this.addTemplateToInspection(data)
                                }
                              >
                                Add
                              </Button>
                              &nbsp;&nbsp;
                              <Button
                                onClick={() =>
                                  this.props.removeTemplate(data)
                                }
                              >
                                Delete
                              </Button>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={"4"} className={"text-center"}>
                        <NoFound message={"No any template available"} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter />
        </Modal>
      </>
    );
  }
}

export default Templates;
