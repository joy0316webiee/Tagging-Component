import React, { Component } from 'react';
import ImgUnion from '../../../assets/images/ic_union.png';
import './style.scss';

class Tag extends Component {
  state = {};

  getChildById = (children, id) => {
    const index = children.findIndex(item => item._id === id);
    return children[index].name;
  };

  render() {
    // prettier-ignore
    const { _id, name, categories, categoryID, groups, groupID, description } = this.props;

    return (
      <div className="tag-container">
        <div className="tag-header">
          <div className="tag-name">
            <span>{name}</span>
          </div>
        </div>
        <div className="tag-content">
          <div className="tag-description">
            <p>{description}</p>
          </div>
        </div>
        <div className="tag-footer">
          <div className="tag-group">
            <img src={ImgUnion} alt="union" />
            <span>{this.getChildById(groups, groupID)}</span>
          </div>
          <div className="tag-category">
            <span>{this.getChildById(categories, categoryID)}</span>
          </div>
        </div>
        <div className="tag-actions">
          {[...Array(3)].map((_, i) => (
            <span className="round" key={i} />
          ))}
        </div>
      </div>
    );
  }
}

export default Tag;
