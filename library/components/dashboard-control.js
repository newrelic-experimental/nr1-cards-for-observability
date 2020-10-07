import React from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';

export default class DashboardControl extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    fetching: PropTypes.bool,
    onClick: PropTypes.func
  };

  clickHandler = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const { onClick } = this.props;
    if (onClick) onClick(type);
  };

  render() {
    const { name, fetching } = this.props;

    return (
      <div className="dashboard-control">
        <a
          className="u-unstyledLink name bold"
          onClick={e => this.clickHandler(e, 'help')}
        >
          ?
        </a>
        <span className="name" onClick={e => this.clickHandler(e, 'settings')}>
          {name}
        </span>
        <a
          href="#"
          className="u-unstyledLink"
          onClick={e => this.clickHandler(e, 'closeDashboard')}
        >
          <Icon type="times" />
        </a>
        <span className={`${fetching ? 'spinner' : ''}`} />
      </div>
    );
  }
}
