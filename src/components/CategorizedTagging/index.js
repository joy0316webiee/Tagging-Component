import React, { Component } from 'react';
import AutosizeInput from 'react-input-autosize';
import className from 'classnames';
import TagElement from './TagElement';
import CheckBox from './CheckBox';
import axios from 'axios';

import data from './colors.json';
import './style.scss';

class CategorizedTagging extends Component {
  state = {
    categories: [],
    groups: [],
    tags: [],
    selectedTags: [],
    searchedTags: [],
    visibility: {
      category: true,
      group: true,
      description: false
    },
    keyword: '',
    errors: [],
    loading: false,
    toggleTagging: false,
    toggleActions: false
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.keyInput.focus();
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

  handleChangeKeyword = event => {
    const { tags } = this.state;
    const keyword = event.target.value;

    this.setState({
      keyword,
      toggleTagging: keyword,
      searchedTags: tags.filter(tag => {
        return (
          keyword && tag.name.toLowerCase().includes(keyword.toLowerCase())
        );
      })
    });
  };

  handleClickOutside = event => {
    if (
      this.taggingWrapperRef &&
      !this.taggingWrapperRef.contains(event.target)
    ) {
      this.setState({ toggleTagging: false });
    }
    if (
      this.actionsWrapperRef &&
      !this.actionsWrapperRef.contains(event.target)
    ) {
      this.setState({ toggleActions: false });
    }
  };

  handleClickTagElement = tag => {
    this.setState(
      {
        selectedTags: this.state.selectedTags.concat(tag),
        keyword: '',
        toggleTagging: false
      },
      () => {
        this.keyInput.focus();
      }
    );
  };

  handleClickTaggingBox = () => {
    this.keyInput.focus();
  };

  handleToggleActions = () => {
    this.setState({
      toggleActions: !this.state.toggleActions
    });
  };

  handleChangeVisibility = (key, value) => {
    this.setState({
      visibility: {
        ...this.state.visibility,
        [key]: value
      }
    });
  };

  setTaggingWrapperRef = node => {
    this.taggingWrapperRef = node;
  };

  setActionsWrapperRef = node => {
    this.actionsWrapperRef = node;
  };

  getCategoryClass = category => {
    return data.colors.filter(color => color.id === category.colorId)[0].class;
  };

  render() {
    // prettier-ignore
    const { categories, groups, selectedTags, searchedTags, errors, loading, toggleTagging, toggleActions, keyword, visibility } = this.state;

    const displayTaggingDropdown = () => {
      let categoriedTags = categories.reduce((acc, category) => {
        const filteredTags = searchedTags.filter(tag => {
          return tag.categoryId === category._id;
        });

        const categoriedTag = {
          category,
          tags: filteredTags
        };
        acc.push(categoriedTag);

        return acc;
      }, []);

      return (
        <div className="tagging-dropdown">
          {categoriedTags.map((item, index) => (
            <div key={index} className="tagging-categorized-group">
              <div
                className={className(
                  'tagging-category',
                  `${this.getCategoryClass(item.category)}`
                )}
              >
                <span className="bull-point" />
                <label>{item.category.name}</label>
              </div>
              <div className="tagging-group">
                {item.tags.map(tag => (
                  <TagElement
                    key={tag._id}
                    categories={categories}
                    groups={groups}
                    keyword={keyword}
                    visibility={visibility}
                    handleClickSelf={() => this.handleClickTagElement(tag)}
                    {...tag}
                  />
                ))}
                <div className="tagging-create">
                  <button>
                    create a new {item.category.name} "{keyword}"
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    };

    const displayActionsDropdown = () => {
      const { category, group, description } = visibility;

      return (
        <div className="visibility">
          <h1>Visibility</h1>
          <div className="category">
            <CheckBox
              name="category"
              checked={category}
              onChange={this.handleChangeVisibility}
            />
            <span>Category</span>
          </div>
          <div className="group">
            <CheckBox
              name="group"
              checked={group}
              onChange={this.handleChangeVisibility}
            />
            <span>Group</span>
          </div>
          <div className="Description">
            <CheckBox
              name="description"
              checked={description}
              onChange={this.handleChangeVisibility}
            />
            <span>Description</span>
          </div>
        </div>
      );
    };

    return (
      <div className="tagging-container" ref={this.setTaggingWrapperRef}>
        <div className="tagging-box" onClick={this.handleClickTaggingBox}>
          <div className="tagging-group">
            {selectedTags.map((tag, index) => (
              <TagElement
                key={index}
                categories={categories}
                groups={groups}
                keyword=""
                visibility={visibility}
                {...tag}
              />
            ))}
            <div className="tagging-search">
              <AutosizeInput
                ref={input => {
                  this.keyInput = input;
                }}
                name="keyword"
                value={keyword}
                onChange={this.handleChangeKeyword}
              />
            </div>
          </div>
          <div className="tagging-actions" ref={this.setActionsWrapperRef}>
            <div
              className="tagging-actions-toggle"
              onClick={this.handleToggleActions}
            >
              {[...Array(3)].map((_, i) => (
                <span className="round" key={i} />
              ))}
            </div>
            <div className="tagging-actions-menu">
              {toggleActions && displayActionsDropdown()}
            </div>
          </div>
        </div>
        {toggleTagging && displayTaggingDropdown()}
      </div>
    );
  }
}

export { CategorizedTagging };
