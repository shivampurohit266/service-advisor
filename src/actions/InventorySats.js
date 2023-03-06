import { createAction } from "redux-actions";

export const inventoryStatsAction = {
  GET_INVENTORY_STATS: "get inventory stats!",
  GET_INVENTORY_STATS_SUCCESS: "get inventory stats success!"
};

export const getInventoryStats = createAction(
  inventoryStatsAction.GET_INVENTORY_STATS
);
export const getInventoryStatsSuccess = createAction(
  inventoryStatsAction.GET_INVENTORY_STATS_SUCCESS
);
