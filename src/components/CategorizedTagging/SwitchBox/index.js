import React, { Component } from 'react';
import className from 'classnames';

import './style.scss';

class SwitchBox extends Component {
  state = {
    enabled: true
  };

  handleChange = () => {
    this.setState(
      {
        enabled: !this.state.enabled
      },
      () => {
        this.props.handleChange(this.state.enabled);
      }
    );
  };

  render() {
    const { enabled } = this.state;

    return (
      <div className="switchbox">
        <span className="track" />
        <span
          className={className('handle', { disabled: !enabled })}
          onClick={this.handleChange}
        />
      </div>
    );
  }
}

export default SwitchBox;
