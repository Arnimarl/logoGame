import React, { Component } from 'react';
import './LogoGame.css';
import GameView from '../GameView/GameView';
import ScoreView from '../ScoreView/ScoreView';
import { shuffle } from '../../helpers/arrayMethods';

// find this card
// polish UI and code

class LogoGame extends Component {
  constructor(props) {
    super(props);

    this.incorrectPickPenalty = 10;

    this.state = {  
      score: 0,
      matchedCards: 0,
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

  matchPickupCard = (idx) => {
    let pickupCards = [...this.state.pickupCards];
    pickupCards[idx].matched = true;

    this.setState({ 
      pickupCards: pickupCards, 
      matchedCards: this.state.matchedCards + 1
    });
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

    this.scores = JSON.parse(localStorage.getItem('bestGameScores')) || [];
    this.scoreAlert();
    this.saveScore();
    
    setInterval(() => {
      window.location.reload();
    }, 10000);
  }

  saveScore() {
    const dateNow = new Date();
    this.scores.push({
      score: this.state.score,
      createdAt: dateNow.toLocaleString()
    });
    localStorage.setItem('bestGameScores', JSON.stringify(this.scores));
  }

  scoreAlert() {
    if (!this.scores.length) {
      return;
    }
    const arr = this.scores.map((score) => {return score.score});
    const lowestScore = arr.reduce((a, b) => Math.min(a, b));
    console.log(lowestScore);

    if (this.state.score < lowestScore) {
      alert('Your new best score!');
    }
  }

  render() { 
    return ( 
      <section className="logo-game-container">
        <GameView 
          pickupCards={this.state.pickupCards}
          isGameStarted={this.state.isGameStarted}
          startGame={this.startGame}
          dropSlots={this.state.dropSlots}
          matchPickupCard={(idx) => this.matchPickupCard(idx)}
          incorrectPick={this.incorrectPick}
          onGameWinLogic={this.onGameWinLogic}
          isGameWon={this.state.isGameWon}
          matchedCards={this.state.matchedCards}/>

        <ScoreView 
          score={this.state.score}/>
      </section>
     );
  }
}
 
export default LogoGame;