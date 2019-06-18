import React, { Component } from 'react';
import { EntryTagging, NodeTagging } from '../components';

import './App.scss';

class App extends Component {
  state = {
    entryTags: []
  };

  handleInitTags = tags => {
    this.setState({
      entryTags: [...this.state.entryTags, ...tags]
    });
  };

  handleAddEntryTag = newTag => {
    this.setState({
      entryTags: this.state.entryTags.concat(newTag)
    });
  };

  render() {
    const { entryTags } = this.state;

    return (
      <div className="app-wrapper">
        <div className="app">
          <div className="app-header">
            <EntryTagging tags={entryTags} onAddTag={this.handleAddEntryTag} />
          </div>
          <div className="app-content">
            <div className="tagging-wrapper">
              <NodeTagging
                onFetchTags={this.handleInitTags}
                onAddTag={this.handleAddEntryTag}
              />
            </div>
            <div className="tagging-wrapper">
              <NodeTagging
                onFetchTags={this.handleInitTags}
                onAddTag={this.handleAddEntryTag}
              />
            </div>
            <div className="tagging-wrapper">
              <NodeTagging
                onFetchTags={this.handleInitTags}
                onAddTag={this.handleAddEntryTag}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
