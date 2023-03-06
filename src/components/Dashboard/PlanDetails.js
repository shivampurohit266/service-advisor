import React from "react";
import moment from "moment";
const DashboardPlanDetails = props => (
  <div className={"dashboard-plan-container dashboard-block-container"}>
    <div className={"image-container"}>
      {/* <img src={CheckIcon} alt={""} /> */}
      <i className="icon-check icons font-2xl" />
    </div>
    <span>
      Hey{" "}
      <b className={"text-capitalize"}>
        {props.profileInfo.firstName}&nbsp;
        {props.profileInfo.lastName}
      </b>
      ! Your{" "}
      <span className={"text-capitalize"}>
        {props.profileInfo && props.profileInfo.parentId && props.profileInfo.parentId._id ?
          <>
            {
              !props.profileInfo.parentId.planId
                ? "Trial Period"
                : props.profileInfo.parentId.planId.name
            }
          </> :
          <>
            {!props.profileInfo.planId
              ? "Trial Period"
              : props.profileInfo.planId.name}
          </>
        }
      </span>{" "}
      membership plan will automatically renew on{" "}
      {moment(props.profileInfo && props.profileInfo.parentId && props.profileInfo.parentId.planExiprationDate ? props.profileInfo.parentId.planExiprationDate : props.profileInfo.planExiprationDate || "").format("MMM Do YYYY")}
      .
    </span>
  </div>
);

export default DashboardPlanDetails;
