import { handleActions } from "redux-actions";
import { inventoryPartsActions } from "./../actions";

const initialInventoryPartState = {
  vendors: [],
  parts: [],
  isLoading: true
};

export const inventoryPartsReducers = handleActions(
  {
    [inventoryPartsActions.GET_VENDORS_LIST_SUCCESS]: (state, action) => ({
      ...state,
      vendors: action.payload
    }),
    [inventoryPartsActions.GET_VENDORS_LIST_START]: (state, action) => ({
      ...state,
      parts: [],
      isLoading: true
    }),
    [inventoryPartsActions.GET_PARTS_LIST_SUCCESS]: (state, action) => ({
      ...state,
      parts: action.payload.parts,
      totalParts: action.payload.total,
      isLoading: false
    }),
  },
  initialInventoryPartState
);
