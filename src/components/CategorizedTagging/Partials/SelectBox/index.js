import React, { Component } from 'react';
import className from 'classnames';

import { colors } from '../../constants.json';
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
    this.setDefaultSelected();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setDefaultSelected = () => {
    const { value, options } = this.props;
    if (value.length === 0) return;

    this.setState({
      selected: options.filter(option => option.id === value)[0]
    });
  };

  handleChange = index => {
    const { name, options, onError, onChangeCallback } = this.props;
    this.setState(
      {
        selected: options[index],
        listOpen: false
      },
      () => {
        onError(`${name}Id`, false);
        onChangeCallback(`${name}Id`, options[index] && options[index].id);
      }
    );
  };

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
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
    this.wrapperRef = node;
  };

  toggleList = () => {
    this.setState({
      listOpen: !this.state.listOpen
    });
  };

  getColorClass = (name, option) => {
    if (name !== 'category' || !option) return '';

    return colors.filter(color => color.id === option.colorId)[0].class;
  };

  render() {
    const { name, classes } = this.props;
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
        <div className={className('header', classes)} onClick={this.toggleList}>
          <label className={className(`${this.getColorClass(name, selected)}`)}>
            {selected ? selected.name : <span>Select</span>}
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

export { SelectBox };
