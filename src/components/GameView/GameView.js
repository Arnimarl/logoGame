import React from 'react';
import './GameView.css';

const GameView = (props) => {

  const onLetterDragStar = (e, letter, idx) => {
    e.dataTransfer.setData('letter', letter);
    e.dataTransfer.setData('idxOfCardFromPickupList', idx);
    e.target.style.opacity = '0.5';

    if (!props.isGameStarted) {
      props.startGame();
    }
  }

  const onLetterDragEnd = (e) => {
    e.target.style.opacity = '1';
  }

  const letterMatchesWithSlot = (e, slotIdx, slot) => {
    e.target.style.border = 'none';
    e.target.style.backgroundImage = `url("assets/zoovu-logo-${slot.accepts}.png")`;

    props.matchPickupCard(e.dataTransfer.getData('idxOfCardFromPickupList'),
                          slotIdx);
  }

  const onLetterDrop = (e, slot, slotIdx) => {
    const droppedLetter = e.dataTransfer.getData('letter');
    const droppedProperLetter = ((droppedLetter === slot.accepts) && !slot.taken && (droppedLetter === props.letterToFind));

    if (droppedProperLetter) {
      letterMatchesWithSlot(e, slotIdx, slot);
      if (props.matchedCards === 4) {
        props.onGameWinLogic();
      }
    } else {
      props.incorrectPick();
    }
    e.target.style.borderColor = 'rgba(34, 36, 38, 0.15)';
  }

  const replayNow = () => {
    window.location.reload();
  }

  const onLetterDragEnter = (e) => {
    e.target.style.borderColor = '#3c0078';
  }

  const onLetterDragLeave = (e) => {
    e.target.style.borderColor = 'rgba(34, 36, 38, 0.15)';
  }

  return ( 
    <section className="logo-game-col logo-game-col--game-view">
      {props.isGameWon &&
        <h1 className="text-green text-big">
          You have won!<br/>
          <small className="logo-game-reply" onClick={() => {replayNow()}}>(click to replay now)</small>
        </h1>
      }

      {!(props.matchedCards === 5) &&
        <div className="logo-game-pickup-cards">
          <h3>Pickup Cards</h3>
          <ul className="logo-game-cards-list">
            {props.pickupCards.map((card, idx) => (
              <li key={idx} 
                  className={"logo-game-card " + (card.matched ? "logo-game-card--matched" : "")}
                  draggable="true"
                  onDragStart={(e) => {onLetterDragStar(e, card.letter, idx)}}
                  onDragEnd={(e) => {onLetterDragEnd(e)}}>
                ?
              </li>
            ))}
          </ul>
        </div>
      }

      <div className="logo-game-logo-area">
        <h3>The Logo</h3>
        <ul className="logo-game-cards-list">
          {props.dropSlots.map((slot, idx) => (
            <li key={idx} 
                className="logo-game-card logo-game-card--slot" 
                onDragEnter={(e) => {onLetterDragEnter(e)}}
                onDragLeave={(e) => {onLetterDragLeave(e)}}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onLetterDrop(e, slot, idx)}>
            </li>
          ))}
        </ul>
      </div>
    </section> 
  );
}
 
export default GameView;