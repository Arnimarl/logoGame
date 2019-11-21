export default {  
  score: 0,
  matchedCards: 0,
  isGameStarted: false,
  isGameWon: false,
  theBestScore: JSON.parse(localStorage.getItem('theBestScore')) || undefined,
  letterToFind: undefined,
  stopReload: false,
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