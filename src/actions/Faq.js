import { createAction } from "redux-actions";

export const faqPageActions = {
   GET_FAQ_PAGE_REQUEST: "Get faq page req!",
   GET_FAQ_PAGE_FAILED: "Get faq page failed!",
   GET_FAQ_PAGE_SUCCESS: "Get faq page success!",
}

export const getFaqPageReq = createAction(
    faqPageActions.GET_FAQ_PAGE_REQUEST
);
export const getFaqPageFail = createAction(
    faqPageActions.GET_FAQ_PAGE_FAILED
);
export const getFaqPageSucc = createAction(
    faqPageActions.GET_FAQ_PAGE_SUCCESS
);
