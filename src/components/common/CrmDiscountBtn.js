import React, { Component } from "react";
import {
    UncontrolledTooltip,
    Button
} from "reactstrap";

class CrmDiscountBtn extends Component {
    render() {
        const { index, sIndex } = this.props
        return (
            <>
                <div className="discount-button">
                    <Button id={!index ? "percent" : `DiscountPercent${index}${sIndex}`} className={(this.props.discountType === '%') ? "btn btn-secondary btn-sm active dollar-btn" : 'btn btn-secondary btn-sm dollar-btn'} onClick={() => this.props.handleClickDiscountType('%')}>
                        <span className="dollar-price"><i className="fa fa-percent dollar-icon"></i></span>
                    </Button>
                    <UncontrolledTooltip target={!index ? "percent" : `DiscountPercent${index}${sIndex}`}>
                        Percent discount
                    </UncontrolledTooltip>
                    <Button id={!index ? "dollar" : `DiscountDoller${index}${sIndex}`} className={(this.props.discountType === '$') ? "btn btn-secondary btn-sm sec-btn active flat-btn" : 'btn btn-secondary btn-sm sec-btn flat-btn'} onClick={() => this.props.handleClickDiscountType('$')}>
                        <span className="dollar-price"><i className="fa fa-dollar dollar-icon"></i></span>
                    </Button>
                    <UncontrolledTooltip target={!index ? "dollar" : `DiscountDoller${index}${sIndex}`}>
                        Flat discount
                    </UncontrolledTooltip>
                </div>
            </>
        )
    }
}
export default CrmDiscountBtn;