import { createLogic } from "redux-logic";
import { inventoryStatsAction, getInventoryStatsSuccess } from "../actions";
import { ApiHelper, logger } from "../helpers";

const getInventoryStatsLogic = createLogic({
  type: inventoryStatsAction.GET_INVENTORY_STATS,
  async process({ action, getState }, dispatch, done) {
    const Api = new ApiHelper();
    const result = await Api.FetchFromServer(
      "/inventoryStat",
      "/",
      "GET",
      true
    );
    logger(result);
    dispatch(
      getInventoryStatsSuccess(
        result.isError
          ? getState().inventoryStatsReducer.data
          : result.data.data
      )
    );
    done();
  }
});

export const InventoryStatsLogic = [getInventoryStatsLogic];
