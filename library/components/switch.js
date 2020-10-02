import React from 'react';
import PropTypes from 'prop-types';

export default class Switch extends React.Component {
  static propTypes = {
    options: PropTypes.array,
    selected: PropTypes.string,
    onSelect: PropTypes.func,
  };

  onChange = e => {
    const { onSelect } = this.props;

    if (onSelect) onSelect(e.target.value);
  };

  render() {
    const { options, selected } = this.props;

    return (
      <div className="switch">
        {options && options.length
          ? options.map((option, o) => (
              <label key={o}>
                <input
                  type="radio"
                  value={option.value}
                  checked={selected === option.value}
                  onChange={this.onChange}
                />
                <span>{option.name}</span>
              </label>
            ))
          : null}
      </div>
    );
  }
}
