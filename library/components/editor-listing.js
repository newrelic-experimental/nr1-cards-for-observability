import React from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';
import Buttons from './buttons';

export default class EditorListing extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    buttons: PropTypes.array,
    editable: PropTypes.bool,
    onSelect: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    onDelete: PropTypes.func // eslint-disable-line react/no-unused-prop-types
  };

  state = {
    selectedIndex: -1
  };

  onClick = (e, type, index) => {
    e.preventDefault();

    if (type in this.props) this.props[type](index);
    this.setState({ selectedIndex: index });
  };

  render() {
    const { items, buttons, editable } = this.props;
    const { selectedIndex } = this.state;

    return (
      <div className="editor-listing">
        <Buttons buttons={buttons} />
        <ul>
          {items && items.length
            ? items.map((item, i) => (
                <li key={i} className={i === selectedIndex ? 'current' : ''}>
                  <a
                    href="#"
                    className="u-unstyledLink"
                    onClick={e => this.onClick(e, 'onSelect', i)}
                  >
                    {item.name}
                  </a>
                  {editable ? (
                    <a
                      href="#"
                      className="u-unstyledLink del"
                      onClick={e => this.onClick(e, 'onDelete', i)}
                    >
                      <Icon type="trash" />
                    </a>
                  ) : null}
                </li>
              ))
            : null}
        </ul>
      </div>
    );
  }
}
