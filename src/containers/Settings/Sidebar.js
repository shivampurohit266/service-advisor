import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";
class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { navItems } = this.props;
    return (
      <ListGroup>
        {navItems && navItems.length ? (
          navItems.map((nav, index) => {
            if (nav.heading) {
              return (
                <ListGroupItem key={index}>
                  <i className={nav.icon} /> &nbsp;
                  {nav.name}
                </ListGroupItem>
              );
            } else if (nav.divider) {
              return <ListGroupItem key={index} className={"divider"} />;
            } else {
              return (
                <ListGroupItem key={index}>
                  <Link to={nav.link || "/settings"}>
                    {" "}
                    <i className={nav.icon} /> &nbsp;{nav.name}
                  </Link>
                </ListGroupItem>
              );
            }
          })
        ) : null}
      </ListGroup>
    );
  }
}

export default Sidebar;
