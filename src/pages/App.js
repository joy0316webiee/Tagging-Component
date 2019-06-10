import React, { Component } from 'react';
import { CategorizedTagging } from '../components';

import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="app">
          <div className="app-header">
            <h1 className="title">react-categorized-tag-input</h1>
            <p className="desc">
              React.js component for making tag autocompletion inputs with
              categorized results with no dependencies and 10KB minified.
            </p>
            <p className="hint">Go ahead, type "a".</p>
          </div>
          <div className="app-content">
            <CategorizedTagging />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
