import React, { Component } from 'react';

import './style.scss';

class CheckBox extends Component {
  state = {
    checked: this.props.checked
  };

  handleChange = () => {
    const { name, onChange } = this.props;

    this.setState(
      {
        checked: !this.state.checked
      },
      () => {
        onChange(name, this.state.checked);
      }
    );
  };

  render() {
    const { checked } = this.state;

    return (
      <label className="checkbox-button">
        <input
          type="checkbox"
          className="checkbox-button__input"
          id="choice1-1"
          name="choice1"
          onChange={this.handleChange}
          checked={checked}
        />
        <span className="checkbox-button__control" />
      </label>
    );
  }
}

export default CheckBox;
