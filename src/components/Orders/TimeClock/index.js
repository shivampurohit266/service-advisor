import React, { Component } from "react";

import { CrmTimeClockModal } from "../../common/CrmTimeClockModel";
import TimeLogList from "./timeLogList";
import Timers from "./Timers";

class TimeClock extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /**
   *
   */
  handleTimeClockModal = () => {
    const { modelInfoReducer, modelOperate } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    modelOperate({
      timeClockModalOpen: !timeClockModalOpen
    });
  };
  /**
   *
   */
  render() {
    const {
      modelInfoReducer,
      modelOperate,
      orderId,
      orderItems,
      getUserData,
      orderReducer,
      editTimeLogRequest,
      addTimeLogRequest,
      timelogReducer,
      startTimer,
      stopTimer,
      switchTimer } = this.props;
    const { modelDetails } = modelInfoReducer;
    const { timeClockModalOpen } = modelDetails;
    return (
      <div>
        <Timers
          orderId={orderId}
          orderItems={orderItems.serviceId}
          startTimer={startTimer}
          stopTimer={stopTimer}
          switchTimer={switchTimer}
        />
        <span
          className={"btn btn-theme-line mb-3 mt-2"}
          onClick={this.handleTimeClockModal}
        >
          <i className={"fa fa-plus"}></i> Add Time Manually
        </span>
        <TimeLogList
          orderId={orderId}
          timeLogData={timelogReducer.timeLogData}
          handleTimeClockModal={this.handleTimeClockModal}
          getUserData={getUserData}
          orderReducer={orderReducer}
          editTimeLogRequest={editTimeLogRequest}
          modelOperate={modelOperate}
          modelInfoReducer={modelInfoReducer}
          timeClockModalOpen={timeClockModalOpen}
        />
        <CrmTimeClockModal
          openTimeClockModal={timeClockModalOpen}
          getUserData={getUserData}
          orderReducer={orderReducer}
          handleTimeClockModal={this.handleTimeClockModal}
          addTimeLogRequest={addTimeLogRequest}
        />
      </div>
    );
  }
}

export default TimeClock;
