import React from 'react';
import PropTypes from 'prop-types';

import template from '../utils/template';

export default class Card extends React.Component {
  static propTypes = {
    card: PropTypes.object,
    data: PropTypes.object,
    layout: PropTypes.string,
    index: PropTypes.number
  };

  state = {
    left:
      'left' in this.props.card
        ? this.props.card.left
        : (this.props.index + 1) * 50,
    top:
      'top' in this.props.card
        ? this.props.card.top
        : (this.props.index + 1) * 50,
    z: 'z' in this.props.card ? this.props.card.z : 900 - this.props.index,
    offsetX: 0,
    offsetY: 0
  };

  dragStart = e => {
    const { left, top } = this.state;
    this.setState({
      offsetX: e.clientX - left,
      offsetY: e.clientY - top
    });
  };

  dragEnd = () =>
    this.setState({
      offsetX: 0,
      offsetY: 0
    });

  drag = e => {
    const { offsetX, offsetY } = this.state;
    if (e.clientX && e.clientY)
      this.setState({
        left: e.clientX - offsetX,
        top: e.clientY - offsetY
      });
  };

  render() {
    const { card, data, layout, index } = this.props;
    const { top, left, z } = this.state;

    let cardArray = null;

    if ('query' in card && card.query) {
      const { query, ...querylessCard } = card;

      if (card.query in data && data[card.query].length)
        cardArray = data[card.query].map((res, r) => (
          <Card
            key={r}
            card={querylessCard}
            data={{ ...data, __iterationData: res, __index: r }}
            layout={layout}
            index={r}
          />
        ));
    }

    const cardIteration = '__index' in data ? `idx${data.__index}` : '';

    return 'query' in card && card.query ? (
      <>{cardArray}</>
    ) : (
      <>
        {'style' in card && !('__index' in data && data.__index !== 0) ? (
          <style>{template.compile(card.style, data, card.name)}</style>
        ) : null}
        <div
          draggable={layout === 'fluid'}
          onDrag={layout === 'fluid' ? this.drag : null}
          onDragStart={layout === 'fluid' ? this.dragStart : null}
          onDragEnd={layout === 'fluid' ? this.dragEnd : null}
          className={`card ${card.name} ${cardIteration}`}
          style={
            layout === 'fluid'
              ? { left: `${left}px`, top: `${top}px`, zIndex: z }
              : {}
          }
          dangerouslySetInnerHTML={{
            __html: template.compile(
              card.code,
              { ...data, __index: index },
              card.name
            )
          }}
        />
      </>
    );
  }
}
