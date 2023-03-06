import React from "react";
import { Button } from "reactstrap";

const NoDataFound = props => {
  return (
    <div className={"no-data-found"}>
      {!props.noResult ? (
        <div>
          <div>
            <i className={"icons cui-ban"} />
          </div>
          <h5>{props.message || "No records available"}</h5>
          {props.showAddButton || typeof props.showAddButton === undefined ? (
            <p>Please click below button to add new.</p>
          ) : null}
          <div className={"pt-3"}>
            {props.showAddButton || typeof props.showAddButton === undefined ? (
              <Button className="btn-theme-line" onClick={props.onAddClick}>
                <i className="fa fa-plus" /> Add New
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div>
            <i className={"icons icon-magnifier"} />
          </div>
          <h5>{props.message || "No records available"}</h5>
          <ul className={"no-found-list"}>
            <li>Try to simplify your search</li>
            <li>Use different keywords</li>
            <li>Make sure words are spelled correctly</li>
          </ul>
        </>
      )}
    </div>
  );
};

export default NoDataFound;
