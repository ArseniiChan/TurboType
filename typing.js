const words = 'the be and of a in to have it I that for you he with on do say this they at but we his from not by she or as what go their can who get if would her all my make about know will as up one time there year so think when which them some me people take out into just see him your come could now than like other how then its our two more these want way look first also new because day more use no man find here thing give many well only those tell very even back any good woman through us life child work down may after should call world over school still try last ask need too feel three when state never become between high really something most another much family own leave put old while mean keep student why let great same big group begin seem country help talk where turn problem every start hand might American show part against place over such again few case most week company where system each right program hear so question during work play government run small number off always move night live Mr point believe hold today bring happen next without before large million must home under water room write mother area national money story young fact month different lot right study book eye job word though business issue side kind four head far black long both little house yes since provide service around friend important father sit away until power hour game often yet line political end among ever stand bad lose however member pay law meet car city almost include continue set later community much name five once white least president learn real change team minute best idea kid body information nothing ago lead social understand whether watch together follow parent stop face create speak read level allow add office spend door health person art sure such war history party within grow result open morning walk reason low win research girl guy early food moment air teacher force offer enough education across although remember foot second boy maybe toward able age off policy everything love process music including consider appear actually buy human wait serve market die send expect sense build stay fall oh nation plan cut college interest death course someone experience behind reach local kill six remain effect use class control raise care perhaps little late hard field else pass former sell major require along development themselves report role better economic effort up decide rate strong possible heart drug show leader light voice wife whole police mind finally pull return free military price less according decision explain son hope develop view relationship carry town road drive arm true federal break difference thank receive value international campaign bank teacher train main image table need close hope in chair method box season laugh guess heavy field wonder inch voice path fast'.split(' ');
const wordsCount = words.length;
const gameTime = 30 * 1000; // Game time set to 30 seconds
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

// Adds a class to the specified element
function addClass(el,name) {
  el.className += ' '+name;
}
// Removes a class from the specified element
function removeClass(el,name) {
  el.className = el.className.replace(name,'');
}
// Returns a random word from the words array
function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}
// Formats the word to be displayed in a div with individual letters in spans
function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}
// Initializes a new game by resetting words and the timer
function newGame() {
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i < 200; i++) {
    document.getElementById('words').innerHTML += formatWord(randomWord());
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.getElementById('info').innerHTML = (gameTime / 1000) + '';
  window.timer = null;
}
// Calculates words per minute (WPM) based on correct words typed during the game time
function getWpm() {
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typedWords.filter(word => {
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letters.filter(letter => letter.className.includes('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
  });
  return correctWords.length / gameTime * 60000;
}
// Ends the game and displays the result
function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  const result = getWpm();
  document.getElementById('info').innerHTML = `WPM: ${result}`;
}
// Event listener for keyup events in the game, handling typing and game logic
document.getElementById('game').addEventListener('keyup', ev => {
  const key = ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' '; // Checks if the key pressed is a letter
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;

  if (document.querySelector('#game.over')) {
    return; // Stops any further input if the game is over
  }

  console.log({key,expected});

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const currentTime = (new Date()).getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = Math.round((gameTime / 1000) - sPassed);
      if (sLeft <= 0) {
        gameOver(); // Ends the game when the timer reaches 0
        return;
      }
      document.getElementById('info').innerHTML = sLeft + '';
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? 'correct' : 'incorrect'); // Marks letters as correct or incorrect
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current'); // Moves to the next letter
      }
    } else {
      const incorrectLetter = document.createElement('span');
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = 'letter incorrect extra';  // Adds extra incorrect letters if user types more
      currentWord.appendChild(incorrectLetter);
    }
  }

  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect'); // Marks remaining letters of the word as incorrect
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current'); // Moves to the next word
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current'); // Moves to the first letter of the next word

  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      // Moves back to the previous word
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
    }
    if (currentLetter && !isFirstLetter) {
      // Moves back one letter
      removeClass(currentLetter, 'current');
      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, 'current'); // Moves to the last letter of the word
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
    }
  }

  // Scrolls the words up if needed
  if (currentWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 35) + 'px';
  }

  // Moves the cursor to the next letter or word
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  // Adjusts the cursor position based on the next letter or word
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});
// Event listener for starting a new game when the button is clicked
document.getElementById('newGameBtn').addEventListener('click', () => {
  gameOver();
  newGame();
});

// Initial call to start the game when the page loads
newGame();