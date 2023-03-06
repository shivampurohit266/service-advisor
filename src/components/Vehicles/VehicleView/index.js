import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import {
   vehicleGetRequest,
   modelOpenRequest,
   getOrderDetailsRequest,
   vehicleEditRequest,
   addOrderRequest,
   getAppointments,
   getAppointmentDetails,
   getVehicleMakeModalReq,
   getVehicleModalReq,
} from "../../../actions"
import { withRouter } from "react-router-dom";
import qs from "query-string";
import Loader from "../../../containers/Loader/Loader";
import { VehicleOrder } from "./vehicleOrder"
import { VehicleInfo } from "./vehicleInfo"
import { VehicleAppointment } from "./vehicleAppointment"
import VehicleIcons from "../../../containers/Icons/Vehicles"

const VehicleTab = React.lazy(() => import("./vehicleTab"));

const VehicleTabs = [
   {
      name: "Orders"
   },
   {
      name: "Appointment"
   },
   {
      name: "Vehicle Info"
   }
];
class CustomerView extends Component {
   constructor(props) {
      super(props);
      this.state = {
         vehicleData: [],
         vehicleId: "",
         activeTab: 0
      };
   }
   componentDidMount = () => {
      this.props.vehicleGetRequest({ vehicleId: this.props.match.params.id, isGetVehicle: true });
      const query = qs.parse(this.props.location.search);
      const vehicleId = this.props.match.params.id
      this.props.getOrderDetailsRequest({ vehicleId: vehicleId })
      this.props.getAppointments({ vehicleId: vehicleId, isVehicle: true })
      this.setState({
         vehicleId: this.props.match.params.id,
         activeTab: query.tab
            ? VehicleTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
            : 0
      });
   }
   componentDidUpdate = ({ vehicleListReducer, location }) => {
      if (((vehicleListReducer.vehicleList !== this.props.vehicleListReducer.vehicleList) && this.props.vehicleListReducer.vehicleList.length)) {
         this.setState({
            vehicleData: this.props.vehicleListReducer.vehicleList
         })
      }
      if (this.props.location.search !== location.search) {
         const query = qs.parse(this.props.location.search);
         this.setState({
            activeTab: query.tab
               ? VehicleTabs.findIndex(d => d.name === decodeURIComponent(query.tab))
               : 0
         });
      }
   }
   onTabChange = activeTab => {
      const vehicleDetailsUrl = "/vehicles/details/:id"
      this.props.redirectTo(
         `${vehicleDetailsUrl.replace(
            ":id",
            this.state.vehicleId
         )}?tab=${encodeURIComponent(VehicleTabs[activeTab].name)}`
      );
   };
   render() {
      const { activeTab, vehicleData } = this.state;
      const {
         orderReducer,
         vehicleGetRequest,
         modelInfoReducer,
         modelOperate,
         vehicleEditRequest,
         addOrderRequest,
         getAppointmentDetails,
         appointmentReducer,
         appointmentDetailsReducer,
         getVehicleMakeModalReq,
         getVehicleModalReq } = this.props
      return (
         <>
            <div className={"p-3"}>
               <h3 className={"d-flex"}>
                  <span className={"vehicle-image-detail"}>
                     {
                        vehicleData[0] ?
                           <VehicleIcons
                              type={vehicleData[0].type.value}
                              color={vehicleData[0].color.color}
                              size={"100px"}
                           /> :
                           null
                     }
                  </span>{" "}
                  <span className={"text-capitalize"}>
                     {vehicleData[0] ? `${vehicleData[0].year}${" "}${vehicleData[0].make}${" "}${vehicleData[0].modal}` : null}
                  </span>
               </h3>
               <span className={"pr-2"}>{vehicleData[0] ? <><i className={"fa fa-ticket"} />{" "}{vehicleData[0].vin || "No VIN"}</> : null}</span>
               {" "}
               <span>{vehicleData[0] ? <><i className="fas fa-road" />{" "}{vehicleData[0].miles || "0"}{" "}Miles</> : null}</span>
            </div>
            <div className={"p-3"}>
               <div className={"position-relative"}>
                  <Suspense fallback={"Loading.."}>
                     <VehicleTab
                        tabs={VehicleTabs}
                        activeTab={activeTab}
                        onTabChange={this.onTabChange}
                     />
                  </Suspense>
               </div>
               <Suspense fallback={<Loader />}>
                  <React.Fragment>
                     {activeTab === 0 ? (
                        <VehicleOrder
                           vehicleOrders={orderReducer.vehicleOrders}
                           vehicleData={vehicleData[0]}
                           orderReducer={orderReducer}
                           addOrderRequest={addOrderRequest}
                           {...this.props}
                        />) : null}
                     {activeTab === 1 ?
                        (<VehicleAppointment
                           vehicleAppointment={appointmentReducer.vehicleAppoitment}
                           isLoading={appointmentReducer.isLoading}
                           getAppointmentDetails={getAppointmentDetails}
                           appointmentDetailsReducer={appointmentDetailsReducer}
                           modelInfoReducer={modelInfoReducer}
                           modelOperate={modelOperate}
                           {...this.props}
                        />) : null}
                     {activeTab === 2 ? (
                        <VehicleInfo
                           vehicleData={vehicleData[0]}
                           modelInfoReducer={modelInfoReducer}
                           modelOperate={modelOperate}
                           vehicleGetRequest={vehicleGetRequest}
                           vehicleEditRequest={vehicleEditRequest}
                           getVehicleMakeModalReq={getVehicleMakeModalReq}
                           getVehicleModalReq={getVehicleModalReq}
                           {...this.props}
                        />
                     ) : null}
                  </React.Fragment>
               </Suspense>
            </div>
         </>
      );
   }
}
const mapStateToProps = state => ({
   vehicleListReducer: state.vehicleListReducer,
   modelInfoReducer: state.modelInfoReducer,
   orderReducer: state.orderReducer,
   appointmentReducer: state.appointmentReducer,
   appointmentDetailsReducer: state.appointmentDetailsReducer
});
const mapDispatchToProps = dispatch => ({
   vehicleGetRequest: (data) => {
      dispatch(vehicleGetRequest(data))
   },
   modelOperate: data => {
      dispatch(modelOpenRequest({ modelDetails: data }));
   },
   getOrderDetailsRequest: data => {
      dispatch(getOrderDetailsRequest(data))
   },
   vehicleEditRequest: data => {
      dispatch(vehicleEditRequest(data))
   },
   addOrderRequest: data => {
      dispatch(addOrderRequest(data))
   },
   getAppointments: data => {
      dispatch(getAppointments(data))
   },
   getAppointmentDetails: data => {
      dispatch(getAppointmentDetails(data))
   },
   getVehicleMakeModalReq: data => {
      dispatch(getVehicleMakeModalReq(data));
   },
   getVehicleModalReq: data => {
      dispatch(getVehicleModalReq(data));
   }
})
export default connect(
   mapStateToProps,
   mapDispatchToProps
)(withRouter(CustomerView));
