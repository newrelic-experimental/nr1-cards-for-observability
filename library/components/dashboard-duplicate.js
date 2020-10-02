import React from 'react';
import PropTypes from 'prop-types';

import { AccountPicker } from 'nr1';

import Buttons from './buttons';

import uuid from '../utils/uuid';
import {
  getDashboards,
  setDashboards,
  setDashboard,
  dashboardObject,
} from '../utils/data';

export default class DashboardDuplicate extends React.Component {
  static propTypes = {
    accountId: PropTypes.number,
    dashboard: PropTypes.object,
    data: PropTypes.object,
    user: PropTypes.object,
    onCopy: PropTypes.func,
  };

  state = {
    accountId: this.props.accountId,
    dashboard: this.props.dashboard,
  };

  dupeDashboard = async () => {
    const { accountId, dashboard } = this.state;
    const { data, user, onCopy } = this.props;

    const dashboards = await getDashboards(accountId);

    const { id: source } = dashboard;
    const newId = uuid.generate();
    const newDashboard = dashboardObject({
      ...dashboard,
      ...{
        id: newId,
        created: { user, timestamp: Date.now() },
        source: source,
      },
    });

    dashboards.push(newDashboard);
    const addMeta = await setDashboards(accountId, dashboards);
    const addData = await setDashboard(accountId, newId, data);
    if (onCopy) onCopy(accountId, newDashboard);
  };

  textUpdate = (e, type) => {
    const { dashboard } = this.state;

    dashboard[type] = e.target.value;
    this.setState({ dashboard });
  };

  changeAccount = async (e, val) => this.setState({ accountId: val });

  render() {
    const { accountId, dashboard } = this.state;

    return (
      <div className="dashboard-settings-container">
        <div className="form-field">
          <label>Name</label>
          <input
            className="u-unstyledInput"
            value={dashboard.name || ''}
            onChange={e => this.textUpdate(e, 'name')}
          />
        </div>
        <div className="form-field">
          <label>In</label>
          <AccountPicker value={accountId} onChange={this.changeAccount} />
        </div>
        <div className="settings-buttons">
          <Buttons
            buttons={[
              { text: 'Duplicate', icon: 'copy', onClick: this.dupeDashboard },
            ]}
          />
        </div>
      </div>
    );
  }
}
