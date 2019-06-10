import React, { Component } from 'react';
import Tag from './Tag';
import axios from 'axios';

import './style.scss';

class CategorizedTagging extends Component {
  state = {
    categories: [],
    groups: [],
    tags: [],
    selectedTags: [],
    searchedTags: [],
    keyword: '',
    errors: [],
    loading: false,
    toggle: false
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.fetchData();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  fetchData = () => {
    this.setState({ loading: true });

    const baseURL = 'http://localhost:3002/data';
    axios
      .get(baseURL)
      .then(res => {
        this.setState({
          ...res.data,
          errors: [],
          loading: false
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          errors: this.state.errors.concat(err)
        });
      });
  };

  handleChange = event => {
    const { tags } = this.state;
    const keyword = event.target.value;

    this.setState({
      keyword,
      toggle: keyword,
      searchedTags: tags.filter(tag => {
        return keyword && tag.name.includes(keyword);
      })
    });
  };

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ toggle: false });
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  render() {
    // prettier-ignore
    const { categories, groups, selectedTags, searchedTags, errors, loading, toggle, keyword } = this.state;

    const displayDropdown = () => {
      let categoriedTags = categories.reduce((acc, category) => {
        const filteredTags = searchedTags.filter(tag => {
          return tag.categoryID === category._id;
        });

        const categoriedTag = {
          category: category.name,
          tags: filteredTags
        };
        acc.push(categoriedTag);

        return acc;
      }, []);

      console.log(categoriedTags);

      return (
        <div className="tagging-dropdown">
          {categoriedTags.map((item, index) => (
            <div key={index} className="tagging-categorized-group">
              <div className="tagging-category">
                <span className="bull-point" />
                <label>{item.category}</label>
              </div>
              <div className="tagging-group">
                {item.tags.map(tag => (
                  <Tag
                    key={tag._id}
                    categories={categories}
                    groups={groups}
                    {...tag}
                  />
                ))}
                <div className="tagging-create">
                  <button>
                    create a new {item.category} "{keyword}"
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="tagging-container" ref={this.setWrapperRef}>
        <div className="tagging-box">
          <div className="tagging-group">
            {selectedTags.map(tag => (
              <Tag categories={categories} groups={groups} {...tag} />
            ))}
          </div>
          <div className="tagging-search">
            <input
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleChange}
            />
          </div>
        </div>
        {toggle && displayDropdown()}
        <div className="tagging-actions">
          {[...Array(3)].map((_, i) => (
            <span className="round" key={i} />
          ))}
        </div>
      </div>
    );
  }
}

export { CategorizedTagging };
