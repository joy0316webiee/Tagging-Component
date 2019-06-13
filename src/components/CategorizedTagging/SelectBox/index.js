import React, { Component } from 'react';

class SelectBox extends Component {
  state = {
    listOpen: false,
    headerTitle: this.props.title
  };

  componentDidUpdate(prevProps) {
    if (this.props.options.length !== prevProps.options.length) {
      this.handleChange(0);
    }
  }

  handleChange = index => {
    const { name, options, onChangeCallback } = this.props;
    onChangeCallback(name, options[index] && options[index]._id);
  };

  handleClickOutside() {
    this.setState({
      listOpen: false
    });
  }

  toggleList() {
    this.setState({
      listOpen: !this.state.listOpen
    });
  }

  render() {
    // const { options, value } = this.props;
    const { options } = this.props;
    const { listOpen, headerTitle } = this.state;
    return (
      <div className="container">
        <div className="header" onClick={this.toggleList}>
          <label>{headerTitle}</label>
        </div>
        {listOpen && (
          <ul className="list">
            {options.map((option, index) => (
              <li className="list-item" key={index}>
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default SelectBox;
