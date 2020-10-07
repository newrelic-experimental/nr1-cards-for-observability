import React from 'react';
import PropTypes from 'prop-types';

import Icon from './icon';

export default class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    noClose: PropTypes.bool,
    onClose: PropTypes.func
  };

  state = {
    enterAnim: false,
    exitAnim: false
  };

  componentDidMount() {
    this.setState({
      enterAnim: true,
      exitAnim: false
    });
  }

  closeHandler = () => {
    this.setState({
      enterAnim: false,
      exitAnim: true
    });
  };

  doneAnim = e => {
    if (e.animationName === 'zoom-out-modal') {
      const { onClose } = this.props;
      if (onClose) onClose();
    }
  };

  render() {
    const { children, style, noClose } = this.props;
    const { enterAnim, exitAnim } = this.state;

    let modalClassList = 'modal-window';
    if (enterAnim) modalClassList += ' zoom-in-modal';
    if (exitAnim) modalClassList += ' zoom-out-modal';

    return (
      <>
        <div className="modal-overlay" />
        <div
          className={modalClassList}
          style={style}
          onAnimationEnd={this.doneAnim}
        >
          {!noClose ? (
            <button
              type="button"
              className="close-button"
              onClick={this.closeHandler}
            >
              <Icon type="times" color="white" />
            </button>
          ) : null}
          <div className="modal-content">{children}</div>
        </div>
      </>
    );
  }
}
