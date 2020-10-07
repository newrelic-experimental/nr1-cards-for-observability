import React from 'react';
import PropTypes from 'prop-types';

import EditorListing from './editor-listing';

import { nextIndex } from '../utils/helper';

export default class CardsEditor extends React.Component {
  static propTypes = {
    cards: PropTypes.array,
    accountId: PropTypes.number,
    onSave: PropTypes.func
  };

  state = {
    cards: this.props.cards,
    selectedCardIndex: -1
  };

  addCard = () => {
    const { cards = [] } = this.state;

    const cardName = `card${nextIndex(cards)}`;
    let defaultStyles = `.card.${cardName} {`;
    defaultStyles += '\n  /* add styles for card here; for example';
    defaultStyles += '\n  background-color: red;\n  */\n}\n';
    defaultStyles += '\n/* add other styles below; for example\n';
    defaultStyles += `.${cardName} h1 {`;
    defaultStyles += '\n  color: red;\n}\n*/';

    cards.push({
      name: cardName,
      code: '',
      style: defaultStyles
    });

    this.setState({ cards });
  };

  saveCards = () => {
    const { cards } = this.state;
    const { onSave } = this.props;

    if (onSave) onSave(cards);
  };

  cardClicked = index =>
    this.setState({
      selectedCardIndex: index
    });

  deleteCard = index => {
    const { cards } = this.state;
    cards.splice(index, 1);

    this.setState({ cards });
  };

  updateTextarea = (e, type) => {
    const { cards, selectedCardIndex } = this.state;

    cards[selectedCardIndex][type] = e.target.value;
    this.setState({ cards });
  };

  render() {
    const { cards, selectedCardIndex } = this.state;
    const { accountId } = this.props;

    const buttons = accountId
      ? [
          { text: 'Add Card', icon: 'plus', onClick: this.addCard },
          { text: 'Save Cards', icon: 'upstream', onClick: this.saveCards }
        ]
      : [];

    const selectedCard =
      selectedCardIndex > -1 ? cards[selectedCardIndex] : null;

    return (
      <div className="cards-editor-container">
        <EditorListing
          items={cards}
          buttons={buttons}
          editable={!!accountId}
          onSelect={this.cardClicked}
          onDelete={this.deleteCard}
        />
        {selectedCard ? (
          <div className="editor">
            <div className="content">
              <div className="settings form-field">
                <label>For Query</label>
                <input
                  className="u-unstyledInput"
                  value={selectedCard.query || ''}
                  onChange={e => this.updateTextarea(e, 'query')}
                />
              </div>
              <textarea
                className="u-unstyledInput"
                value={selectedCard.code}
                onChange={e => this.updateTextarea(e, 'code')}
              />
            </div>
            <div className="styles">
              <textarea
                className="u-unstyledInput"
                value={selectedCard.style}
                onChange={e => this.updateTextarea(e, 'style')}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
