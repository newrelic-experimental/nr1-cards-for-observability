import React from 'react';
import PropTypes from 'prop-types';

import { AccountPicker } from 'nr1';

import uuid from '../utils/uuid';
import Icon from './icon';

import { nextIndex } from '../utils/helper';
import {
  getDashboards,
  setDashboards,
  getFavorites,
  setFavotites,
  getSettings,
  setSettings,
  dashboardObject,
} from '../utils/data';

export default class DashboardBrowser extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    onPick: PropTypes.func,
  };

  state = {
    accountId: null,
  };

  componentDidMount() {
    this.setup();
  }

  setup = async () => {
    const browseSettings = await getSettings('browse');
    if (browseSettings && 'lastAccountId' in browseSettings)
      this.setState({ accountId: browseSettings.lastAccountId }, () =>
        this.changeAccount(
          browseSettings.lastAccountId,
          browseSettings.lastAccountId
        )
      );
  };

  changeAccount = async (e, val) => {
    setSettings('browse', { lastAccountId: val });
    const dashboards = await getDashboards(val);
    const favorites = await getFavorites();
    const accountFavs = favorites.reduce(
      (acc, cur, idx) =>
        cur.accountId === val ? { ...acc, [cur.dashboard.id]: { idx } } : acc,
      {}
    );

    this.setState({ accountId: val, dashboards, favorites, accountFavs });
  };

  newDashboard = async () => {
    const { accountId, dashboards } = this.state;
    const { user, onPick } = this.props;

    const dashboard = dashboardObject({
      name: `untitled ${nextIndex(dashboards)}`,
      id: uuid.generate(),
      refresh: 30,
      created: {
        user,
        timestamp: Date.now(),
      },
    });

    dashboards.push(dashboard);
    setDashboards(accountId, dashboards);

    if (onPick) onPick(accountId, dashboard);
  };

  openDashboard = index => {
    const { accountId, dashboards } = this.state;
    const { onPick } = this.props;

    if (onPick) onPick(accountId, dashboards[index]);
  };

  favoriteDashboard = async (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const { accountId, dashboards, favorites, accountFavs } = this.state;
    const favorite = {
      accountId,
      dashboard: dashboards[index],
    };

    favorites.push(favorite);
    accountFavs[dashboards[index].id] = { idx: favorites.length - 1 };
    setFavotites(favorites);
    this.setState({ favorites, accountFavs });
  };

  deleteDashboard = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const { accountId, dashboards, favorites, accountFavs } = this.state;
    if (dashboards[index].id in accountFavs)
      this.removeFavorite(null, dashboards[index].id);
    dashboards.splice(index, 1);

    setDashboards(accountId, dashboards);
    this.setState({ dashboards });
  };

  removeFavorite = (e, id) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }

    const { favorites, accountFavs, accountId } = this.state;
    favorites.splice(accountFavs[id].idx, 1);
    const updatedAccountFavs = favorites.reduce(
      (acc, cur, idx) =>
        cur.accountId === accountId
          ? { ...acc, [cur.dashboard.id]: { idx } }
          : acc,
      {}
    );

    setFavotites(favorites);
    this.setState({ favorites, accountFavs: updatedAccountFavs });
  };

  render() {
    const { accountId, dashboards, accountFavs } = this.state;

    return (
      <div>
        <div className="account-picker">
          <AccountPicker value={accountId} onChange={this.changeAccount} />
        </div>
        {accountId && (
          <div className="dashboard-list">
            <div className="item" onClick={this.newDashboard}>
              <Icon type="plus" size="large" />
            </div>
            {dashboards &&
              dashboards.map((d, i) => (
                <div
                  key={i}
                  className="item"
                  onClick={e => this.openDashboard(i)}
                >
                  <span className="name">{d.name}</span>
                  <div className="control-bar">
                    <a
                      href="#"
                      className={`u-unstyledLink fav ${
                        d.id in accountFavs ? 'mark' : ''
                      }`}
                      onClick={e =>
                        d.id in accountFavs
                          ? this.removeFavorite(e, d.id)
                          : this.favoriteDashboard(e, i)
                      }
                    >
                      <Icon
                        type={d.id in accountFavs ? 'starFilled' : 'star'}
                      />
                    </a>
                    {!('protect' in d && d.protect) ? (
                      <a
                        href="#"
                        className="u-unstyledLink del"
                        onClick={e => this.deleteDashboard(e, i)}
                      >
                        <Icon type="trash" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
}
