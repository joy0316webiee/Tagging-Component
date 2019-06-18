import React, { Component } from 'react';
import className from 'classnames';

import './style.scss';

class SwitchBox extends Component {
  state = {
    enabled: this.props.value
  };

  handleChange = () => {
    const { name, handleChange } = this.props;

    this.setState(
      {
        enabled: !this.state.enabled
      },
      () => {
        handleChange(name, this.state.enabled);
      }
    );
  };

  render() {
    const { enabled } = this.state;

    return (
      <div className="switchbox" onClick={this.handleChange}>
        <span className="track" />
        <span className={className('handle', { disabled: !enabled })} />
      </div>
    );
  }
}

export { SwitchBox };
