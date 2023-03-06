import React, { Component } from "react";
import Avatar from "react-avatar";
import { Col, Row, Button, Table } from "reactstrap";
import CreatableSelect from "react-select/lib/Creatable";
import CrmCircleIcon from "../../components/common/CrmCircleIcon";
import CrmDropDownMenu from "../../components/common/CrmDropDownMenu";

class CommonPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      smallModelDisplay: false
    };
  }

  handleSmallModel = () => {
    this.setState({
      smallModelDisplay: !this.state.smallModelDisplay
    });
  };

  handleChange = (newValue, actionMeta) => {
    // console.group("Value Changed");
    // console.log(newValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
  };
  handleInputChange = (inputValue, actionMeta) => {
    // console.group("Input Changed");
    // console.log(inputValue);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
  };
  handleButtonClick = (name, company) => {
    // console.log("$$$$$$$$$$$$This is button click",name,company);
  };

  render() {
    const colourOptions = [
      { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
      { value: "blue", label: "Blue", color: "#0052CC", disabled: true },
      { value: "purple", label: "Purple", color: "#5243AA" },
      { value: "red", label: "Red", color: "#FF5630", isFixed: true }
    ];

    let dropdownOptions = [
      { value: "import", label: "Import" },
      { value: "export", label: "export" }
    ];
    let imageData =
      "data:image/png;base64,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";
    return (
      <div className="animated fadeIn">
        <Row>
          <h4 className="">Common Model Component</h4>
          <Col xs="12" md="12" className="">
            <div className="margin-top-10 page-title">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Model</td>
                    <td>
                      {" "}
                      <Button
                        color="primary"
                        onClick={this.handleSmallModel}
                        className="mr-1"
                      >
                        Small Model
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>Avatar</td>
                    <td>
                      {" "}
                      50 px <Avatar name="Foo Bar" size="50" round={true} />
                      50px{" "}
                      <Avatar
                        src={"/assets/img/avatars/6.jpg"}
                        size="50"
                        round={true}
                      />
                      100px{" "}
                      <Avatar
                        src={"/assets/img/avatars/6.jpg"}
                        size="100"
                        round={true}
                      />
                      100px <Avatar name="Foo Bar" size="100" round={true} />
                    </td>
                  </tr>
                  <tr>
                    <td>Circle Icon</td>
                    <td>
                      <CrmCircleIcon
                        circleIconPass={"icon-settings"}
                        cssPass={{
                          width: "28px",
                          height: "28px",
                          marginLeft: "4px",
                          fontSize: "18px"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td> DropDown without image</td>
                    <td>
                      <CrmDropDownMenu
                        classNamePass={"common-crm-dropdown"}
                        imageDisplay={false}
                        iconPass={"icon-options icons"}
                        options={dropdownOptions}
                        returnCrmDropAction={this.performInventoryAction}
                        cssPass={""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td> DropDown with image</td>
                    <td>
                      <CrmDropDownMenu
                        classNamePass={"common-crm-dropdown"}
                        imageDisplay={true}
                        imagePass={{
                          image: imageData,
                          size: "30"
                        }}
                        options={dropdownOptions}
                        returnCrmDropAction={this.performInventoryAction}
                        cssPass={""}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td> DropDown with image</td>
                    <td>
                      <CreatableSelect
                        isClearable
                        onChange={this.handleChange}
                        onInputChange={this.handleInputChange}
                        options={colourOptions}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CommonPage;
