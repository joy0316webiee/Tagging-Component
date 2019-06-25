import React, { Component } from 'react';
import ReactModal from 'react-modal';
import className from 'classnames';
import uuidv4 from 'uuid/v4';
import { SwitchBox, SelectBox, CheckBox, UrlBox } from '../../Partials';

import './style.scss';

ReactModal.setAppElement('#root');

const initialState = {
  name: '',
  categoryId: '',
  groupId: '',
  description: '',
  hasImage: false,
  imgUrl: '',
  enabled: true,
  errors: []
};
class ModalBox extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      this.clearState();
    } else if (this.props.tagInfo !== nextProps.tagInfo) {
      this.setState({
        ...nextProps.tagInfo
      });
    } else if (this.props.errors !== nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  handleChangeValue = (key, value) => {
    this.setState({ [key]: value }, () => {
      if (key === 'hasImage') {
        this.handleErrors('imgUrl', !value || this.state.imgUrl.length === 0);
      }
    });
  };

  handleChangeText = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value }, () => {
      this.handleErrors(name, value === '');
    });
  };

  handleErrors = (field, isError) => {
    const { hasImage, errors } = this.state;

    if (field === 'imgUrl') isError = isError && hasImage;
    if (!isError) {
      this.setState({
        errors: errors.filter(error => error !== field)
      });
    } else if (!errors.includes(field)) {
      this.setState({
        errors: errors.concat(field)
      });
    }
  };

  getErrorClass = (errors, field) => {
    return errors.includes(field) ? 'error' : '';
  };

  handleSubmit = () => {
    if (this.validateForm(this.state)) {
      // prettier-ignore
      const { hasImage, errors, ...rest } = this.state;
      const { editable, tagInfo, onSubmit } = this.props;

      const id = editable ? tagInfo.id : uuidv4();
      const newTag = { id, ...rest };

      onSubmit(newTag);
    }
  };

  validateForm = state => {
    const errors = Object.keys(state).reduce((acc, key) => {
      if (
        typeof state[key] === 'string' &&
        !state[key].length &&
        !state.errors.includes(key)
      ) {
        if (key === 'imgUrl') {
          if (state['hasImage']) acc.push(key);
        } else {
          acc.push(key);
        }
      }
      return acc;
    }, []);

    const temp = [...this.state.errors, ...errors];
    this.setState({ errors: temp });

    return temp.length === 0;
  };

  render() {
    // prettier-ignore
    const { name, enabled, categoryId, groupId, description, hasImage, imgUrl, errors } = this.state;
    // prettier-ignore
    const { isOpen, categories, groups, editable, handleCloseModal } = this.props;

    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel="ModalBox"
        onRequestClose={handleCloseModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-header">
          <h1>{editable ? 'Edit Tag' : 'Create new tag'}</h1>
          <button onClick={handleCloseModal}>&times;</button>
        </div>
        <div className="modal-content">
          <div className="name">
            <label>Name</label>
            <input
              name="name"
              className={className(
                'control',
                `${this.getErrorClass(errors, 'name')}`
              )}
              value={name}
              type="text"
              onChange={this.handleChangeText}
            />
          </div>
          <div className="symbol">
            <div className="title">
              <CheckBox
                name="hasImage"
                checked={hasImage}
                onChange={this.handleChangeValue}
              />
              <label>Image</label>
            </div>
            <div className="image">
              <img src={imgUrl} alt="" />
              <UrlBox
                name="imgUrl"
                classes={className(`${this.getErrorClass(errors, 'imgUrl')}`)}
                value={imgUrl}
                onError={this.handleErrors}
                onChangeCallback={this.handleChangeValue}
              />
            </div>
          </div>
          <div className="category">
            <label>Category</label>
            <SelectBox
              name="category"
              classes={className(`${this.getErrorClass(errors, 'categoryId')}`)}
              value={categoryId}
              options={categories}
              onError={this.handleErrors}
              onChangeCallback={this.handleChangeValue}
            />
          </div>
          <div className="group">
            <label>Group</label>
            <SelectBox
              name="group"
              classes={className(`${this.getErrorClass(errors, 'groupId')}`)}
              value={groupId}
              options={groups}
              onError={this.handleErrors}
              onChangeCallback={this.handleChangeValue}
            />
          </div>
          <div className="description">
            <label>Description</label>
            <textarea
              name="description"
              value={description}
              className={className(
                'control',
                `${this.getErrorClass(errors, 'description')}`
              )}
              placeholder="Text here"
              onChange={this.handleChangeText}
            />
          </div>
          <div className="status">
            <label>Status</label>
            <div className="control switch">
              <span className={className({ disable: !enabled })}>
                {enabled ? 'Enable' : 'Disable'}
              </span>
              <SwitchBox
                name="enabled"
                value={enabled}
                handleChange={this.handleChangeValue}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="control" onClick={this.handleSubmit}>
            {editable ? 'Save Tag' : 'Create Tag'}
          </button>
        </div>
      </ReactModal>
    );
  }
}

export { ModalBox };
