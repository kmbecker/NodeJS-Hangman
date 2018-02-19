var inquirer = require('inquirer');
var words = require('./game.js');
var display = require('./letter.js');
var check = require('./word.js');

var currentWord;
var remainingGuesses = 8;
var wins = 0;
var losses = 0;
var showPlayer = [];
var checkLetter = [];
var wordsPlayed = [];

function selectRandomWord(){
	var x = Math.floor(Math.random() * 27)
	currentWord = words.possibleWords[x];

	//only allows words which have not been played 
	if(wordsPlayed.includes(currentWord)){
		selectRandomWord();
	}
	else{
		showPlayer = new Display(currentWord);
		checkLetter = new Check(currentWord);
	}
	wordsPlayed.push(currentWord);
}

function restartGame(){
	inquirer.prompt([{
		name: 'play',
		message: 'Play Again? (y or n)'
	}]).then(function(answer){
		var confirm = answer.play.toLowerCase();
		if(confirm == 'y'){
			remainingGuesses = 8;
			checkLetter.lettersGuessed = [];
			currentWord = '';
			checkLetter.currentWordArray = [];

			selectRandomWord();
			console.log('');
			console.log('');
			console.log('=========================================================');
			console.log('HANGMAN');
			console.log('=========================================================');
			console.log('State Capitals');
			console.log('Let the guessing commence!');
			console.log('');
			console.log('Guess the state capital:'); 
			showPlayer.originalDisplay();
			console.log('');
			console.log('Guesses Remaining: ' + remainingGuesses);
			console.log('');
			guessLetters();
		}
		else if(confirm == 'n'){
			console.log('Thanks for playing!')
			console.log('');
		}
		else{
			console.log('Please select \'y\' or \'n\'');
			console.log('');
			restartGame();
		}
	})
};



//select a word from the array 
selectRandomWord();

// Game instructions
console.log('');
console.log('');
console.log('=========================================================');
console.log('HANGMAN');
console.log('=========================================================');
console.log('State Capitals');
console.log('Let the guessing commence!');
console.log('');
console.log('Guess the state capital:'); 
showPlayer.originalDisplay();
console.log('');
console.log('Guesses Remaining: ' + remainingGuesses);
console.log('');

//Prompt the user to guess a letter
var guessLetters = function(){
	if(remainingGuesses > 0){
	inquirer.prompt([{
		name: 'currentGuess',
		message: 'Guess a letter'
	}]).then(function(answer){
		var letter = answer.currentGuess.toLowerCase();
		var letters = /^[a-z]+$/;
		//if letter is valid
		if(letter.match(letters)){
			if(checkLetter.lettersGuessed.includes(letter)){
				console.log('You have already guessed that letter');
				showPlayer.updatedDisplay(letter);
				console.log('Letters Guessed: ' + checkLetter.lettersGuessed);
				console.log('Guesses Remaining: ' + remainingGuesses);
				console.log('-------------------------------------------------------');
				console.log('');
				guessLetters();
			}
			else{
				checkLetter.lettersGuessed.push(letter);
				if(checkLetter.currentWordArray.includes(letter)){
					console.log('That was a correct answer');
					showPlayer.updatedDisplay(letter);
					
					if(showPlayer.updated == currentWord){
						wins++;
						console.log('You Win!');
						console.log('');
						console.log('Number of wins: ' + wins);
						console.log('Number of losses: ' + losses);
						console.log('');
						restartGame();
					}
					else{
						console.log('Letters Guessed: ' + checkLetter.lettersGuessed);
						console.log('Guesses Remaining: ' + remainingGuesses);
						console.log('-------------------------------------------------------');
						console.log('');
						guessLetters();	
					}
				}
				else{
					console.log('That was a wrong answer');
					showPlayer.updatedDisplay(letter);
					console.log('Letters Guessed: ' + checkLetter.lettersGuessed);
					remainingGuesses--;
					console.log('Guesses Remaining: ' + remainingGuesses);
					console.log('-------------------------------------------------------');
					console.log('');
					guessLetters();
				}
			}
		}
		//if letter is not valid
		else{
			console.log('Please select an alphabetic character');
			console.log('');
			guessLetters();
		}
	});
	}
	else{
		losses++;
		console.log('You Lose!');
		console.log('The capital we were looking for was: ' + currentWord);
		console.log('');
		console.log('Number of wins: ' + wins);
		console.log('Number of losses: ' + losses);
		console.log('');
		restartGame();
	}
}

console.log('updated');

guessLetters();
