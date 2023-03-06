import React, { Component } from "react";
import {
  Button,
  Row,
  Col,
  Table,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import * as classnames from "classnames";
import CRMModal from "./Modal";
import CrmDragDrop from "./CrmDragDrop";
import { logger } from "../../helpers/Logger";
import XLSX from "xlsx";
import { connect } from "react-redux";
import { modelOpenRequest, showLoader, hideLoader, updateImportCustomersReq, updateImportVehicleReq } from "../../actions";
import CrmExportSampleButton from "./CrmExportSampleButton";
class CrmImportExcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      file: null,
      fileError: undefined,
      sheets: [],
      activeSheet: 0
    };
  }
  toggleImportModal = () => {
    this.setState({
      isLoading: false,
      file: null,
      fileError: undefined,
      sheets: [],
      activeSheet: 0
    });
    this.props.toggleModal(!this.props.isOpen);
    this.props.updateImportCustomersReq({ importError: undefined })
    this.props.updateImportVehicleReq({ importError: undefined })
  };
  onImport = () => {
    const { file, sheets } = this.state;
    if (!file) {
      this.setState({ fileError: "Please choose at least one file." });
      return;
    }
    this.props.showLoader();
    this.setState({
      sheets: [],
      activeSheet: 0,
      isLoading: true
    });
    const reader = new FileReader();
    reader.onload = e => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      workbook.SheetNames.forEach(sheetName => {
        const XL_row_object = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        let outputableHeader;
        for (let i = 0; i < XL_row_object.length; i++) {
          const element = XL_row_object[i];
          if (i === 0) {
            const header = [];
            for (const key in element) {
              if (element.hasOwnProperty(key)) {
                header.push(key);
              }
            }
            outputableHeader = header;
          }
          element.sheetName = sheetName;
          element.rowNumber = i + 1;
        }
        const outputableData = XL_row_object;
        sheets.push({
          name: sheetName,
          header: outputableHeader,
          data: outputableData
        });
      });
      this.setState({
        sheets,
        isLoading: false
      });
      this.props.hideLoader();
    };
    reader.readAsArrayBuffer(file);
  };
  onImportData = () => {
    this.props.showLoader();
    const { sheets } = this.state;
    const { onImport } = this.props;
    let dataToImport = [];
    sheets.forEach(sheet => (dataToImport = dataToImport.concat(sheet.data)));
    if (onImport) {
      onImport(dataToImport);
    } else {
      this.props.hideLoader();
    }
  };
  modalOptions = () => {
    const { modalHeaderText, isOpen } = this.props;
    const { sheets } = this.state;
    return {
      isOpen,
      headerText: modalHeaderText || "Import Data",
      toggle: this.toggleImportModal,
      footerButtons: [
        {
          text: sheets.length ? modalHeaderText || "Import Data" : "Confirm",
          type: "submit",
          color: "primary",
          onClick: sheets.length ? this.onImportData : this.onImport
        },
        {
          text: "Cancel",
          type: "button",
          onClick: this.toggleImportModal
        }
      ]
    };
  };
  onFileDrop = file => {
    this.setState({
      file,
      fileError: "",
      sheets: []
    });
  };
  renderTable = sheet => {
    return (
      <div className={"table-responsive"} style={{ height: 250 }}>
        <Table striped size="sm">
          <thead>
            <tr>
              {sheet.header &&
                sheet.header.map((head, ind) => {
                  return <th key={ind}>{head}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            {sheet.data &&
              sheet.data.map((data, index) => {
                return (
                  <tr key={index}>
                    {sheet.header
                      ? sheet.header.map((d, i) => {
                        return <td key={i}>{data[d]}</td>;
                      })
                      : null}
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  };
  renderSheets = () => {
    const { sheets, activeSheet } = this.state;
    let totalRecords = 0;
    return (
      <>
        <Nav tabs>
          {sheets &&
            sheets.map((sheet, index) => {
              return (
                <NavItem key={index}>
                  <NavLink
                    className={classnames({
                      active: activeSheet === index
                    })}
                    onClick={() => {
                      this.setState({
                        activeSheet: index
                      });
                    }}
                  >
                    {sheet.name}
                  </NavLink>
                </NavItem>
              );
            })}
        </Nav>
        <TabContent activeTab={activeSheet}>
          {sheets &&
            sheets.map((sheet, index) => {
              totalRecords =
                totalRecords + (sheet.data ? sheet.data.length : 0);
              return (
                <TabPane key={index} tabId={index} className="overflow-auto">
                  <Row className="m-0">
                    <Col sm="12" className="p-0">{this.renderTable(sheet)}</Col>
                  </Row>
                </TabPane>
              );
            })}
        </TabContent>
        <br />
        <h4>Total Records: {totalRecords}</h4>
      </>
    );
  };
  render() {
    const {
      buttonText,
      btnColor,
      children,
      buttonIcon,
      sheetType,
      importSectionName
    } = this.props;

    const { isLoading, fileError, sheets } = this.state;
    logger(isLoading);
    return (
      <>
        <Button
          color={btnColor || "primary"}
          onClick={this.toggleImportModal}
        >
          <i className={buttonIcon} />
          &nbsp;
          {buttonText || "Import Excel"}
        </Button>
        <CRMModal {...this.modalOptions()}>
          {children}
          <Row className={"pt-4 pb-3"}>
            <Col sm={{ size: 7 }} className={"pl-3"}>
              <h4>
                {
                  importSectionName === 'customer' ?
                    "Instructions to import customers" :
                    "Instructions to import vehicles"
                }
              </h4>
              <ul className={"list-inline import-instruction-list"}>
                <li>
                  <i className="icon-arrow-right icons" />
                  Click Here to{" "}
                  <span className={""}>
                    <CrmExportSampleButton sheetType={sheetType} />
                  </span>
                </li>
                <li>
                  <i className="icon-arrow-right icons" />
                  Attach/Upload only csv or excel file to insert bulk
                  records in the system.
                </li>
                <li>
                  <i className="icon-arrow-right icons" /> Kindly Insert 250
                  records at a time, for adding more records again create
                  new file.
                </li>
                <li>
                  <i className="icon-arrow-right icons" />
                  Kindly make sure before inserting the data filed entity
                  should be correct and formatted.
                </li>
                <li>
                  <i className="icon-arrow-right icons" />
                  Kindly follow the sample_data.csv to Import Bulk Data.
                </li>
              </ul>
            </Col>
            <Col sm={{ size: 5 }} className={"pt-3"}>
              <CrmDragDrop
                accept={[".xlsx", ".xls", ".csv"]}
                acceptMessage={"Only CSV/Excel files are allowed"}
                onFileDrop={this.onFileDrop}
                containerClass={
                  fileError
                    ? "dropzone-error text-danger welcome-image-select-background bg-white"
                    : "welcome-image-select-background bg-white"
                }
              />
              {fileError ? (
                <p className={"text-danger"}>{fileError}</p>
              ) : null}
              <p className={"pt-3"}>
                <i className={"fas fa-file-excel-o"} />
                <CrmExportSampleButton sheetType={sheetType} />
              </p>
            </Col>
            <Col sm={12}>
              {isLoading
                ? null
                : sheets.length
                  ? this.renderSheets()
                  : null}
            </Col>
          </Row>
        </CRMModal>
      </>
    );
  }
}
const mapStateToProps = state => ({
  isOpen: state.modelInfoReducer.modelDetails.showImportModal
});

const mapDispatchToProps = dispatch => ({
  toggleModal: isOpen => {
    dispatch(
      modelOpenRequest({
        modelDetails: {
          showImportModal: isOpen
        }
      })
    );
  },
  showLoader: () => {
    dispatch(showLoader());
  },
  hideLoader: () => {
    dispatch(hideLoader());
  },
  updateImportCustomersReq: (data) => {
    dispatch(updateImportCustomersReq(data));
  },
  updateImportVehicleReq: (data) => {
    dispatch(updateImportVehicleReq(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CrmImportExcel);
