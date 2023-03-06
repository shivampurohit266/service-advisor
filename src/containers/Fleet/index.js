import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Button,
  UncontrolledTooltip,
} from 'reactstrap';
import { CrmFleetModal } from '../../components/common/CrmFleetModal';
import { CrmFleetEditModal } from '../../components/common/CrmFleetEditModal';
import FleetList from '../../components/Fleet/FleetList';
import { connect } from 'react-redux';
import {
  fleetListRequest,
  fleetAddRequest,
  getMatrixList,
  getRateStandardListRequest,
  setRateStandardListStart,
  deleteFleet,
  modelOpenRequest,
  fleetEditRequest,
  updateFleetStatus
} from '../../actions';
import { logger } from '../../helpers/Logger';
import * as qs from 'query-string';
import { isEqual } from '../../helpers/Object';
class Fleet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      isLoading: false,
      fleetListData: [],
      phoneErrors: [],
      openEdit: false,
      openCreate: false,
      fleetSingleData: {},
    };
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.setState({
      openCreate: !this.state.openCreate,
    });
  };

  updateFleetModel = data => {
    this.setState({
      fleetSingleData: data,
    });
  };
  toggleEditModal = fleetData => {
    this.setState({
      fleetSingleData: fleetData,
    });
    const { modelDetails } = this.props.modelInfoReducer;
    let data = {
      fleetEditModel: !modelDetails.fleetEditModel,
    };
    this.props.modelOperate(data);
  };

  onTypeHeadStdFun = data => {
    this.props.getStdList(data);
  };
  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join('?')
    );
  };
  componentDidMount() {
    this.props.getMatrix();
    const query = qs.parse(this.props.location.search);
    this.props.getFleet({ ...query, page: query.page || 1 });
    this.props.getStdList();
  }
  componentDidUpdate = ({ fleetReducer, location }) => {
    if (
      this.props.fleetReducer.isSuccess !==
      fleetReducer.isSuccess
    ) {
      this.props.getFleet();
    }
    if (
      this.props.fleetReducer.isEditSuccess !==
      fleetReducer.isEditSuccess
    ) {
      this.setState({
        openEdit: !this.state.openEdit,
      });
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      const data = {
        ...currQuery,
        page: currQuery.page || 1,
      };
      this.props.getFleet(data);
    }
  };
  onStatusUpdate = data => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.onStatusUpdate({ ...query, ...data });
  };
  onSearch = data => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join('?'));
  };
  handleEditFleet = (data) => {
    try {
      const query = qs.parse(this.props.location.search);
      this.props.updateFleet({ ...data, ...query });
      const { modelDetails } = this.props.modelInfoReducer;
      let modaldata = {
        fleetEditModel: !modelDetails.fleetEditModel,
      };
      this.props.modelOperate(modaldata);
    } catch (error) {
      logger(error)
    }
  };
  handleAddFleet = data => {
    try {
      const query = qs.parse(this.props.location.search);
      this.props.addFleet({ ...data, ...query });
      this.setState({
        openCreate: !this.state.openCreate,
      });
    } catch (error) {
      logger(error);
    }
  };
  setDefaultRate = value => {
    this.props.setLabourRateDefault(value);
  };
  deleteFleet = fleetId => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    const data = {
      ...query,
      fleetId: fleetId,
    };
    this.props.deleteFleet(data);
  };
  onAddClick = () => {
    this.setState({
      openCreate: !this.state.openCreate,
    });
  }
  render() {
    const {
      openCreate,
      openEdit,
      fleetSingleData,
      phoneErrors,
    } = this.state;
    const {
      matrixListReducer,
      profileInfoReducer,
      fleetReducer,
      rateStandardListReducer,
      getMatrix
    } = this.props;
    const { modelDetails } = this.props.modelInfoReducer;
    return (
      <>
        <Card className={"white-card"}>
          <CardBody className={"custom-card-body position-relative"}>
            <div className={"text-right invt-add-btn-block"}>
              <Button
                color='primary'
                id='add-user'
                onClick={this.toggleCreateModal}
              >
                <i className={'fa fa-plus'} />
                &nbsp; Add New Fleet
                </Button>
              <UncontrolledTooltip target={'add-user'}>
                Add New Fleet
                </UncontrolledTooltip>
            </div>
            <FleetList
              fleetListData={fleetReducer}
              handleEditFleet={this.handleEditFleet}
              updateFleetModel={this.toggleEditModal}
              onSearch={this.onSearch}
              onPageChange={this.onPageChange}
              onDelete={this.deleteFleet}
              onStatusUpdate={this.onStatusUpdate}
              openEdit={openEdit}
              onAddClick={this.onAddClick}
            />
          </CardBody>
        </Card>
        <CrmFleetModal
          fleetModalOpen={openCreate}
          handleFleetModal={this.toggleCreateModal}
          handleAddFleet={this.handleAddFleet}
          phoneErrors={phoneErrors}
          onTypeHeadStdFun={this.onTypeHeadStdFun}
          setDefaultRate={this.setDefaultRate}
          addFleet={this.handleAddFleet}
          rateStandardListData={rateStandardListReducer}
          profileInfoReducer={profileInfoReducer.profileInfo}
          matrixListReducerData={matrixListReducer}
          getPriceMatrix={getMatrix}
        />
        <CrmFleetEditModal
          onTypeHeadStdFun={this.onTypeHeadStdFun}
          setDefaultRate={this.setDefaultRate}
          handleEditFleet={this.handleEditFleet}
          rateStandardListData={rateStandardListReducer}
          profileInfoReducer={profileInfoReducer.profileInfo}
          matrixListReducerData={matrixListReducer.matrixList}
          updateFleetModel={this.updateFleetModel}
          fleetSingleData={fleetSingleData}
          updateFleet={this.handleEditFleet}
          handleFleetModal={this.toggleEditModal}
          getPriceMatrix={getMatrix}
          fleetEditModalOpen={modelDetails.fleetEditModel}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileInfoReducer: state.profileInfoReducer,
  matrixListReducer: state.matrixListReducer,
  fleetReducer: state.fleetReducer,
  rateStandardListReducer: state.rateStandardListReducer,
  modelInfoReducer: state.modelInfoReducer,
});

const mapDispatchToProps = dispatch => ({
  getFleet: data => {
    dispatch(fleetListRequest(data));
  },
  addFleet: data => {
    dispatch(fleetAddRequest(data));
  },
  getMatrix: (data) => {
    dispatch(getMatrixList(data));
  },
  getStdList: () => {
    dispatch(getRateStandardListRequest());
  },
  setLabourRateDefault: data => {
    dispatch(setRateStandardListStart(data));
  },
  deleteFleet: data => {
    dispatch(deleteFleet(data));
  },
  modelOperate: data => {
    dispatch(modelOpenRequest({ modelDetails: data }));
  },
  updateFleet: data => {
    dispatch(fleetEditRequest(data));
  },
  onStatusUpdate: data => {
    dispatch(updateFleetStatus(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fleet);
