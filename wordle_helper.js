// Wordle box color cycling (simpler version)
document.addEventListener('DOMContentLoaded', function() {
	var colors = ['#787c7e', '#c9b458', '#6aaa64']; // gray, yellow, green
	var activeBox = null;


	function calculatePossibleWords() {
		console.log(newBoxes.map(box => box.textContent.trim()).join(''));
		var greenLetters = [];
		for (var i = 0; i < newBoxes.length; i++) {
			if (newBoxes[i].colorIndex === 0) {
				blackLetters.push(newBoxes[i].textContent.trim().toLowerCase());
			} else if (newBoxes[i].colorIndex === 1) {
				yellowLetters.push(newBoxes[i].textContent.trim().toLowerCase());
			} else if (newBoxes[i].colorIndex === 2) {
				greenLetters.push({ letter: newBoxes[i].textContent.trim().toLowerCase(), index: i });
			}
		}
		// Example: blackLetters is an array of single characters to exclude
		var filteredWords = fiveLetterWords.filter(function(word) {
			// Exclude words with any black letter
			if (blackLetters.some(function(letter) { return word.includes(letter); })) {
				return false;
			}
			// Must include all yellow letters
			if (!yellowLetters.every(function(letter) { return word.includes(letter); })) {
				return false;
			}
			// Must have green letters in the correct positions
			for (var j = 0; j < greenLetters.length; j++) {
				if (word[greenLetters[j].index] !== greenLetters[j].letter) {
					return false;
				}
			}
			return true;
		});
		console.log('Filtered words:', filteredWords);
		



		
	}

	function setupBox(box) {
		box.colorIndex = 0;
		box.style.backgroundColor = colors[box.colorIndex];
		box.onclick = function() {
			this.colorIndex = (this.colorIndex + 1) % colors.length;
			this.style.backgroundColor = colors[this.colorIndex];
			if (activeBox) {
				activeBox.classList.remove('active-wordle-box');
			}
			activeBox = this;
			this.classList.add('active-wordle-box');
		};
	}

	let fiveLetterWords = [];
	fetch('assets/words_alpha.txt')
	.then(response => response.text())
	.then(text => {
		fiveLetterWords = text
		.split('\n')
		.map(word => word.trim())
		.filter(word => word.length === 5);
	});

	var newBoxes = [];
	var blackLetters = [];
	var yellowLetters = [];
	var greenLetters = [];
	// Setup initial boxes
	var boxes = document.querySelectorAll('.wordle-box');
	for (var i = 0; i < boxes.length; i++) {
		setupBox(boxes[i]);
		newBoxes.push(boxes[i]);
	}

	// Add new row on Solve button click
	var solveBtn = document.getElementById('solve-button');
	
	if (solveBtn) {
		solveBtn.onclick = function() {
			var rowsContainer = document.getElementById('wordle-rows');
			var newRow = document.createElement('div');
			newRow.className = 'wordle-row';
			
			//Printing current row letters to console
			for (var i = 0; i < newBoxes.length; i++) {
				if (newBoxes[i].textContent.trim() === '') {
					newBoxes[i].textContent = "_";
				}
			}
			
			//Print possible words left
			calculatePossibleWords();
			
			for (var i = 0; i < 5; i++) {
				var box = document.createElement('div');
				box.className = 'wordle-box';
				setupBox(box);
				newRow.appendChild(box);
				newBoxes[i] = box;
			}

			rowsContainer.appendChild(newRow);
		};
	}

	// Listen for key presses to type into the active box
	document.addEventListener('keydown', function(e) {
		if (activeBox) {
			var letter = e.key;
			if (/^[a-zA-Z]$/.test(letter)) {
				activeBox.textContent = letter.toUpperCase();
			} else if (e.key === 'Backspace' || e.key === 'Delete') {
				activeBox.textContent = '';
			}
		}
	});
});