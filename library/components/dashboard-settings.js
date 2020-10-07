import React from 'react';
import PropTypes from 'prop-types';

import Buttons from './buttons';
import LayoutPicker from './layout-picker';

import { encoded, refreshRange } from '../utils/helper';
import { getDashboards, setDashboards } from '../utils/data';

export default class DashboardSettings extends React.Component {
  static propTypes = {
    accountId: PropTypes.number,
    dashboard: PropTypes.object,
    onUpdate: PropTypes.func,
    onAuth: PropTypes.func
  };

  state = {
    dashboard: this.props.dashboard
  };

  saveDashboard = async () => {
    const { accountId, onUpdate } = this.props;
    const { dashboard } = this.state;

    if ('protect' in dashboard && dashboard.protect) {
      if ('password' in dashboard && dashboard.password.trim() !== '') {
        dashboard.encodedPassword = await encoded(dashboard.password.trim()); // eslint-disable-line require-atomic-updates
      }
    } else {
      delete dashboard.protect;
      delete dashboard.encodedPassword;
    }

    delete dashboard.password;

    const dashboards = await getDashboards(accountId);

    if (dashboards) {
      const index = dashboards.findIndex(board => board.id === dashboard.id);
      dashboards[index] = dashboard;
      setDashboards(accountId, dashboards);

      if (onUpdate) onUpdate(dashboard);

      this.setState({ dashboard });
    }
  };

  runAuth = async () => {
    const { dashboard, authPass } = this.state;

    if (!authPass || authPass.trim() === '') {
      this.setState({ shakeAuth: true });
    } else {
      const encodedPassword = await encoded(authPass);
      if (encodedPassword === dashboard.encodedPassword) {
        this.setState({ authPass: '', authenticated: true }, () => {
          const { onAuth } = this.props;
          if (onAuth) onAuth();
        });
      } else {
        this.setState({ shakeAuth: true });
      }
    }
  };

  textUpdate = (e, type) => {
    const { dashboard } = this.state;

    dashboard[type] = e.target.value;
    this.setState({ dashboard });
  };

  toggle = (e, type) => {
    const { dashboard } = this.state;

    dashboard[type] = e.target.checked;
    this.setState({ dashboard });
  };

  rangeUpdate = (e, type) => {
    const { dashboard } = this.state;

    const val = e.target.value;

    dashboard[type] = type === 'refresh' ? refreshRange(val, 'v2r') : val;
    this.setState({ dashboard });
  };

  onEnterKey = (e, fn) => {
    if (e.keyCode === 13) fn();
  };

  layoutChange = layout => {
    const { dashboard } = this.state;

    dashboard.layout = layout;
    this.setState({ dashboard });
  };

  render() {
    const { dashboard, authPass, shakeAuth, authenticated } = this.state;

    const rangeValueText = val => {
      if (val === 0) return 'manual';
      return val < 60 ? `${val}s` : `${val / 60}m`;
    };

    return 'protect' in dashboard &&
      dashboard.protect &&
      dashboard.encodedPassword &&
      !authenticated ? (
      <div className="dashboard-settings-auth">
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            className={`u-unstyledInput ${shakeAuth ? 'shake-x' : ''}`}
            value={authPass || ''}
            onChange={e => this.setState({ authPass: e.target.value })}
            onAnimationEnd={() => this.setState({ shakeAuth: false })}
            onKeyDown={e => this.onEnterKey(e, this.runAuth)}
          />
        </div>
        <div className="settings-buttons">
          <Buttons
            buttons={[
              { text: 'Authenticate', icon: 'lock', onClick: this.runAuth }
            ]}
          />
        </div>
      </div>
    ) : (
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
          <label>Refresh Interval</label>
          <input
            className="u-unstyledInput slider"
            type="range"
            min="0"
            max="4"
            value={refreshRange(dashboard.refresh || 0, 'r2v') || 0}
            onChange={e => this.rangeUpdate(e, 'refresh')}
          />
          <span className="range-value">
            {rangeValueText(dashboard.refresh || 0)}
          </span>
        </div>
        <div className="form-field">
          <label>Layout</label>
          <LayoutPicker
            layout={dashboard.layout}
            onChange={this.layoutChange}
          />
        </div>
        <div className="form-field">
          <label>Password Protect</label>
          <input
            className="toggle toggle-flat"
            id="password-protect"
            type="checkbox"
            checked={dashboard.protect || false}
            onChange={e => this.toggle(e, 'protect')}
          />
          <label className="toggle-button" htmlFor="password-protect" />
        </div>
        {'protect' in dashboard && dashboard.protect ? (
          <div className="form-field">
            <label>Password</label>
            <input
              className="u-unstyledInput"
              value={dashboard.password || ''}
              onChange={e => this.textUpdate(e, 'password')}
            />
          </div>
        ) : null}

        <div className="settings-buttons">
          <Buttons
            buttons={[
              { text: 'Save', icon: 'upstream', onClick: this.saveDashboard }
            ]}
          />
        </div>
      </div>
    );
  }
}
