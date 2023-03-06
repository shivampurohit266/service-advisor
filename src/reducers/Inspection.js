import { handleActions } from "redux-actions";
import { InspectionActions } from "../actions";

const initialState = {
  inspectionData: {
    isSuccess: false,
    data: {}
  },
  templateData: [],
  isLoading: true,
  messageTemplateData: {
    isSuccess: false,
    data: {}
  },
  isInspectionLoading: false
};

export const inspectionReducer = handleActions(
  {
    [InspectionActions.ADD_INSPCETION]: (state, action) => ({
      ...state,
      inspectionData: {
        ...state.userData,
        isSuccess: false
      }
    }),
    [InspectionActions.ADD_INSPCETION_SUCCESS]: (state, action) => ({
      ...state,
      inspectionData: {
        ...state.inspectionData,
        data: action.payload.inspectionData
      },
      isInspectionLoading: action.payload.isInspectionLoading
    }),
    [InspectionActions.ADD_INSPCETION_TEMPLATE]: (state, action) => ({
      ...state,
      inspectionData: {
        ...state.userData,
        isSuccess: false
      }
    }),
    // [InspectionActions.ADD_INSPCETION_TEMPLATE_SUCCESS]: (state, action) => ({
    //   ...state,
    //   inspectionData: {
    //     templateData: action.payload,
    //     isSuccess: true
    //   }
    // }),
    [InspectionActions.GET_INSPECTION_LIST]: (state, action) => ({
      ...state,
      inspectionData: {
        ...state.userData,
        isSuccess: false
      }
    }),
    [InspectionActions.GET_INSPECTION_LIST_SUCCESS]: (state, action) => ({
      ...state,
      inspectionData: {
        data: action.payload.inspection,
        isSuccess: false
      }
    }),
    [InspectionActions.GET_TEMPLATE_LIST_SUCCESS]: (state, { payload }) => ({
      ...state,
      isLoading: false,
      templateData: payload.templateData
    }),
    [InspectionActions.ADD_MESSAGE_TEMPLATE]: (state, action) => ({
      ...state,
      messageTemplateData: {
        ...state.data,
        isSuccess: false
      }
    }),
    [InspectionActions.ADD_MESSAGE_TEMPLATE_SUCCESS]: (state, action) => ({
      ...state,
      messageTemplateData: {
        isSuccess: true,
        ...state.data
      }
    }),
    [InspectionActions.GET_MESSAGE_TEMPLATE_LIST_SUCCESS]: (
      state,
      { payload }
    ) => ({
      ...state,
      isLoading: false,
      messageTemplateData: payload.messageTemplateData
    }),
    [InspectionActions.UPDATE_MESSAGE_TEMPLATE]: (state, action) => ({
      ...state,
      messageTemplateData: {
        ...state.data,
        isSuccess: false
      }
    }),
    [InspectionActions.UPDATE_MESSAGE_TEMPLATE_SUCCESS]: (state, action) => ({
      ...state,
      messageTemplateData: {
        isSuccess: true,
        ...state.data
      }
    }),
    [InspectionActions.DELETE_MESSAGE_TEMPLATE_SUCCESS]: (state, action) => ({
      ...state,
      messageTemplateData: {
        isSuccess: true,
        ...state.data
      }
    }),
    [InspectionActions.SEND_MESSAGE_TEMPLATE]: (state, action) => ({
      ...state,
      messageTemplateData: {
        ...state.userData,
        isSuccess: false
      }
    }),
    [InspectionActions.SEND_MESSAGE_TEMPLATE_SUCCESS]: (state, action) => ({
      ...state,
      messageTemplateData: {
        isSuccess: true,
        ...state.data,
        data: action.payload
      }
    }),
    [InspectionActions.ADD_INSPCETION_TO_REDUCER]: (state, { payload }) => ({
      ...state,
      inspectionData: {
        data: payload,
        isSuccess: true
      }
    })
  },
  initialState
);
