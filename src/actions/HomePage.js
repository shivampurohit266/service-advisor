import { createAction } from "redux-actions";

export const homePageActions = {
   GET_HOME_PAGE_REQUEST: "Get home page req!",
   GET_HOME_PAGE_FAILED: "Get home page failed!",
   GET_HOME_PAGE_SUCCESS: "Get home page success!",
}

export const getHomePageReq = createAction(
   homePageActions.GET_HOME_PAGE_REQUEST
);
export const getHomePageFail = createAction(
   homePageActions.GET_HOME_PAGE_FAILED
);
export const getHomePageSucc = createAction(
   homePageActions.GET_HOME_PAGE_SUCCESS
);
