import React, { Component } from "react";
import { Pie } from "react-chartjs-2";
import { Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import Loader from "../../containers/Loader/Loader";
import NoDataFound from "../common/NoFound";
import { ConvertToShortenNumber } from "../../helpers/Currency";

class InventoryStats extends Component {
  componentDidMount() {
    this.props.getInventoryStats();
  }
  renderValueChart = () => {
    const { inventoryStats } = this.props;
    const { value } = inventoryStats;
    const valueChart = {
      labels: [`Parts (${value.parts})`, `Tires (${value.tires})`],
      datasets: [
        {
          data: [value.parts, value.tires],
          backgroundColor: ["#8157ef", "#20a8d8"],
          hoverBackgroundColor: ["#8157ef", "#20a8d8"]
        }
      ]
    };
    const total = value.parts + value.tires;
    return total ? (
      <Pie
        data={valueChart}
        options={{
          legend: {
            display: true,
            position: "left",
            labels: {
              boxWidth: 20,
              fontSize: 10
            }
          },
          title: {
            display: true,
            text: `Total Value(${ConvertToShortenNumber(total)})`,
            position: "top"
          }
        }}
      />
    ) : (
      <NoDataFound />
    );
  };
  renderCostChart = () => {
    const { inventoryStats } = this.props;
    const { cost } = inventoryStats;
    const costChart = {
      labels: [
        `Parts (${ConvertToShortenNumber(cost.parts)})`,
        `Tires (${ConvertToShortenNumber(cost.tires)})`
      ],
      datasets: [
        {
          data: [cost.parts, cost.tires],
          backgroundColor: ["#8157ef", "#20a8d8"],
          hoverBackgroundColor: ["#8157ef", "#20a8d8"]
        }
      ]
    };
    const total = cost.parts + cost.tires;
    return total ? (
      <Pie
        data={costChart}
        options={{
          legend: {
            display: true,
            position: "left",
            labels: {
              boxWidth: 20,
              fontSize: 10
            }
          },
          title: {
            display: true,
            text: `Total Cost(${ConvertToShortenNumber(total)})`,
            position: "top"
          }
        }}
      />
    ) : (
      <NoDataFound />
    );
  };
  renderQuantityChart = () => {
    const { inventoryStats } = this.props;
    const { quantity } = inventoryStats;
    const quantityChart = {
      labels: [
        `Parts (${ConvertToShortenNumber(quantity.parts)})`,
        `Tires (${ConvertToShortenNumber(quantity.tires)})`
      ],
      datasets: [
        {
          data: [quantity.parts, quantity.tires],
          backgroundColor: ["#8157ef", "#20a8d8"],
          hoverBackgroundColor: ["#8157ef", "#20a8d8"]
        }
      ]
    };
    const total = quantity.parts + quantity.tires;
    return total ? (
      <Pie
        data={quantityChart}
        options={{
          legend: {
            display: true,
            position: "left",
            labels: {
              boxWidth: 20,
              fontSize: 10
            }
          },
          title: {
            display: true,
            text: `Total Quantity(${ConvertToShortenNumber(total)})`,
            position: "top"
          }
        }}
      />
    ) : (
      <NoDataFound />
    );
  };
  render() {
    const { isLoading } = this.props;
    return (
      <Row>
        <Col sm={"4"}>
          <Card>
            <CardHeader>
              <h5>Total Quantity</h5>
            </CardHeader>
            <CardBody className={"text-center"}>
              {isLoading ? <Loader /> : this.renderQuantityChart()}
            </CardBody>
          </Card>
        </Col>
        <Col sm={"4"}>
          <Card>
            <CardHeader>
              <h5>Total Cost</h5>
            </CardHeader>
            <CardBody className={"text-center"}>
              {isLoading ? <Loader /> : this.renderCostChart()}
            </CardBody>
          </Card>
        </Col>
        <Col sm={"4"}>
          <Card>
            <CardHeader>
              <h5>Total Value</h5>
            </CardHeader>
            <CardBody className={"text-center"}>
              {isLoading ? <Loader /> : this.renderValueChart()}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default InventoryStats;
