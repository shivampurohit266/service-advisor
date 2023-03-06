import React, { Component } from "react";
import { InputGroup, InputGroupAddon, InputGroupText, Input } from "reactstrap";
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brandSuggestions: null,
    };
    this.brands = [
      "Audi",
      "Audi1",
      "Audi2",
      "Audi3",
      "BMW",
      "Fiat",
      "Ford",
      "Honda",
      "Jaguar",
      "Mercedes",
      "Renault",
      "Volvo",
    ];
  }

  suggestBrands(event) {
    setTimeout(() => {
      let results = this.brands.filter(brand => {
        return brand.toLowerCase().startsWith(event.query.toLowerCase());
      });
      if (!results.length) {
        let data = ["no"];
        this.setState({ brandSuggestions: data });
      } else {
        this.setState({ brandSuggestions: results });
      }
    }, 1000);
  }

  itemTemplate(brand) {
    if (brand === "no") {
      return (
        <div className="p-clearfix search-output">
          <div
            style={{
              fontSize: "16px",
              textAlign: "center",
              margin: "10px 10px 0 0",
            }}
          >
            {"No Data Found"}
          </div>
        </div>
      );
    } else {
      return (
        <div className="p-clearfix search-output">
          <img
            alt={brand}
            src={
              "https://www.primefaces.org/primereact/showcase/resources/demo/images/car/Audi.png"
            }
            style={{
              width: "32px",
              display: "inline-block",
              margin: "5px 0 2px 5px",
            }}
          />
          <div
            style={{
              fontSize: "16px",
              float: "right",
              margin: "10px 10px 0 0",
            }}
          >
            {brand}
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fa fa-search fa-lg " />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type={"text"}
            className="form-control search-input"
            placeholder="Search customer, cars, orders, or vendors"
          />
        </InputGroup>
      </div>
    );
  }
}

export default SearchBar;
