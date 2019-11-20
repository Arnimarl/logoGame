import React from 'react';
import './ScoreView.css';

const ScoreView = (props) => {
  return (
    <section className="logo-game-col logo-game-col--score-view">
      <div className="logo-game-score">
        Your score: <strong>{props.score}</strong>
      </div>
      {props.theBestScore &&
        <div className="logo-game-best-score">
          <small>Best score: </small>
          <strong>{props.theBestScore.ownerName} ({props.theBestScore.score})</strong>
        </div>
      }

      <div className="logo-game-find-card">
        <h3>Find this card</h3>
        <div className="logo-game-find-card__letter" 
             style={{backgroundImage: `url("assets/zoovu-logo-${props.letterToFind}.png")`}}></div>
      </div>
    </section> 
  );
}
 
export default ScoreView;