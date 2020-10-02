import React from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';
import Switch from './switch';
import Buttons from './buttons';
import EditorListing from './editor-listing';

import { nextIndex } from '../utils/helper';

export default class ScriptsEditor extends React.Component {
  static propTypes = {
    scripts: PropTypes.array,
    accountId: PropTypes.number,
    onSave: PropTypes.func,
  };

  state = {
    scripts: this.props.scripts,
    selectedScriptIndex: -1,
  };

  addScript = () => {
    const { scripts = [] } = this.state;

    const scriptName = `script${nextIndex(scripts)}`;

    scripts.push({
      name: scriptName,
      url: '',
      script: '',
    });

    this.setState({ scripts });
  };

  saveScripts = () => {
    const { scripts } = this.state;
    const { onSave } = this.props;

    if (onSave) onSave(scripts);
  };

  scriptClicked = index =>
    this.setState({
      selectedScriptIndex: index,
    });

  deleteScript = index => {
    const { scripts } = this.state;
    scripts.splice(index, 1);

    this.setState({ scripts });
  };

  updateTextarea = (e, type) => {
    const { scripts, selectedScriptIndex } = this.state;

    scripts[selectedScriptIndex][type] = e.target.value;
    this.setState({ scripts });
  };

  render() {
    const { scripts, selectedScriptIndex } = this.state;
    const { accountId } = this.props;

    const buttons = accountId
      ? [
          { text: 'Add Script', icon: 'plus', onClick: this.addScript },
          { text: 'Save Scripts', icon: 'upstream', onClick: this.saveScripts },
        ]
      : [];

    const selectedScript =
      selectedScriptIndex > -1 ? scripts[selectedScriptIndex] : null;

    return (
      <div className="scripts-editor-container">
        <EditorListing
          items={scripts}
          buttons={buttons}
          editable={!!accountId}
          onSelect={this.scriptClicked}
          onDelete={this.deleteScript}
        />
        {selectedScript ? (
          <div className="editor">
            <div className="content">
              <div className="settings form-field">
                <label>URL</label>
                <input
                  className="u-unstyledInput stretch"
                  value={selectedScript.url || ''}
                  onChange={e => this.updateTextarea(e, 'url')}
                />
              </div>
              <textarea
                className="u-unstyledInput editor-textarea"
                value={selectedScript.script}
                onChange={e => this.updateTextarea(e, 'script')}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
