import { toast } from "react-toastify";
import { createLogic } from "redux-logic";
import { ApiHelper } from "../helpers/ApiHelper";
import { logger } from "../helpers/Logger";
import { AppConfig } from "../config/AppConfig";
import {
   showLoader,
   hideLoader,
   tiersActions,
   modelOpenRequest,
   addTierSuccess,
   getTiersListSuccess,
   getTiersList,
   addTireToService
} from "./../actions";

let toastId = null;
const addTireLogic = createLogic({
   type: tiersActions.ADD_TIER,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/addTier",
         "POST",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0]
            );
         }
         dispatch(hideLoader());
         done();
         return;
      } else {
         const data = action.payload
         if (data.serviceTireModal) {
            let servicePartData = data.services[data.serviceIndex].serviceItems
            servicePartData.push({
               ...result.data.tierData,
               serviceType: "Tire",
               qty: 1,
               discount: {
                  value: '',
                  type: "%"
               },
               label: [{
                  color: "",
                  name: "",
                  isAddLabel: false
               }],
               subTotalValue: "",
               isItemChecked: true,
               unchangebleTotal: 0.00
            })
            dispatch(addTireToService({
               services: data.services,
               serviceIndex: data.serviceIndex
            }))
            dispatch(
               modelOpenRequest({
                  modelDetails: {
                     tireAddModalOpen: false
                  }
               })
            );
            dispatch(hideLoader());
            done();
         } else {
            if (!toast.isActive(toastId)) {
               toastId = toast.success(
                  result.messages[0]
               );
            }
            dispatch(
               modelOpenRequest({
                  modelDetails: {
                     tireAddModalOpen: false
                  }
               })
            );
            dispatch(addTierSuccess());
            dispatch(hideLoader());
            done();
         }
      }
   }
});

const getTiresLogic = createLogic({
   type: tiersActions.GET_TIER_LIST,
   async process({ action }, dispatch, done) {
      dispatch(
         getTiersListSuccess({
            isLoading: true,
            tires: []
         })
      );
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/tierList",
         "GET",
         true,
         {
            search: action.payload && action.payload.input ? action.payload.input : action.payload && action.payload.search ? action.payload.search : null,
            sort: action.payload && action.payload.sort ? action.payload.sort : null,
            status: action.payload && action.payload.status ? action.payload.status : null,
            type: action.payload && action.payload.type ? action.payload.type : null,
            vendorId: action.payload && action.payload.vendorId ? action.payload.vendorId : null,
            limit: AppConfig.ITEMS_PER_PAGE,
            page: action.payload && action.payload.page ? action.payload.page : null
         }
      );
      if (result.isError) {
         dispatch(
            getTiersListSuccess({
               isLoading: false,
               tires: []
            })
         );
         done();
         return;
      } else {
         var defaultOptions = [
            {
               value: "",
               label: "+ Add New Tire"
            }
         ];
         const options = result.data.data.map(tire => ({
            label:
               `${tire.brandName} ${tire.modalName}`,
            value: tire._id,
            tireData: {
               ...tire,
               qty: 1,
               serviceType: 'tire',
               discount: {
                  value: '',
                  type: "%"
               },
               label: [{
                  color: "",
                  name: "",
                  isAddLabel: false
               }],
               subTotalValue: "",
               isItemChecked: true,
               unchangebleTotal: 0.00
            }
         }));
         logger(action.payload && action.payload.callback ? action.payload.callback(defaultOptions.concat(options)) : null)
         dispatch(hideLoader());
         dispatch(
            getTiersListSuccess({
               isLoading: false,
               tires: result.data.data,
               totalTires: result.data.totalTier
            })
         );
         done();
      }
   }
});

const updateUserStatusLogic = createLogic({
   type: tiersActions.UPDATE_TIER_STATUS,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/updateStatus",
         "POST",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0]
            );
         }
         dispatch(hideLoader());
         done();
         return;
      } else {
         dispatch(hideLoader());
         delete action.payload.tires;
         delete action.payload.status;
         dispatch(
            getTiersList({
               ...action.payload
            })
         );

         toast.success(result.messages[0]);
         done();
      }
   }
});

const deleteTireLogic = createLogic({
   type: tiersActions.DELETE_TIER,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/delete",
         "DELETE",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0]
            );
         }
         dispatch(hideLoader());
         done();
         return;
      } else {
         toast.success(result.messages[0]);
         dispatch(hideLoader());
         delete action.payload.tireId;
         dispatch(
            getTiersList({
               ...action.payload
            })
         );
         done();
      }
   }
});

const editTiresLogic = createLogic({
   type: tiersActions.EDIT_TIER,
   async process({ action }, dispatch, done) {
      dispatch(showLoader());
      logger(action.payload);
      let api = new ApiHelper();
      let result = await api.FetchFromServer(
         "/tier",
         "/updateTier",
         "PUT",
         true,
         undefined,
         action.payload
      );
      if (result.isError) {
         if (!toast.isActive(toastId)) {
            toastId = toast.error(
               result.messages[0]
            );
         }
         dispatch(hideLoader());
         done();
         return;
      } else {
         if (!toast.isActive(toastId)) {
            toastId = toast.success(
               result.messages[0]
            );
         }
         dispatch(
            getTiersList({
               ...action.payload
            })
         );
         dispatch(
            modelOpenRequest({
               modelDetails: {
                  tireEditModalOpen: false
               }
            })
         );
         dispatch(hideLoader());
         done();
      }
   }
});

export const TiersLogic = [
   addTireLogic,
   getTiresLogic,
   updateUserStatusLogic,
   deleteTireLogic,
   editTiresLogic
];