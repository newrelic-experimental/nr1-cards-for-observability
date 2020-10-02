import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../../library/components/icon';
import DashboardSettings from '../../library/components/dashboard-settings';
import DashboardDuplicate from '../../library/components/dashboard-duplicate';

export default class DashboardOptions extends React.Component {
  static propTypes = {
    accountId: PropTypes.number,
    dashboard: PropTypes.object,
    data: PropTypes.object,
    user: PropTypes.object,
    onUpdate: PropTypes.func,
    onAuth: PropTypes.func,
    onCopy: PropTypes.func,
  };

  state = {
    currentTab: 0,
  };

  switchTab = async (e, id) => {
    e.preventDefault();

    this.setState({ currentTab: id });
  };

  render() {
    const { currentTab } = this.state;
    const {
      accountId,
      dashboard,
      data,
      user,
      onUpdate,
      onAuth,
      onCopy,
    } = this.props;

    const tabs = ['Settings', 'Duplicate'];

    return (
      <div className="dashboard-options">
        <div className="tabs">
          <ul className="tabs-links">
            {tabs.map((tab, t) => (
              <li key={t} className={currentTab === t ? 'active' : ''}>
                <a
                  href="#"
                  className="u-unstyledLink"
                  onClick={e => this.switchTab(e, t)}
                >
                  {tab}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="tabs-content">
          <div className={`${currentTab === 0 ? 'show' : ''}`}>
            {accountId ? (
              <DashboardSettings
                accountId={accountId}
                dashboard={dashboard}
                onUpdate={onUpdate}
                onAuth={onAuth}
              />
            ) : (
              <div className="empty-state">
                <Icon type="copy" size="large" />
                <span className="copy">
                  Duplicate this dashboard to modify.
                </span>
              </div>
            )}
          </div>
          <div className={`${currentTab === 1 ? 'show' : ''}`}>
            <DashboardDuplicate
              accountId={accountId}
              dashboard={dashboard}
              data={data}
              user={user}
              onCopy={onCopy}
            />
          </div>
        </div>
      </div>
    );
  }
}
