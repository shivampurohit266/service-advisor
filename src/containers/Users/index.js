import React, { Component } from "react";
import { Card, CardBody, Button, UncontrolledTooltip } from "reactstrap";
import { CrmUserModal } from "../../components/common/CrmUserModal";
import UsersList from "../../components/UsersList";
import { connect } from "react-redux";
import {
  getUsersList,
  addNewUser,
  deleteUser,
  editUser,
  updateUserStatus
} from "../../actions";
import * as qs from "query-string";
import { isEqual } from "../../helpers/Object";
import { AppRoutes } from "../../config/AppRoutes";
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCreate: false,
      openEdit: false
    };
  }
  componentDidMount() {
    const query = qs.parse(this.props.location.search);
    this.props.getUsers({ ...query, page: query.page || 1 });
  }
  onPageChange = page => {
    const { location } = this.props;
    const { search, pathname } = location;
    const query = qs.parse(search);
    this.props.redirectTo(
      [pathname, qs.stringify({ ...query, page })].join("?")
    );
  };
  componentDidUpdate({ userReducer, location }) {
    if (
      userReducer.userData &&
      this.props.userReducer.userData &&
      this.props.userReducer.userData.isSuccess !==
      userReducer.userData.isSuccess
    ) {
      if (this.props.userReducer.userData.isSuccess) {
        const query = qs.parse(this.props.location.search);
        this.props.getUsers({ ...query, page: query.page || 1 });
      }
    }
    if (
      userReducer.userData &&
      this.props.userReducer.userData &&
      userReducer.userData.isEditSuccess !==
      this.props.userReducer.userData.isEditSuccess
    ) {
      if (this.props.userReducer.userData.isEditSuccess) {
        const query = qs.parse(this.props.location.search);
        this.props.getUsers({ ...query, page: query.page || 1 });
      }
    }
    const prevQuery = qs.parse(location.search);
    const currQuery = qs.parse(this.props.location.search);
    if (!isEqual(prevQuery, currQuery)) {
      this.props.getUsers({ ...currQuery, page: currQuery.page || 1 });
    }
  }
  toggleCreateModal = e => {
    e.preventDefault();
    this.props.modelOperate({
      addUserModal: !this.props.modelInfoReducer.modelDetails.addUserModal
    });
  };
  onSearch = data => {
    const { location } = this.props;
    const { pathname } = location;
    this.props.redirectTo([pathname, qs.stringify(data)].join("?"));
  };
  deleteUser = userId => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.deleteUser({ ...query, userId });
  };
  onStatusUpdate = data => {
    const { location } = this.props;
    const { search } = location;
    const query = qs.parse(search);
    this.props.onStatusUpdate({ ...query, ...data });
  };
  render() {
    const {
      userReducer,
      addUser,
      modelInfoReducer,
      modelOperate,
      profileInfoReducer
    } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { addUserModal, editUserModal } = modelDetails;
    const companyName = profileInfoReducer.profileInfo.companyName;
    const planData = profileInfoReducer.profileInfo.planId;
    const isInTrialPeriod = profileInfoReducer.profileInfo.isInTrialPeriod;
    const userData = userReducer.users;
    return (
      <>
        <Card className={"white-card"}>
          <CardBody className={"custom-card-body position-relative"}>
            {planData ? (
              userData.length < planData.facilities.noOfLiscence ? (
                <div className={"text-right invt-add-btn-block"}>
                  <Button
                    color="primary"
                    id="add-user"
                    onClick={this.toggleCreateModal}
                  >
                    <i className={"fa fa-plus"} />
                    &nbsp; {`Add New ${AppRoutes.STAFF_MEMBERS.name}`}
                  </Button>
                  <UncontrolledTooltip target={"add-user"}>
                    {`Add New ${AppRoutes.STAFF_MEMBERS.name}`}
                  </UncontrolledTooltip>
                </div>
              ) : null
            ) : isInTrialPeriod ? (
              <div className={"text-right invt-add-btn-block"}>
                <Button
                  color="primary"
                  id="add-user"
                  onClick={this.toggleCreateModal}
                >
                  <i className={"fa fa-plus"} />
                  &nbsp; Add New Staff Member
                </Button>
                <UncontrolledTooltip target={"add-user"}>
                  Add New Staff Member
                </UncontrolledTooltip>
              </div>
            ) : null}
            <UsersList
              userData={userReducer}
              onPageChange={this.onPageChange}
              onSearch={this.onSearch}
              onDelete={this.deleteUser}
              onUpdate={this.props.updateUser}
              openEdit={editUserModal}
              onStatusUpdate={this.onStatusUpdate}
              modelOperate={modelOperate}
              {...this.props}
            />
          </CardBody>
        </Card>
        <CrmUserModal
          userModalOpen={addUserModal}
          handleUserModal={this.toggleCreateModal}
          addUser={addUser}
          companyName={companyName}
        />
      </>
    );
  }
}
const mapStateToProps = state => ({
  userReducer: state.usersReducer,
  profileInfoReducer: state.profileInfoReducer
});

const mapDispatchToProps = dispatch => ({
  getUsers: data => {
    dispatch(getUsersList(data));
  },
  addUser: data => {
    dispatch(addNewUser(data));
  },
  updateUser: (id, data) => {
    dispatch(editUser({ id, data }));
  },
  deleteUser: data => {
    dispatch(deleteUser(data));
  },
  onStatusUpdate: data => {
    dispatch(updateUserStatus(data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
