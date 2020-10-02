import React from 'react';
import PropTypes from 'prop-types';

import DashboardBrowser from './dashboard-browser';
import DashboardGallery from './dashboard-gallery';
import DashboardFavorites from './dashboard-favorites';

import { getUrl, getFavorites } from '../utils/data';

export default class DashboardPicker extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    onPick: PropTypes.func,
  };

  state = {
    currentTab: 0,
  };

  switchTab = async (e, id) => {
    e.preventDefault();
    let favorites, gallery;

    if (id === 1) favorites = await this.loadFavorites();
    if (id === 2) gallery = await this.loadGallery();
    this.setState({ currentTab: id, favorites, gallery });
  };

  loadFavorites = async () => {
    const favorites = await getFavorites();
    return favorites;
  };

  loadGallery = async () => {
    const resp = await getUrl('gallery.json', 'json');
    return 'gallery' in resp && resp.gallery.length ? resp.gallery : [];
  };

  render() {
    const { currentTab, favorites, gallery } = this.state;
    const { user, onPick } = this.props;

    const tabs = ['Browse', 'Favorites', 'Gallery'];

    return (
      <div className="data-entry-modal dashboard-picker">
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
            <DashboardBrowser user={user} onPick={onPick} />
          </div>
          <div className={`${currentTab === 1 ? 'show' : ''}`}>
            <DashboardFavorites favorites={favorites} onPick={onPick} />
          </div>
          <div className={`${currentTab === 2 ? 'show' : ''}`}>
            <DashboardGallery gallery={gallery} onPick={onPick} />
          </div>
        </div>
      </div>
    );
  }
}
