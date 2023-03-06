import { handleActions } from "redux-actions";
import { inventoryStatsAction } from "../actions";

const initialInventoryStatState = {
  data: {
    quantity: {
      parts: 0,
      tires: 0
    },
    cost: {
      parts: 0,
      tires: 0
    },
    value: {
      parts: 0,
      tires: 0
    }
  },
  isLoading: true
};

export const inventoryStatsReducer = handleActions(
  {
    [inventoryStatsAction.GET_INVENTORY_STATS_SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload,
      isLoading: false
    })
  },
  initialInventoryStatState
);
