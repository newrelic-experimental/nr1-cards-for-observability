import React from 'react';
import PropTypes from 'prop-types';

export default class LayoutPicker extends React.Component {
  static propTypes = {
    layout: PropTypes.string,
    onChange: PropTypes.func
  };

  state = {
    layout: this.props.layout
  };

  onClick = e => {
    const { onChange } = this.props;

    const layout = e.target.value;
    this.setState({ layout: layout }, () =>
      onChange ? onChange(layout) : null
    );
  };

  svg = type => {
    let g;
    if (type === 'fluid')
      g = (
        <path d="M4 4h4v4H4zM9 5h4v4H9zM14 4h4v4h-4zM5 9h4v4H5zM12 10h4v4h-4zM7 14h4v4H7zM14 15h4v4h-4z" />
      );
    if (type === 'grid')
      g = (
        <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" />
      );
    if (type === 'flex')
      g = (
        <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM4 16h4v4H4z" />
      );
    return (
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <g>{g}</g>
      </svg>
    );
  };

  render() {
    const { layout } = this.state;

    const layouts = ['fluid', 'grid', 'flex'];

    return (
      <div className="layout-picker">
        {layouts.map(lo => (
          <div className="option" key={lo}>
            <input
              type="radio"
              name="layout"
              id={`${lo}layout`}
              value={lo}
              checked={lo === layout}
              onChange={this.onClick}
            />
            <label className="label" htmlFor={`${lo}layout`}>
              {this.svg(lo)}
              <span>{lo}</span>
            </label>
          </div>
        ))}
      </div>
    );
  }
}
