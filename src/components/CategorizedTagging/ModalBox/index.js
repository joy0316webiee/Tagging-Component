import React, { Component } from 'react';
import ReactModal from 'react-modal';
import className from 'classnames';
import SwitchBox from '../SwitchBox';
import SelectBox from '../SelectBox';
import CheckBox from '../CheckBox';
import mime from 'mime-types';

import { authorized, images } from '../constants.json';
import './style.scss';

ReactModal.setAppElement('#root');

class ModalBox extends Component {
  state = {
    enabled: true,
    categoryId: '',
    groupId: '',
    hasImage: false,
    imageId: -1
  };

  handleChangeEnabled = value => {
    this.setState({ enabled: value });
  };

  handleChangeSelection = (key, value) => {
    this.setState({ [key]: value });
  };

  handleChangeHasImage = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleClickAction = () => {};

  getImage = id => {
    const filteredImages = images.filter(image => image.id === id);
    if (filteredImages.length === 0) return '';

    let filename = filteredImages[0].path;
    if (!authorized.includes(mime.lookup(filename))) return '';

    if (
      !filename.toLowerCase().includes('http://') &&
      !filename.toLowerCase().includes('https://')
    ) {
      filename = require.context('../../../assets/images', true)(
        `./${filename}`
      );
    }

    return filename;
  };

  render() {
    const { enabled, categoryId, groupId, imageId, hasImage } = this.state;
    const { isOpen, categories, groups, handleCloseModal } = this.props;

    return (
      <div>
        <ReactModal
          isOpen={isOpen}
          contentLabel="ModalBox"
          onRequestClose={handleCloseModal}
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal-header">
            <h1>Create new tag</h1>
            <button onClick={handleCloseModal}>&times;</button>
          </div>
          <div className="modal-content">
            <div className="name">
              <label>Name</label>
              <input className="control" type="text" />
            </div>
            <div className="symbol">
              <div className="title">
                <CheckBox
                  name="hasImage"
                  checked={hasImage}
                  onChange={this.handleChangeHasImage}
                />
                <label>Image</label>
              </div>
              <div className="image">
                <img src={`${this.getImage(imageId)}`} alt="" />
                <SelectBox
                  name="image"
                  value={imageId}
                  options={images}
                  onChangeCallback={this.handleChangeSelection}
                />
              </div>
            </div>
            <div className="category">
              <label>Category</label>
              <SelectBox
                name="category"
                value={categoryId}
                options={categories}
                onChangeCallback={this.handleChangeSelection}
              />
            </div>
            <div className="group">
              <label>Group</label>
              <SelectBox
                name="group"
                value={groupId}
                options={groups}
                onChangeCallback={this.handleChangeSelection}
              />
            </div>
            <div className="description">
              <label>Description</label>
              <textarea className="control" placeholder="Text here" />
            </div>
            <div className="status">
              <label>Status</label>
              <div className="control switch">
                <span className={className({ disable: !enabled })}>
                  {enabled ? 'Enable' : 'Disable'}
                </span>
                <SwitchBox handleChange={this.handleChangeEnabled} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="control" onClick={this.handleClickAction}>
              Create Tag
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }
}

export default ModalBox;
