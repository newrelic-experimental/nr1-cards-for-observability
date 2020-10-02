import React from 'react';
import PropTypes from 'prop-types';

export default class DashboardBrowser extends React.Component {
  static propTypes = {
    gallery: PropTypes.array,
    onPick: PropTypes.func,
  };

  state = {};

  openDashboard = index => {
    const { gallery, onPick } = this.props;

    if (onPick) onPick(0, gallery[index]);
  };

  render() {
    const { gallery } = this.props;

    return (
      <div>
        <div className="dashboard-list">
          {gallery &&
            gallery.map((g, i) => (
              <div
                key={i}
                className="item"
                onClick={e => this.openDashboard(i)}
              >
                <span className="name">{g.name}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
