import React from 'react';
import './GameView.css';

const GameView = (props) => {

  const onLetterDragStar = (e, letter, idx) => {
    e.dataTransfer.setData('letter', letter);
    e.dataTransfer.setData('idxOfCardFromPickupList', idx);

    if (!props.isGameStarted) {
      props.startGame();
    }
  }

  const letterMatchesWithSlot = (e) => {
    e.target.style.color = '#3c0078';
    e.target.style.border = 'none';

    props.removePickupCard(e.dataTransfer.getData('idxOfCardFromPickupList'));
  }

  const onLetterDrop = (e, acceptedLetter) => {
    let droppedLetter = e.dataTransfer.getData('letter');
    if (droppedLetter === acceptedLetter) {
      letterMatchesWithSlot(e);
      if (props.pickupCards.length === 1) {
        props.onGameWinLogic();
      }
    } else {
      props.incorrectPick();
    }
  }

    return ( 
    <section className="logo-game-col logo-game-col--game-view">
      {props.isGameWon &&
        <h1 className="text-green text-big">You have won!</h1>
      }

      <div className="logo-game-pickup-cards">
        <h3>Pickup Cards</h3>
        <ul className="logo-game-cards-list">
          {props.pickupCards.map((card, idx) => (
            <li key={idx} 
                className="logo-game-card" 
                draggable="true"
                onDragStart={(e) => {onLetterDragStar(e, card.letter, idx)}}>
              ?
            </li>
          ))}
        </ul>
      </div>

      <div className="logo-game-logo-area">
        <h3>The Logo</h3>
        <ul className="logo-game-cards-list">
          {props.dropSlots.map((slot, idx) => (
            <li key={idx} 
                className="logo-game-card logo-game-card--slot" 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onLetterDrop(e, slot.accepts)}>
              {slot.accepts}
            </li>
          ))}
        </ul>
      </div>
    </section> 
  );
}
 
export default GameView;