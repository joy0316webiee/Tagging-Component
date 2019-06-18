import React, { Component } from 'react';
import classNames from 'classnames';
import ImgUnion from '../../../../assets/images/ic_union.png';
import { colors } from '../../constants.json';
import './style.scss';

class TagElement extends Component {
  state = {
    toggle: false
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({
        toggle: false
      });
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  getChildById = (children, id) => {
    const index = children.findIndex(item => item.id === id);
    return children[index];
  };

  getTagClass = () => {
    const { categories, categoryId, enabled } = this.props;
    if (!enabled) return 'disabled';

    const { colorId } = categories.filter(
      category => category.id === categoryId
    )[0];
    return colors.filter(color => color.id === colorId)[0].class;
  };

  toggleActions = () => {
    this.setState({
      toggle: !this.state.toggle
    });
  };

  handleAction = action => {
    const { index, onAction } = this.props;
    this.setState({
      toggle: false
    });
    onAction(index, action);
  };

  handleClickSelf = event => {
    event.stopPropagation();
    this.props.handleClickSelf && this.props.handleClickSelf();
  };

  render() {
    // prettier-ignore
    const { name, categories, categoryId, groups, groupId, description, keyword, visibility, enabled, editable } = this.props;
    const { toggle } = this.state;

    const displayFilteredName = (name, keyword) => {
      const index = name.toLowerCase().indexOf(keyword.toLowerCase());
      const regex = name.substr(index, keyword.length);
      return name.replace(regex, `<strong>${regex}</strong>`);
    };

    return (
      <div
        className={classNames('tag-container', `${this.getTagClass()}`)}
        onClick={this.handleClickSelf}
      >
        <div className="tag-header">
          {visibility.group && (
            <div className="tag-group">
              <img src={ImgUnion} alt="union" />
              <span>{this.getChildById(groups, groupId).name}</span>
            </div>
          )}
          {visibility.category && (
            <div className="tag-category">
              <span>{this.getChildById(categories, categoryId).name}</span>
            </div>
          )}
        </div>
        {visibility.description && (
          <div className="tag-content">
            <div className="tag-description">
              <p>{description}</p>
            </div>
          </div>
        )}
        <div className="tag-footer">
          <div className="tag-name">
            <span
              dangerouslySetInnerHTML={{
                __html: displayFilteredName(name, keyword)
              }}
            />
          </div>
          {editable && (
            <div className="tag-actions" ref={this.setWrapperRef}>
              <div className="toggle" onClick={this.toggleActions}>
                {[...Array(3)].map((_, i) => (
                  <span className="round" key={i} />
                ))}
              </div>
              {toggle && ( // prettier-ignore
                <ul className="dropdown">
                  <li
                    className="edit"
                    onClick={() => this.handleAction('edit')}
                  >
                    Edit
                  </li>
                  <li
                    className="disable"
                    onClick={() => this.handleAction('disable')}
                  >
                    {enabled ? 'Disable' : 'Enable'}
                  </li>
                  <li
                    className="delete"
                    onClick={() => this.handleAction('delete')}
                  >
                    Delete
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export { TagElement };
