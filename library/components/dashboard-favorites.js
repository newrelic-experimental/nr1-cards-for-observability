import React from 'react';
import PropTypes from 'prop-types';

export default class DashboardFavorites extends React.Component {
  static propTypes = {
    favorites: PropTypes.array,
    onPick: PropTypes.func
  };

  state = {};

  openDashboard = index => {
    const { favorites, onPick } = this.props;
    const { accountId, dashboard } = favorites[index];
    if (onPick) onPick(accountId, dashboard);
  };

  render() {
    const { favorites } = this.props;

    return (
      <div>
        <div className="dashboard-list">
          {favorites &&
            favorites.map((f, i) => (
              <div
                key={i}
                className="item"
                onClick={() => this.openDashboard(i)}
              >
                <span className="name">{f.dashboard.name}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
