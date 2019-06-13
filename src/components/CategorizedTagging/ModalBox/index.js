import React, { Component } from 'react';
import ReactModal from 'react-modal';
import className from 'classnames';
import SwitchBox from '../SwitchBox';
import SelectBox from '../SelectBox';
import './style.scss';

ReactModal.setAppElement('#root');

class ModalBox extends Component {
  state = {
    enabled: true,
    categoryId: '',
    groupId: ''
  };

  // componentDidUpdate(prevProps) {
  //   if (this.props.categories.length !== prevProps.categories.length) {
  //     this.setState({
  //       categoryId: this.props.categories[0]._id
  //     });
  //   }
  //   if (this.props.categories.length !== prevProps.categories.length) {
  //     this.setState({
  //       categoryId: this.props.categories[0]._id
  //     });
  //   }
  // }
  handleChangeEnabled = value => {
    this.setState({ enabled: value });
  };

  handleChangeSelection = (key, value) => {
    this.setState({ [key]: value });
  };

  handleClickAction = () => {};

  render() {
    const { enabled, categoryId, groupId } = this.state;
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
            <div className="category">
              <label>Category</label>
              <SelectBox
                name="categoryId"
                value={categoryId}
                options={categories}
                onChangeCallback={this.handleChangeSelection}
              />
            </div>
            <div className="group">
              <label>Group</label>
              <SelectBox
                name="groupId"
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
