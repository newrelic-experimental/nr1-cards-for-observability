import React from 'react';
import PropTypes from 'prop-types';

import { AccountPicker } from 'nr1';

import Icon from './icon';
import Switch from './switch';
import Buttons from './buttons';
import EditorListing from './editor-listing';

import { nextIndex } from '../utils/helper';

export default class QueriesEditor extends React.Component {
  static propTypes = {
    queries: PropTypes.array,
    accountId: PropTypes.number,
    onSave: PropTypes.func
  };

  state = {
    queries: this.props.queries,
    selectedQueryIndex: -1
  };

  addQuery = () => {
    const { queries = [] } = this.state;
    const { accountId } = this.props;

    const queryName = `query${nextIndex(queries)}`;

    queries.push({
      name: queryName,
      flow: [
        {
          text: '',
          type: 'nrql',
          accountId
        }
      ],
      accountId
    });

    this.setState({ queries });
  };

  saveQueries = () => {
    const { queries } = this.state;
    const { onSave } = this.props;

    if (onSave) onSave(queries);
  };

  queryClicked = index =>
    this.setState({
      selectedQueryIndex: index
    });

  deleteQuery = index => {
    const { queries } = this.state;
    queries.splice(index, 1);

    this.setState({ queries });
  };

  updateTextarea = (e, index) => {
    const { queries, selectedQueryIndex } = this.state;

    queries[selectedQueryIndex].flow[index].text = e.target.value;
    this.setState({ queries });
  };

  updateType = (type, index) => {
    const { queries, selectedQueryIndex } = this.state;

    queries[selectedQueryIndex].flow[index].type = type;
    this.setState({ queries });
  };

  updateAccount = (accountId, index) => {
    const { queries, selectedQueryIndex } = this.state;

    queries[selectedQueryIndex].flow[index].accountId = accountId;
    this.setState({ queries });
  };

  addStep = () => {
    const { queries, selectedQueryIndex } = this.state;
    const { accountId } = this.props;

    queries[selectedQueryIndex].flow.push({
      text: '',
      type: 'nrql',
      accountId
    });
    this.setState({ queries });
  };

  deleteStep = (e, index) => {
    e.preventDefault();
    const { queries, selectedQueryIndex } = this.state;

    queries[selectedQueryIndex].flow.splice(index, 1);
    this.setState({ queries });
  };

  render() {
    const { queries, selectedQueryIndex } = this.state;
    const { accountId } = this.props;

    const buttons = accountId
      ? [
          { text: 'Add Query', icon: 'plus', onClick: this.addQuery },
          { text: 'Save Queries', icon: 'upstream', onClick: this.saveQueries }
        ]
      : [];

    const actionButtons = [
      { text: 'Add Step', icon: 'plus', onClick: this.addStep }
    ];

    const selectedQuery =
      selectedQueryIndex > -1 ? queries[selectedQueryIndex] : null;

    const types = [
      { name: 'NRQL', value: 'nrql' },
      { name: 'GraphQL', value: 'gql' },
      { name: 'Fetch', value: 'api' },
      { name: 'Parse', value: 'vars' },
      { name: 'Map', value: 'map' },
      { name: 'Reduce', value: 'reduce' }
    ];

    return (
      <div className="queries-editor-container">
        <EditorListing
          items={queries}
          buttons={buttons}
          editable={!!accountId}
          onSelect={this.queryClicked}
          onDelete={this.deleteQuery}
        />
        {selectedQuery ? (
          <div className="queries-flow">
            {selectedQuery.flow.map((queryFlow, f) => (
              <div className="query-editor" key={f}>
                <div className="flow-config">
                  <Switch
                    options={types}
                    selected={queryFlow.type || 'nrql'}
                    onSelect={type => this.updateType(type, f)}
                  />
                  <div className="flow-del">
                    <a
                      href="#"
                      className="u-unstyledLink del"
                      onClick={e => this.deleteStep(e, f)}
                    >
                      <Icon type="trash" />
                    </a>
                  </div>
                </div>
                <div className="query-entry">
                  <textarea
                    className={`u-unstyledInput editor-textarea ${
                      ['nrql', 'gql'].includes(queryFlow.type) ? 'wrap' : ''
                    }`}
                    value={queryFlow.text}
                    onChange={e => this.updateTextarea(e, f)}
                  />
                </div>
                {['nrql', 'gql'].includes(queryFlow.type) ? (
                  <div className="step-account-picker">
                    <Icon type="goto" />
                    <AccountPicker
                      value={queryFlow.accountId}
                      onChange={(e, accountId) =>
                        this.updateAccount(accountId, f)
                      }
                    />
                  </div>
                ) : null}
              </div>
            ))}
            <div className="query-actions">
              <Buttons buttons={actionButtons} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
