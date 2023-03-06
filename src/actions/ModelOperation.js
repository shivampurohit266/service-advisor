import { createAction } from 'redux-actions';

export const modelActions = {
    MODEL_OPEN_REQUEST: 'model Request!',
}

export const modelOpenRequest = createAction(modelActions.MODEL_OPEN_REQUEST);
