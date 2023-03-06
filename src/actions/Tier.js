import { createAction } from "redux-actions";

export const tiersActions = {
    GET_TIER_LIST: "Tier list Requested!",
    GET_TIER_LIST_SUCCESS: "Tier list success!",
    ADD_TIER: "Add new tier Requested!",
    ADD_TIER_SUCCESS: "Add new tier Success!",
    EDIT_TIER: "Edit tier Requested!",
    EDIT_TIER_SUCCESS: "Edit tier Success!",
    DELETE_TIER: "Delete tier Requested!",
    UPDATE_TIER_STATUS: "Update tier status Requested!",
    ADD_SERVICE_TIRE: "Add tire to service",
};

export const getTiersList = createAction(tiersActions.GET_TIER_LIST);
export const getTiersListSuccess = createAction(
    tiersActions.GET_TIER_LIST_SUCCESS
);
export const addNewTier = createAction(tiersActions.ADD_TIER);
export const addTierSuccess = createAction(tiersActions.ADD_TIER_SUCCESS);
export const editTier = createAction(tiersActions.EDIT_TIER);
export const editTierSuccess = createAction(tiersActions.EDIT_TIER_SUCCESS);
export const deleteTier = createAction(tiersActions.DELETE_TIER);
export const updateTierStatus = createAction(tiersActions.UPDATE_TIER_STATUS);
export const addTireToService = createAction(tiersActions.ADD_SERVICE_TIRE)