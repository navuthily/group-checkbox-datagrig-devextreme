import React from "react";
import  CheckBox from "devextreme-react/check-box";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.material.blue.light.compact.css";
class GroupTemplate extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <CheckBox
          value={this.props.checked}
          onValueChanged={this.props.onValueChanged}
        />
        <span style={{ marginLeft: "5px" }}> {this.props.groupText} </span>
      </React.Fragment>
    );
  }
}

export default GroupTemplate;
