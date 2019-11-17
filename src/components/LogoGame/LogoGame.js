import React, { Component } from 'react';
import './LogoGame.css';
import GameView from '../GameView/GameView';
import ScoreView from '../ScoreView/ScoreView';
import { shuffle } from '../../helpers/arrayMethods';

// find this card
// polish UI and code

// when time: save scores
// alertify for scores

class LogoGame extends Component {
  constructor(props) {
    super(props);

    this.incorrectPickPenalty = 10;

    this.state = {  
      score: 0,
      isGameStarted: false,
      isGameWon: false,
      pickupCards: [
        {
          letter: 'z'
        },
        {
          letter: 'o'
        },
        {
          letter: 'o'
        },
        {
          letter: 'v'
        },
        {
          letter: 'u'
        }
      ],
      dropSlots: [
        {
          accepts: 'z'
        },
        {
          accepts: 'o'
        },
        {
          accepts: 'o'
        },
        {
          accepts: 'v'
        },
        {
          accepts: 'u'
        }
      ]
    }
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    this.shufflePickupCards();
  }

  shufflePickupCards() {
    let shuffledPickupCards = shuffle(this.state.pickupCards);
    this.setState({ pickupCards: shuffledPickupCards });
  }

  removePickupCard = (idx) => {
    let pickupCards = [...this.state.pickupCards];
    pickupCards.splice(idx, 1);

    this.setState({ pickupCards: pickupCards });
  }

  startGame = () => {
    this.startTimer();
    this.setState({ isGameStarted: true });
  }

  startTimer() {
    this.scoreInterval = setInterval(() => {
      this.setState({ score: this.state.score + 1 });
    }, 1000);
  }

  incorrectPick = () => {
    this.setState({ score: this.state.score + this.incorrectPickPenalty });
  }

  onGameWinLogic = () => {
    clearInterval(this.scoreInterval);
    this.setState({ isGameWon: true });
    
    setInterval(() => {
      window.location.reload();
    }, 10000);
  }

  render() { 
    return ( 
      <section className="logo-game-container">
        <GameView 
          pickupCards={this.state.pickupCards}
          isGameStarted={this.state.isGameStarted}
          startGame={this.startGame}
          dropSlots={this.state.dropSlots}
          removePickupCard={(idx) => this.removePickupCard(idx)}
          incorrectPick={this.incorrectPick}
          onGameWinLogic={this.onGameWinLogic}
          isGameWon={this.state.isGameWon}/>

        <ScoreView 
          score={this.state.score}/>
      </section>
     );
  }
}
 
export default LogoGame;