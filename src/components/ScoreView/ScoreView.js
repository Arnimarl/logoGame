import React from 'react';

const ScoreView = (props) => {
  return (
    <section className="logo-game-col logo-game-col--score-view">
      <div className="logo-game-score">
        Score: <strong>{props.score}</strong>
      </div>

      <div className="logo-game-find-card">
        
      </div>
    </section> 
  );
}
 
export default ScoreView;