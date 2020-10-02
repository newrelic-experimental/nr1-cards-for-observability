import React from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';

export default class Buttons extends React.Component {
  static propTypes = {
    buttons: PropTypes.array,
  };

  onClick = fn => {
    if (fn) fn();
  };

  render() {
    const { buttons } = this.props;

    return (
      <div className="buttons">
        {buttons && buttons.length
          ? buttons.map((button, b) => (
              <button
                key={b}
                className="u-unstyledButton button"
                onClick={button.onClick}
              >
                <div className="icon">
                  <Icon type={button.icon} />
                </div>
                <span>{button.text}</span>
              </button>
            ))
          : null}
      </div>
    );
  }
}
