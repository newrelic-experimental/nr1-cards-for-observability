import React from 'react';
import PropTypes from 'prop-types';

export default class Icon extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    size: PropTypes.oneOf(['', 'large']),
    color: PropTypes.string
  };

  static defaultProps = {
    size: ''
  };

  icons = {
    plus: <path d="M14 7H8V1H7v6H1v1h6v6h1V8h6z" />,
    times: (
      <path d="M13.4 2.4l-.8-.8-5.1 5.2-5.1-5.2-.8.8 5.2 5.1-5.2 5.1.8.8 5.1-5.2 5.1 5.2.8-.8-5.2-5.1z" />
    ),
    chevronDown: <path d="M12.6 4.6L7.5 9.8 2.4 4.6l-.8.8 5.9 5.8 5.9-5.8z" />,
    chevronUp: <path d="M7.5 3.8L1.6 9.6l.8.8 5.1-5.2 5.1 5.2.8-.8z" />,
    check: <path d="M14.6 2.6L6 11.3 2.4 7.6l-.8.8L6 12.7l9.4-9.3z" />,
    query: (
      <>
        <path d="M4.4 12.4l2.8-2.9-2.8-2.9-.8.8 2.2 2.1-2.2 2.1z" />
        <path d="M13 1H2C.9 1 0 1.9 0 3v10c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm1 12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5h13v8zm0-9H1V3c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v1z" />
        <path d="M8 11h4v1H8z" />
      </>
    ),
    controlCenter: (
      <>
        <path d="M13 1H2C.9 1 0 1.9 0 3v10c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm1 12c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V3c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v10z" />
        <path d="M7.5 3C5.6 3 4 4.6 4 6.5S5.6 10 7.5 10 11 8.4 11 6.5 9.4 3 7.5 3zM5 6.5c0-1.2.9-2.2 2-2.4v2.2L5.4 7.9C5.2 7.5 5 7 5 6.5zM7.5 9c-.5 0-1-.2-1.4-.4L8 6.7V4.1c1.1.2 2 1.2 2 2.4C10 7.9 8.9 9 7.5 9zM6 12h3v1H6zM2 12h3v1H2zM10 12h3v1h-3z" />
      </>
    ),
    show: (
      <>
        <path d="M8 2C2.3 2 0 8 0 8s2.3 6 8 6 8-6 8-6-2.3-6-8-6zm0 11c-4.2 0-6.3-3.8-6.9-5 .2-.5.7-1.5 1.6-2.4C4.2 3.9 6 3 8 3c4.2 0 6.3 3.8 6.9 5-.6 1.2-2.7 5-6.9 5z" />
        <path d="M8 5C6.3 5 5 6.3 5 8s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </>
    ),
    upstream: (
      <>
        <path d="M14 7.2V7c0-2.8-2.2-5-5-5-2.1 0-3.8 1.3-4.6 3H4C1.8 5 0 6.8 0 9s1.8 4 4 4h2v-1H4c-1.7 0-3-1.3-3-3s1.3-3 3-3c.5 0 1 .1 1 .1l.3-.7C6 4 7.4 3 9 3c2.2 0 4 1.8 4 4v.9l.7.2c.8.3 1.3 1 1.3 1.9 0 1.1-.9 2-2 2h-2v1h2c1.7 0 3-1.3 3-3 0-1.3-.8-2.4-2-2.8z" />
        <path d="M8.5 6.8L5.6 9.6l.8.8L8 8.7V16h1V8.7l1.6 1.7.8-.8z" />
      </>
    ),
    trash: (
      <>
        <path d="M11 2V0H5v2H2v1h1v12h10V3h1V2h-3zM6 1h4v1H6V1zm6 13H4V3h8v11z" />
        <path d="M6 5h1v7H6zM9 5h1v7H9z" />
      </>
    ),
    plugin: (
      <path d="M13 3V1H9v2H6V1H2v2H0v11h15V3h-2zm-3-1h2v1h-2V2zM3 2h2v1H3V2zm11 11H1V4h13v9z" />
    ),
    more: (
      <>
        <circle cx="4" cy="8" r="1" />
        <circle cx="8" cy="8" r="1" />
        <circle cx="12" cy="8" r="1" />
      </>
    ),
    help: (
      <>
        <path d="M7.5 0C3.4 0 0 3.4 0 7.5S3.4 15 7.5 15 15 11.6 15 7.5 11.6 0 7.5 0zm0 14C3.9 14 1 11.1 1 7.5S3.9 1 7.5 1 14 3.9 14 7.5 11.1 14 7.5 14z" />
        <path d="M7 11h1v1H7zM7.5 3C6.1 3 5 4.1 5 5.5V6h1v-.5C6 4.7 6.7 4 7.5 4S9 4.7 9 5.5s-.4 1-.9 1.3c-.4.3-1.1.7-1.1 1.7V10h1V8.5c0-.4.2-.5.7-.8.5-.4 1.3-.8 1.3-2.2C10 4.1 8.9 3 7.5 3z" />
      </>
    ),
    info: (
      <>
        <path d="M7 4h1v1H7z" />
        <path d="M7.5 0C3.4 0 0 3.4 0 7.5S3.4 15 7.5 15 15 11.6 15 7.5 11.6 0 7.5 0zm0 14C3.9 14 1 11.1 1 7.5S3.9 1 7.5 1 14 3.9 14 7.5 11.1 14 7.5 14z" />
        <path d="M7 6h1v5H7z" />
      </>
    ),
    lock: (
      <path d="M12 6V4c0-2.2-1.8-4-4-4S4 1.8 4 4v2H1v9h14V6h-3zM5 4c0-1.7 1.3-3 3-3s3 1.3 3 3v2H5V4zm9 10H2V7h12v7z" />
    ),
    star: (
      <path d="M16 6H9.9L8 0 6.1 6H0l4.9 3.8L3 16l5-3.8 5 3.8-1.9-6.2L16 6zm-4.9 7.3L8 10.9l-3.1 2.4 1.2-3.8L2.9 7h3.9L8 3.4 9.1 7H13L9.9 9.4l1.2 3.9z" />
    ),
    starFilled: (
      <path
        d="M16 6H9.9L8 0 6.1 6H0l4.9 3.8L3 16l5-3.8 5 3.8-1.9-6.2z"
        fillRule="evenodd"
      />
    ),
    copy: (
      <>
        <path d="M8.7 0H5v13h9V5.3L8.7 0zM9 1.7L12.3 5H9V1.7zM13 12H6V1h2v5h5v6z" />
        <path d="M2 4h1V3H1v13h8v-1H2z" />
      </>
    )
  };

  render() {
    const { type, size, color } = this.props;

    return type && type in this.icons ? (
      <span className={`icon ${size}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          focusable="false"
          style={color ? { fill: color } : null}
        >
          {this.icons[type]}
        </svg>
      </span>
    ) : null;
  }
}
