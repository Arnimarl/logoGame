import React, { Component } from 'react';
import './LogoGame.css';
import GameView from '../GameView/GameView';
import ScoreView from '../ScoreView/ScoreView';
import { shuffle } from '../../helpers/arrayMethods';
import alertify from 'alertifyjs';

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
      theBestScore: JSON.parse(localStorage.getItem('theBestScore')) || undefined,
      letterToFind: undefined,
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

  componentDidMount() {
    this.shufflePickupCards();
    this.setNewLetterToFind();
  }

  shufflePickupCards() {
    let shuffledPickupCards = shuffle(this.state.pickupCards);
    this.setState({ pickupCards: shuffledPickupCards });
  }

  matchPickupCard = (idx, slotIdx) => {
    let pickupCards = [...this.state.pickupCards];
    pickupCards[idx].matched = true;

    let dropSlots = [...this.state.dropSlots];
    dropSlots[slotIdx].taken = true;

    this.setState({ 
      pickupCards: pickupCards,
      dropSlots: dropSlots,
      matchedCards: this.state.matchedCards + 1
    }, () => {
      this.setNewLetterToFind();
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
    this.setNewLetterToFind();
  }

  setNewLetterToFind = () => {
    const possibleLetters = this.state.pickupCards.filter((card) => {
      return !card.matched;
    });
    if (!possibleLetters.length) {
      return;
    }
    const newLetterToFind = shuffle(possibleLetters)[0];
    this.setState({ letterToFind: newLetterToFind.letter });
  }

  onGameWinLogic = () => {
    clearInterval(this.scoreInterval);
    this.setState({ isGameWon: true });

    this.scores = JSON.parse(localStorage.getItem('bestGameScores')) || [];
    this.scoreAlert();
    this.saveScore();
    
    setTimeout(() => {
      if (!this.stopReload) {
        window.location.reload();
      }
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

  saveTheBestScore(name) {
    const theBestScore = {
      ownerName: name,
      score: this.state.score
    }

    localStorage.setItem('theBestScore', JSON.stringify(theBestScore));
    this.setState({ theBestScore: theBestScore });
  }

  saveNewBestScoreSpecialAlert() {
    const theBestScoreOwnerName = this.state.theBestScore ? this.state.theBestScore.ownerName : '';

    alertify.prompt('This is the best result so far! What is your name?', theBestScoreOwnerName,
      (e, name) => {
        this.saveTheBestScore(name);

        alertify.success('You did great, ' + name);
      },
      (e) => {
        alertify.error('Cancel');
    });
  }

  scoreAlert = () => {
    if (!this.scores.length) {
      alertify.success('Your best score!');
      this.saveNewBestScoreSpecialAlert();
      return;
    }
    const arr = this.scores.map((score) => {return score.score});
    const lowestScore = arr.reduce((a, b) => Math.min(a, b));

    if (this.state.score < lowestScore) {
      this.stopReload = true;
      alertify.success('Your new best score!');
      this.saveNewBestScoreSpecialAlert();
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
          matchPickupCard={(idx, slotIdx) => this.matchPickupCard(idx, slotIdx)}
          incorrectPick={this.incorrectPick}
          onGameWinLogic={this.onGameWinLogic}
          isGameWon={this.state.isGameWon}
          matchedCards={this.state.matchedCards}
          letterToFind={this.state.letterToFind}/>

        <ScoreView 
          score={this.state.score}
          theBestScore={this.state.theBestScore}
          letterToFind={this.state.letterToFind}/>
      </section>
     );
  }
}
 
export default LogoGame;