import React, { Component } from 'react';
import className from 'classnames';

import data from '../colors.json';
import './style.scss';

class SelectBox extends Component {
  state = {
    listOpen: false,
    selected: null,
    filter: '',
    filteredOptions: [...this.props.options]
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.handleChange(0);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleChange = index => {
    const { name, options, onChangeCallback } = this.props;
    this.setState(
      {
        selected: options[index],
        listOpen: false
      },
      () => {
        onChangeCallback(`${name}Id`, options[index] && options[index]._id);
      }
    );
  };

  handleClickOutside = event => {
    if (this.WrapperRef && !this.WrapperRef.contains(event.target)) {
      this.setState({
        listOpen: false
      });
    }
  };

  handleChangeFilter = event => {
    const { options } = this.props;

    this.setState({
      filter: event.target.value,
      filteredOptions: options.filter(option =>
        option.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    });
  };

  setWrapperRef = node => {
    this.WrapperRef = node;
  };

  toggleList = () => {
    this.setState({
      listOpen: !this.state.listOpen
    });
  };

  getColorClass = (name, option) => {
    if (name !== 'category' || !option) return '';

    return data.colors.filter(color => color.id === option.colorId)[0].class;
  };

  render() {
    const { name } = this.props;
    const { filter, filteredOptions, listOpen, selected } = this.state;

    const displayOptions = () =>
      filteredOptions.map((option, index) => (
        <li
          className={className(
            'list-item',
            `${this.getColorClass(name, option)}`
          )}
          key={index}
          onClick={() => this.handleChange(index)}
        >
          {option.name}
          {name === 'category' && <span />}
        </li>
      ));

    return (
      <div className="selectbox" ref={this.setWrapperRef}>
        <div className="header" onClick={this.toggleList}>
          <label className={className(`${this.getColorClass(name, selected)}`)}>
            {selected && selected.name}
          </label>
        </div>
        {listOpen && (
          <div className="content">
            <input
              type="text"
              value={filter}
              placeholder={`Find ${name}`}
              onChange={this.handleChangeFilter}
            />
            <ul className="list">
              {filteredOptions.length > 0 ? (
                displayOptions()
              ) : (
                <li>No Search result</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default SelectBox;
