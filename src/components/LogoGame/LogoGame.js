import React, { Component } from 'react';
import './LogoGame.css';
import GameView from '../GameView/GameView';
import ScoreView from '../ScoreView/ScoreView';
import { shuffle } from '../../helpers/arrayMethods';
import alertify from 'alertifyjs';
import state from './LogoGameState';

class LogoGame extends Component {
  constructor(props) {
    super(props);

    this.incorrectPickPenalty = 10;

    this.state = state;
  }

  componentDidMount() {
    const introMsgHasBeenAlreadyShown = localStorage.getItem('introMsgShown');

    if (!introMsgHasBeenAlreadyShown) {
      this.displayIntroMessage();
    }
    this.shufflePickupCards();
    this.setNewLetterToFind();
  }

  displayIntroMessage() {
    const introMsg = `The main goal of this game is to rebuild a logo. The logo is basically a word <i>"Zoovu"</i> with a little fancier font. 
                      Do it by drag & drop the right letter in the right place.<br><br>
                      To make it even funnier your time is counted. Everything in this world is about time, isn't it? Since we have some magic capabilities, 
                      your incorrect moves come with a penalty, increasing the time.<br><br>
                      The best score is the lowest one.<br><br>Good luck!`;

    alertify.confirm(introMsg,
      () => {
        localStorage.setItem('introMsgShown', true);
      }
    )
    .set({
      'labels': {ok: 'Got it, never show again!', cancel: 'Got it!'},
      'transition': 'slide'
    }).setHeader('A quick intro');
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
      if (!this.state.stopReload) {
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

  saveNewBestScoreSpecialAlert = () => {
    const theBestScoreOwnerName = this.state.theBestScore ? this.state.theBestScore.ownerName : '';

    alertify.prompt('This is the best result so far! What is your name?', theBestScoreOwnerName,
      (e, name) => {
        this.saveTheBestScore(name);
        alertify.success('You did great, ' + name);
      },
      (e) => {
        alertify.error('Cancel');
    })
    .set({'transition': 'slide'})
    .setHeader('Congratulations!');
  }

  scoreAlert = () => {
    if (!this.scores.length) {
      alertify.success('Your best score!');
      this.setState({ stopReload: true });
      this.saveNewBestScoreSpecialAlert();
      return;
    }
    const arr = this.scores.map((score) => {return score.score});
    const lowestScore = arr.reduce((a, b) => Math.min(a, b));

    if (this.state.score < lowestScore) {
      this.setState({ stopReload: true });
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