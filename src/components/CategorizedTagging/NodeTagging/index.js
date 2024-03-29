import React, { Component } from 'react';
import AutosizeInput from 'react-input-autosize';
import className from 'classnames';
import { TagElement, CheckBox, ModalBox } from '../Partials';

import { colors } from '../constants.json';
import { data } from '../dummy.json';
import './style.scss';

class NodeTagging extends Component {
  state = {
    categories: [],
    groups: [],
    tags: [],
    selectedTags: [],
    searchedTags: [],
    activeTag: null,
    visibility: {
      category: true,
      group: true,
      description: false
    },
    keyword: '',
    toggleTagging: false,
    toggleActions: false,
    showModal: false,
    editable: false,
    errors: [],
    modalErrors: [],
    loading: false
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
    this.setState(
      {
        ...data,
        errors: [],
        loading: false
      },
      () => {
        this.props.onFetchTags && this.props.onFetchTags(this.state.tags);
      }
    );
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

  updateToggleState = (ref, target, state) => {
    if (ref && !ref.contains(target)) {
      this.setState({ [state]: false });
    }
  };

  handleClickOutside = event => {
    // prettier-ignore
    this.updateToggleState(this.taggingWrapperRef, event.target, 'toggleTagging');
    // prettier-ignore
    this.updateToggleState(this.actionsWrapperRef, event.target, 'toggleActions');
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

  handleOpenCreateModal = (categoryId, name) => {
    this.setState({
      editable: false,
      activeTag: {
        categoryId,
        name
      },
      showModal: true,
      modalErrors: [],
      toggleTagging: false
    });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false
    });
  };

  replaceInArray = (arry, newItem) => {
    const editIndex = arry.findIndex(item => item.id === newItem.id);
    arry.splice(editIndex, 1, newItem);
    return arry;
  };

  handleSubmitTag = newTag => {
    let { editable, selectedTags, tags } = this.state;

    if (editable) {
      const updatedTags = selectedTags.reduce((acc, tag) => {
        if (tag.id === newTag.id) {
          acc.push(newTag);
        } else acc.push(tag);

        return acc;
      }, []);

      this.setState({
        showModal: false,
        selectedTags: updatedTags,
        tags: this.replaceInArray(tags, newTag),
        keyword: ''
      });
    } else {
      // prettier-ignore
      if (tags.findIndex(tag => tag.name === newTag.name && tag.categoryId === newTag.categoryId) < 0) {
        this.setState({
          showModal: false,
          tags: tags.concat(newTag),
          selectedTags: selectedTags.concat(newTag),
          keyword: ''
        });
        this.props.onAddTag(newTag);
      } else {
        this.setState({
          modalErrors: ['name'],
          keyword: ''
        });
      }
    }
    this.keyInput.focus();
  };

  handleTagAction = (index, action) => {
    let { selectedTags } = this.state;

    if (action === 'delete') {
      selectedTags.splice(index, 1);
      this.setState({ selectedTags });
    } else if (action === 'disable') {
      selectedTags[index].enabled = !selectedTags[index].enabled;
      this.setState({ selectedTags });
    } else if (action === 'edit') {
      this.setState({
        activeTag: selectedTags[index],
        editable: true,
        showModal: true,
        modalErrors: []
      });
    }
  };

  setTaggingWrapperRef = node => {
    this.taggingWrapperRef = node;
  };

  setActionsWrapperRef = node => {
    this.actionsWrapperRef = node;
  };

  getCategoryClass = category => {
    return colors.filter(color => color.id === category.colorId)[0].class;
  };

  render() {
    // prettier-ignore
    const { categories, groups, modalErrors, activeTag, selectedTags, searchedTags, toggleTagging, toggleActions, keyword, visibility, showModal, editable} = this.state;

    const displayTaggingDropdown = () => {
      let categoriedTags = categories.reduce((acc, category) => {
        const filteredTags = searchedTags.filter(tag => {
          return tag.categoryId === category.id;
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
                {item.tags.map((tag, index) => (
                  <TagElement
                    key={index}
                    categories={categories}
                    groups={groups}
                    keyword={keyword}
                    visibility={visibility}
                    handleClickSelf={() => this.handleClickTagElement(tag)}
                    {...tag}
                  />
                ))}
                <div className="tagging-create">
                  <button
                    onClick={() =>
                      this.handleOpenCreateModal(item.category.id, keyword)
                    }
                  >
                    {item.category.name} "{keyword}"
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
      <div className="node-tagging" ref={this.setTaggingWrapperRef}>
        <div className="tagging-box" onClick={this.handleClickTaggingBox}>
          <div className="tagging-group">
            {selectedTags.map((tag, index) => (
              <TagElement
                key={index}
                editable
                categories={categories}
                groups={groups}
                keyword=""
                visibility={visibility}
                {...tag}
                index={index}
                onAction={this.handleTagAction}
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
        <ModalBox
          isOpen={showModal}
          categories={categories}
          groups={groups}
          errors={modalErrors}
          tagInfo={activeTag}
          editable={editable}
          onSubmit={this.handleSubmitTag}
          handleCloseModal={this.handleCloseModal}
        />
      </div>
    );
  }
}

export { NodeTagging };
