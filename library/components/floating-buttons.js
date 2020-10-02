import React from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';

export default class FloatingButtons extends React.Component {
  static propTypes = {
    clicked: PropTypes.func,
  };

  onClick = (e, type) => {
    e.preventDefault();

    const { clicked } = this.props;
    if (clicked) clicked(type);
  };

  render() {
    return (
      <>
        <a
          href="#"
          className="u-unstyledLink main-btn"
          onClick={e => this.onClick(e, 'main')}
        >
          <Icon type="more" size="large" color="white" />
        </a>
        <ul className="sub-buttons">
          <li>
            <a
              href="#"
              className="u-unstyledLink sub-btn"
              onClick={e => this.onClick(e, 'scripts')}
              data-title="Scripts"
            >
              <Icon type="plugin" size="large" color="white" />
            </a>
          </li>
          <li>
            <a
              href="#"
              className="u-unstyledLink sub-btn"
              onClick={e => this.onClick(e, 'queries')}
              data-title="Queries"
            >
              <Icon type="query" size="large" color="white" />
            </a>
          </li>
          <li>
            <a
              href="#"
              className="u-unstyledLink sub-btn"
              onClick={e => this.onClick(e, 'cards')}
              data-title="Cards"
            >
              <Icon type="controlCenter" size="large" color="white" />
            </a>
          </li>
        </ul>
      </>
    );
  }
}
