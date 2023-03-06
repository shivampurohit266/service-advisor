import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";

const VehicleTabs = props => {
  return (
    <Nav pills className={"inventory-nav"}>
      {props.tabs
        ? props.tabs.map((tab, index) => {
          return (
            <NavItem key={index}>
              <NavLink
                href={tab.url}
                active={index === props.activeTab}
                onClick={e => {
                  e.preventDefault();
                  if (props.onTabChange) props.onTabChange(index);
                }}
              >
                {tab.name}
              </NavLink>
            </NavItem>
          );
        })
        : null}
    </Nav>
  );
};

export default VehicleTabs;
