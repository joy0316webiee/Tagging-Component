import React, { Component } from 'react';
import imageExists from 'image-exists';
import className from 'classnames';

import './style.scss';

class UrlBox extends Component {
  state = {
    toggle: false,
    url: '',
    label: 'Image URL'
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setDefaultSelected();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setDefaultSelected = () => {
    const { value } = this.props;
    if (value.length === 0) return;

    this.setState({
      label: value,
      url: value
    });
  };

  handleToggle = () => {
    this.setState({
      toggle: !this.state.toggle
    });
  };

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ toggle: false });
    }
  };

  handleChangeUrl = event => {
    this.setState({
      url: event.target.value
    });
  };

  handleConfirm = () => {
    const { url } = this.state;

    imageExists(url, exists => {
      const { name, onError, onChangeCallback } = this.props;

      if (exists) {
        this.setState(
          {
            toggle: false,
            label: url
          },
          () => {
            onError(name, false);
            onChangeCallback(name, url);
          }
        );
      } else {
        this.setState(
          {
            toggle: false,
            label: 'Invalid URL'
          },
          () => {
            onError(name, true);
            onChangeCallback(name, '');
          }
        );
      }
    });
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  render() {
    const { classes } = this.props;
    const { toggle, url, label } = this.state;

    return (
      <div className="urlbox" ref={this.setWrapperRef}>
        <div
          className={className('header', classes)}
          onClick={this.handleToggle}
        >
          <label>{label}</label>
        </div>
        {toggle && (
          <div className="content">
            <div className="text-url">
              <input
                type="text"
                value={url}
                placeholder="Enter image Url"
                onChange={this.handleChangeUrl}
              />
            </div>
            <div className="confirm-button" onClick={this.handleConfirm}>
              <span className="plus">+</span>
              <span className="text">Confirm Image Url</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { UrlBox };
