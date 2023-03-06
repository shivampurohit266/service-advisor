import React, { Component } from "react";
import {
   Modal,
   ModalBody,
   ModalHeader,
   Col,
   FormGroup,
   UncontrolledTooltip,
   Label,
   Button,
   Input
} from "reactstrap";
import Async from "react-select/lib/Async";
import NoDataFound from "./NoFound";
import { ConfirmBox } from "../../helpers/SweetAlert";
export class CrmCannedServiceModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
         serviceId: "",
         serviceData: [],
         serviceIndex: -1,
         isToggelOpen: false,
         activeIndex: '',
         input: ""
      };
   }
   componentDidMount = () => {
      const {
         cannedServiceList
      } = this.props.serviceReducers
      this.setState({
         serviceData: cannedServiceList
      })
   }
   componentDidUpdate = ({ serviceReducers, openCannedService }) => {
      if (serviceReducers && (serviceReducers !== this.props.serviceReducers)) {
         const {
            cannedServiceList
         } = this.props.serviceReducers
         this.setState({
            serviceData: cannedServiceList
         })
      }
      if (openCannedService !== this.props.openCannedService) {
         this.setState({
            input: "",
            serviceId: "",
         })
      }
   }
   handleAddCannedService = (e) => {
      if (e && e.value) {
         this.setState({
            serviceId: e,
            serviceData: [e.serviceData]
         })
      } else {
         this.setState({
            serviceId: "",
         })
         this.props.getCannedServiceList()
      }
   }
   searchCannedServices = (input, callback) => {
      if (input.length > 1) {
         this.setState({
            input: input
         });
         this.props.getCannedServiceList({ input, callback });
      } else {
         this.setState({
            input: ""
         });
         this.props.getCannedServiceList({ input: "", callback });
      }
   }

   onBlur = () => {
      this.setState({
         input: ""
      });
      this.props.getCannedServiceList({ input: "" });
   };

   handleServiceCollaps = (index) => {
      const { serviceIndex } = this.state
      if (serviceIndex === index) {
         this.setState({
            serviceIndex: -1,
            isToggelOpen: false
         })
      } else {
         this.setState({
            serviceIndex: index,
            isToggelOpen: true
         })
      }
      this.setState({
         activeIndex: index
      })
   }

   handleAddNewService = (service, index) => {
      const ServiceData = [...this.state.serviceData]
      ServiceData[index].isCannedAdded = true;
      let payload = '';
      ServiceData[index].serviceItems.map((item,indexT)=>{
          if (item.isItemChecked === false) {
             console.log(item ," $$$$$ Item")
            ServiceData[index].serviceItems.splice(indexT, 1);
          }
          return true
       });
       payload = ServiceData[index];
       console.log(payload, "*********  payload *******");
      // this.setState({
      //    serviceData: ServiceData
      // })
      this.props.handleAddToService(payload);
   }

   handleServiceItems = (e, serviceItem, index, sIndex) => {
      const { value } = e.target;
      const ServiceData = [...this.state.serviceData];
      var bool_value = value === "true" ? false : true;
      ServiceData[index].serviceItems[sIndex].isItemChecked = bool_value;

      // console.log(value, "value");
      this.setState({
         serviceData: ServiceData
      });
   }
   handleDeleteCannedService = async (serviceId) => {
      const { value } = await ConfirmBox({
         text: "Do you want to remove this canned service?"
      });
      if (!value) {
         return;
      } else {
         this.props.deleteCannedServiceRequest({ cannedServiceId: serviceId })
      }
   }
   render() {
      const { openCannedService, handleCannedServiceModal } = this.props
      const { serviceId, serviceData, serviceIndex, isToggelOpen, activeIndex, input } = this.state

      // console.log(serviceData, "serviceData");
      return (
         <>
            <Modal
               isOpen={openCannedService}
               toggle={handleCannedServiceModal}
               className='customer-modal custom-form-modal modal-lg'
               backdrop={"static"}
            >
               <ModalHeader toggle={handleCannedServiceModal}>Canned Services</ModalHeader>
               <ModalBody>
                  <Col md={"12"}>
                     <FormGroup className={"fleet-block"}>
                        <Label htmlFor="name" className="customer-modal-text-style">
                           Search Canned Services
                        </Label>
                        <div className={"input-block"}>
                           <Async
                              placeholder={"Type to select Service from the list"}
                              loadOptions={this.searchCannedServices}
                              className="w-100 form-select"
                              value={serviceId}
                              onBlur={this.onBlur}
                              onChange={e => {
                                 this.handleAddCannedService(e)
                              }}
                              isClearable={true}
                              noOptionsMessage={() =>
                                 input ? "No Service found" : "Type Canned Service name"
                              }
                           />
                        </div>
                     </FormGroup>
                  </Col>
                  <div className={"d-flex flex-column"}>
                     <div className={"p-2 mb-0 border-secondary border-top border-bottom d-flex justify-content-between canned-service-header"}>
                        <span width="250" className={"text-center pl-2"}>Service Name</span>
                        <span width="250" className={"text-center pl-2 pr-5"}>Action</span>
                     </div>
                     <div>
                        {
                           serviceData && serviceData.length ?
                              serviceData.map((item, index) => {
                                 return (
                                   <div key={index}>
                                     <div
                                       onClick={() =>
                                         this.handleServiceCollaps(index)
                                       }
                                       className={
                                         activeIndex === index
                                           ? "services-list-block active"
                                           : "services-list-block"
                                       }
                                     >
                                       {item.serviceItems &&
                                       item.serviceItems.length ? (
                                         isToggelOpen &&
                                         serviceIndex === index ? (
                                           <i className="icons icon-arrow-down arrow"></i>
                                         ) : (
                                           <i className="icons arrow icon-arrow-right"></i>
                                         )
                                       ) : (
                                         <i className="icons arrow icon-arrow-right"></i>
                                       )}

                                       <span>{item.serviceName}</span>
                                       <div>
                                         <span className={"mr-2"}>
                                           <Button
                                             size={"sm"}
                                             color={""}
                                             disabled={item.isCannedAdded}
                                             className={"btn btn-theme"}
                                             onClick={() =>
                                               this.handleAddNewService(
                                                 item,
                                                 index
                                               )
                                             }
                                           >
                                             <i className={"fa fa-plus mr-2"} />
                                             {item.isCannedAdded ? (
                                               <>
                                                 Service Added{" "}
                                                 <i className={"fa fa-check"} />
                                               </>
                                             ) : (
                                               "Add to service"
                                             )}
                                           </Button>
                                         </span>
                                         <span>
                                           <Button
                                             size={"sm"}
                                             id={`delete-${item._id}`}
                                             onClick={() =>
                                               this.handleDeleteCannedService(
                                                 item._id
                                               )
                                             }
                                             className={""}
                                             color={""}
                                           >
                                             <i className={"fas fa-close"} />
                                           </Button>
                                           <UncontrolledTooltip
                                             target={`delete-${item._id}`}
                                           >
                                             Delete Canned Service
                                           </UncontrolledTooltip>
                                         </span>
                                       </div>
                                     </div>
                                     {serviceIndex === index && isToggelOpen ? (
                                       item.serviceItems &&
                                       item.serviceItems.length ? (
                                         item.serviceItems.map(
                                           (serviceItem, sIndex) => {
                                             return (
                                               <>
                                                 <div
                                                   key={index}
                                                   className={
                                                     "service-toggel-block"
                                                   }
                                                 >
                                                   <div
                                                     className={
                                                       "service-toggel-check"
                                                     }
                                                   >
                                                     <Input
                                                       type="checkbox"
                                                       id={sIndex}
                                                       checked={
                                                         serviceItem.isItemChecked
                                                       }
                                                       value={
                                                         serviceItem.isItemChecked
                                                       }
                                                       onChange={e =>
                                                         this.handleServiceItems(
                                                           e,
                                                           serviceItem,
                                                           index,
                                                           sIndex
                                                         )
                                                       }
                                                       className={""}
                                                     />
                                                     <label
                                                       htmlFor={sIndex}
                                                       className={""}
                                                     >
                                                       {serviceItem.description ||
                                                         serviceItem.brandName ||
                                                         serviceItem.discription ||
                                                         "-"}
                                                     </label>
                                                   </div>
                                                 </div>
                                               </>
                                             );
                                           }
                                         )
                                       ) : (
                                         <div
                                           key={index}
                                           className={
                                             "service-toggel-block text-center"
                                           }
                                         >
                                           No any Service Item Added
                                         </div>
                                       )
                                     ) : null}
                                   </div>
                                 );
                              }) :
                              <div>
                                 <div className={"text-center"} colSpan={12}>
                                    <NoDataFound showAddButton={false} message={input !== "" ? "No canned service found according to your search" : "Currently there are no Canned Service added."} />
                                 </div>
                              </div>
                        }
                     </div>
                  </div>
               </ModalBody>
            </Modal>
         </>
      );
   }
}
