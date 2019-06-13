import React, { Component } from 'react';
import classNames from 'classnames';
import ImgUnion from '../../../assets/images/ic_union.png';

import data from '../colors.json';
import './style.scss';

class TagElement extends Component {
  getChildById = (children, id) => {
    const index = children.findIndex(item => item._id === id);
    return children[index];
  };

  getTagClass = () => {
    const { categories, categoryId } = this.props;
    const { colorId } = categories.filter(
      category => category._id === categoryId
    )[0];
    return data.colors.filter(color => color.id === colorId)[0].class;
  };

  handleClickSelf = event => {
    event.stopPropagation();
    this.props.handleClickSelf && this.props.handleClickSelf();
  };

  render() {
    // prettier-ignore
    const { name, categories, categoryId, groups, groupId, description, keyword, visibility} = this.props;

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
          <div className="tag-actions">
            {[...Array(3)].map((_, i) => (
              <span className="round" key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default TagElement;
