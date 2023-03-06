import React, { Component } from "react";
import Select, { components } from "react-select";


class CustomOption extends Component {
  
  clickedOpen = () => {
      
      
  }

  render() {
    const { data, innerRef, innerProps } = this.props;
    
    return data.custom ? (
      <div
        className="cursor_pointer common-drop-down "
        ref={innerRef}
        {...innerProps}
        onClick={this.clickedOpen}
      >
        <span className="ml-3">Add New Customer</span>
      </div>
    ) : (
      <components.Option {...this.props} />
    );
  }
}

export class CrmSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  clickedOpen = (e) => {
    if (this.props.onClickAddNew) 
    this.props.onClickAddNew();
  }

  render() {
    const { defaultOptions } = this.props;   

    return (
      <>
        <Select
          components={{
            Option: CustomOption
          }}
          options={defaultOptions}
          onChange={this.clickedOpen}
        />
      </>
    );
  }
}


export default CrmSelect;