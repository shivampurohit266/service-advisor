import { Card, CardBody, Button } from "reactstrap";
import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import React, { Component, Suspense } from "react";

import {
  getRateStandardListRequest,
  setRateStandardListStart,
  labourAddRequest,
  rateAddRequest
} from "../../actions";

import { AppRoutes } from "../../config/AppRoutes";
import Loader from "../Loader/Loader";
import { CrmTyreModal } from "../../components/common/Tires/CrmTyreModal";
import { CrmLabourModal } from "../../components/common/Labours/CrmLabourModal";
import { logger } from "../../helpers/Logger";
import CrmInventoryVendor from "../../components/common/CrmInventoryVendor";
import {
  addNewTier,
  addNewVendor,
  getInventoryPartVendors,
  requestAddPart,
  getMatrixList,
  getInventoryStats
} from "../../actions";
import CrmInventoryPart from "../../components/common/CrmInventoryPart";
import * as qs from "query-string";

const InventoryStats = React.lazy(() =>
  import("../../components/Inventory/InventoryStats")
);
const InventoryTab = React.lazy(() =>
  import("../../components/Inventory/InventoryTab")
);
const Parts = React.lazy(() => import("../../components/Inventory/Parts"));
const Tires = React.lazy(() => import("../../components/Inventory/Tires"));
const Labours = React.lazy(() => import("../../components/Inventory/Labours"));
const Vendors = React.lazy(() => import("../../components/Inventory/Vendors"));
export const InventoryRoutes = [
  {
    path: AppRoutes.INVENTORY_PARTS.url,
    name: AppRoutes.INVENTORY_PARTS.name,
    component: Parts
  },
  {
    path: AppRoutes.INVENTORY_TIRES.url,
    name: AppRoutes.INVENTORY_TIRES.name,
    component: Tires
  },
  {
    path: AppRoutes.INVENTORY_LABOURS.url,
    name: AppRoutes.INVENTORY_LABOURS.name,
    component: Labours
  },
  {
    path: AppRoutes.INVENTORY_VENDORS.url,
    name: AppRoutes.INVENTORY_VENDORS.name,
    component: Vendors
  },
  {
    path: AppRoutes.INVENTORY_STATATICS.url,
    name: AppRoutes.INVENTORY_STATATICS.name,
    component: InventoryStats
  }
];
const InventoryTabs = [
  {
    name: AppRoutes.INVENTORY_STATATICS.name,
    url: AppRoutes.INVENTORY_STATATICS.url
  },
  {
    name: AppRoutes.INVENTORY_PARTS.name,
    url: AppRoutes.INVENTORY_PARTS.url
  },
  {
    name: AppRoutes.INVENTORY_TIRES.name,
    url: AppRoutes.INVENTORY_TIRES.url
  },
  {
    name: AppRoutes.INVENTORY_LABOURS.name,
    url: AppRoutes.INVENTORY_LABOURS.url
  },
  {
    name: AppRoutes.INVENTORY_VENDORS.name,
    url: AppRoutes.INVENTORY_VENDORS.url
  }
];
class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }
  componentDidMount() {
    this.props.getStdList();
    const { location } = this.props;
    const index = InventoryTabs.findIndex(d => d.url === location.pathname);
    if (index > -1) {
      this.setState({
        activeTab: index
      });
    }
  }

  componentDidUpdate({ location }) {
    const { location: newLocation } = this.props;
    if (location.pathname !== newLocation.pathname) {
      const index = InventoryTabs.findIndex(
        d => d.url === newLocation.pathname
      );
      if (index > -1) {
        this.setState({
          activeTab: index
        });
      }
    }
  }
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };
  onTabChange = activeTab => {
    this.props.redirectTo(InventoryTabs[activeTab].url);
  };
  addLabour = data => {
    try {
      this.props.addLabour(data);
      this.setState({
        typeAddModalOpen: !this.state.typeAddModalOpen
      });
    } catch (error) {
      logger(error);
    }
  };
  addRate = data => {
    try {
      this.props.addRate(data);
    } catch (error) {
      logger(error);
    }
  };
  getQueryParams = () => {
    let query = qs.parse(this.props.location.search);
    if (query.vendorId) {
      query.vendorId = qs.parse(query.vendorId).value;
    }
    return query;
  };
  addInventoryPart = data => {
    const query = this.getQueryParams();
    this.props.addInventoryPart({ data, query });
  };
  renderModals = () => {
    const { activeTab } = this.state;
    const {
      modelInfoReducer,
      modelOperate,
      addVendor,
      inventoryPartsData,
      getInventoryPartsVendors,
      rateStandardListReducer,
      profileInfoReducer,
      getStdList,
      getPriceMatrix,
      matrixListReducer
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const {
      tireAddModalOpen,
      vendorAddModalOpen,
      partAddModalOpen,
      rateAddModalOpen
    } = modelDetails;
    switch (InventoryTabs[activeTab].url) {
      case AppRoutes.INVENTORY_PARTS.url:
        return (
          <CrmInventoryPart
            isOpen={partAddModalOpen}
            toggle={() =>
              modelOperate({
                partAddModalOpen: !partAddModalOpen
              })
            }
            getPriceMatrix={getPriceMatrix}
            matrixList={matrixListReducer.matrixList}
            inventoryPartsData={inventoryPartsData}
            getInventoryPartsVendors={getInventoryPartsVendors}
            addInventoryPart={this.addInventoryPart}
          />
        );
      case AppRoutes.INVENTORY_TIRES.url:
        return (
          <CrmTyreModal
            tyreModalOpen={tireAddModalOpen}
            handleTierModal={() =>
              modelOperate({
                tireAddModalOpen: !tireAddModalOpen
              })
            }
            getPriceMatrix={getPriceMatrix}
            matrixList={matrixListReducer.matrixList}
            getInventoryPartsVendors={getInventoryPartsVendors}
            addTier={this.props.addTier}
          />
        );
      case AppRoutes.INVENTORY_LABOURS.url:
        return (
          <CrmLabourModal
            profileInfoReducer={profileInfoReducer.profileInfo}
            rateStandardListData={rateStandardListReducer}
            tyreModalOpen={tireAddModalOpen}
            setDefaultRate={this.setDefaultRate}
            getStdList={getStdList}
            addLabour={this.addLabour}
            addRate={this.addRate}
            handleLabourModal={() =>
              modelOperate({
                tireAddModalOpen: !tireAddModalOpen
              })
            }
            rateAddModalProp={rateAddModalOpen}
            rateAddModalFun={() =>
              modelOperate({
                rateAddModalOpen: !rateAddModalOpen
              })
            }
          />
        );
      case AppRoutes.INVENTORY_VENDORS.url:
        return (
          <CrmInventoryVendor
            addVendor={addVendor}
            vendorAddModalOpen={vendorAddModalOpen}
            handleVendorAddModal={() =>
              modelOperate({
                vendorAddModalOpen: !vendorAddModalOpen
              })
            }
          />
        );
      default:
        return null;
    }
  };
  onAddClick = () => {
    const { activeTab } = this.state;
    let modelDetails = {};
    switch (InventoryTabs[activeTab].url) {
      case AppRoutes.INVENTORY_PARTS.url:
        modelDetails = {
          partAddModalOpen: true
        };
        break;
      case AppRoutes.INVENTORY_TIRES.url:
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      case AppRoutes.INVENTORY_LABOURS.url:
        modelDetails = {
          tireAddModalOpen: true
        };
        break;
      case AppRoutes.INVENTORY_VENDORS.url:
        modelDetails = {
          vendorAddModalOpen: true
        };
        break;
      default:
        return null;
    }
    this.props.modelOperate(modelDetails);
  };
  renderAddNewButton = () => {
    const { activeTab } = this.state;
    if (activeTab > 0) {
      return (
        <>
          <Button color="primary" onClick={this.onAddClick} id="add-user">
            <i className={"fa fa-plus"} />
            &nbsp; Add New{" "}
            {InventoryTabs[activeTab].name.slice(
              0,
              InventoryTabs[activeTab].name.length
            )}
          </Button>
          {/* <UncontrolledTooltip target={"add-user"}>
            Add New{" "}
            {InventoryTabs[activeTab].name.slice(
              0,
              InventoryTabs[activeTab].name.length
            )}
          </UncontrolledTooltip> */}
        </>
      );
    }
    return null;
  };
  render() {
    const { activeTab } = this.state;
    const { inventoryStatsReducer } = this.props;
    const { data, isLoading } = inventoryStatsReducer;

    return (
      <div className="animated fadeIn">
        <Card className="white-card ">
          <CardBody className={"custom-card-body inventory-card"}>
            <div className={"position-relative"}>
              <Suspense fallback={"Loading.."}>
                <InventoryTab
                  tabs={InventoryTabs}
                  activeTab={activeTab}
                  onTabChange={this.onTabChange}
                />
              </Suspense>
              <div className={"invt-add-btn-block"}>
                {this.renderAddNewButton()}
              </div>
            </div>
            <Suspense fallback={<Loader />}>
              <Switch>
                {InventoryRoutes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => (
                        <route.component
                          {...props}
                          {...this.props}
                          isLoading={isLoading}
                          inventoryStats={data}
                          onAddClick={this.onAddClick}
                        />
                      )}
                    />
                  ) : null;
                })}
                <Redirect
                  from={AppRoutes.INVENTORY.url}
                  to={AppRoutes.INVENTORY_STATATICS.url}
                />
              </Switch>
            </Suspense>
          </CardBody>
        </Card>
        {this.renderModals()}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  inventoryPartsData: state.inventoryPartsReducers,
  profileInfoReducer: state.profileInfoReducer,
  rateStandardListReducer: state.rateStandardListReducer,
  inventoryStatsReducer: state.inventoryStatsReducer,
  matrixListReducer: state.matrixListReducer
});
const mapDispatchToProps = dispatch => ({
  addVendor: data => {
    dispatch(addNewVendor(data));
  },
  addTier: data => {
    dispatch(addNewTier(data));
  },
  getInventoryPartsVendors: data => {
    dispatch(getInventoryPartVendors(data));
  },
  addInventoryPart: data => {
    dispatch(requestAddPart(data));
  },
  getStdList: data => {
    dispatch(getRateStandardListRequest(data));
  },
  addRate: data => {
    dispatch(rateAddRequest(data));
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  addLabour: data => {
    dispatch(labourAddRequest(data));
  },
  getInventoryStats: () => {
    dispatch(getInventoryStats());
  },
  getPriceMatrix: data => {
    dispatch(getMatrixList(data));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Inventory));
