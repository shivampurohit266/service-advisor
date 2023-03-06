import { handleActions } from "redux-actions";

import { timelogActions } from "../actions";

const initialState = {
  isSuccess: false,
  timeLogData: [],
  technicianTime: [],
  allTimeData: [],
  technicianTodayData: [],
  technicianWeekData: [],
  technicianMonthData: [],
  totalduration: 0,
  totalTimeLogs: 0
};

export const timelogReducer = handleActions(
  {
    [timelogActions.START_TIMER]: (state, { payload }) => ({
      ...state,
      ...payload
    }),
    [timelogActions.ADD_TIME_LOG_REQUEST]: (state, { payload }) => ({
      ...state,
      isSuccess: false
    }),
    [timelogActions.ADD_TIME_LOG_SUCCESS]: (state, { payload }) => ({
      ...state,
      isSuccess: true
    }),
    [timelogActions.GET_TIME_LOG_REQUEST]: (state, { payload }) => ({
      ...state,
      timeLogData: [],
      isSuccess: false
    }),
    [timelogActions.GET_TIME_LOG_SUCCESS]: (state, { payload }) => ({
      ...state,
      timeLogData: payload.timeLog,
      isSuccess: true
    }),
    [timelogActions.GET_TECHNICIAN_TIME_LOGS_REQUEST]: (state, { payload }) => ({
      ...state,
      technicianTime: [],
      isSuccess: false
    }),
    [timelogActions.GET_TECHNICIAN_TIME_LOGS_SUCCESS]: (state, { payload }) => ({
      ...state,
      technicianTime: payload,
      isSuccess: true
    }),
    [timelogActions.GET_ALL_TIME_LOGS_REQUEST]: (state, { payload }) => ({
      ...state,
      allTimeData: [],
      isSuccess: false
    }),
    [timelogActions.GET_ALL_TIME_LOGS_SUCCESS]: (state, { payload }) => ({
      ...state,
      allTimeData: payload.timeLogs,
      totalDuration: payload.totalDuration,
      totalTimeLogs: payload.totalTimeLogs,
      technicianTodayData: payload.technicianTodayData,
      technicianWeekData: payload.technicianWeekData,
      technicianMonthData: payload.technicianMonthData,
      isSuccess: true
    })
  },
  initialState
);
