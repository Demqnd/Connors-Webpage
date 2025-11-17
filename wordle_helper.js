// Wordle box color cycling (simpler version)
document.addEventListener('DOMContentLoaded', function() {
	// Attach Restart button event
	var restartBtn = document.getElementById('restart-btn');
	if (restartBtn) {
		restartBtn.onclick = function() { window.location.reload(); };
	}
	// Add style for active box green border
	var style = document.createElement('style');
	style.textContent = `.active-wordle-box { outline: 2.5px solid #22c55e !important; outline-offset: 2px !important; }`;
	document.head.appendChild(style);
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
		fiveLetterWords = fiveLetterWords.filter(function(word) {
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
		// Show remaining words on the screen with expand/collapse button
		var outputDiv = document.getElementById('possible-words-output');
		var expandBtn = document.getElementById('expand-words-btn');
		var showingAll = outputDiv && outputDiv.getAttribute('data-showing-all') === 'true';
		if (!outputDiv) {
			outputDiv = document.createElement('div');
			outputDiv.id = 'possible-words-output';
			outputDiv.style.margin = '20px auto';
			outputDiv.style.textAlign = 'center';
			outputDiv.style.maxWidth = '700px';
			outputDiv.style.wordBreak = 'break-word';
			document.body.appendChild(outputDiv);
		}
		if (!expandBtn) {
			expandBtn = document.createElement('button');
			expandBtn.id = 'expand-words-btn';
			expandBtn.style.display = 'block';
			expandBtn.style.margin = '10px auto';
			expandBtn.style.padding = '6px 16px';
			expandBtn.style.fontSize = '1em';
			document.body.appendChild(expandBtn);
		}
		function updateWordsDisplay(showAll) {
			if (fiveLetterWords.length === 0) {
				outputDiv.textContent = 'No possible words left.';
				expandBtn.style.display = 'none';
				outputDiv.setAttribute('data-showing-all', 'false');
				return;
			}
			if (fiveLetterWords.length > 20 && !showAll) {
				outputDiv.textContent = fiveLetterWords.slice(0, 20).join(', ') + ` ... (${fiveLetterWords.length} total)`;
				expandBtn.textContent = 'Show All';
				expandBtn.style.display = 'block';
				outputDiv.setAttribute('data-showing-all', 'false');
			} else {
				outputDiv.textContent = fiveLetterWords.join(', ');
				if (fiveLetterWords.length > 20) {
					expandBtn.textContent = 'Show Less';
					expandBtn.style.display = 'block';
				} else {
					expandBtn.style.display = 'none';
				}
				outputDiv.setAttribute('data-showing-all', 'true');
			}
		}
		updateWordsDisplay(showingAll);
		expandBtn.onclick = function() {
			var currentlyAll = outputDiv.getAttribute('data-showing-all') === 'true';
			updateWordsDisplay(!currentlyAll);
		};
		



		
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
	// Make the first box active on load
	if (newBoxes.length > 0) {
		activeBox = newBoxes[0];
		activeBox.classList.add('active-wordle-box');
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

	// Listen for key presses to type into the boxes in sequence
	document.addEventListener('keydown', function(e) {
		// Only handle if a wordle box is focused or active
		if (!document.querySelector('.wordle-box') || newBoxes.length === 0) return;
		// Find the currently active box index
		var idx = activeBox ? newBoxes.indexOf(activeBox) : -1;
		if (idx === -1) idx = 0;
		var letter = e.key;
		if (/^[a-zA-Z]$/.test(letter)) {
			newBoxes[idx].textContent = letter.toUpperCase();
			if (activeBox) activeBox.classList.remove('active-wordle-box');
			activeBox = newBoxes[idx];
			activeBox.classList.add('active-wordle-box');
			// Move to next box if not last, else keep last box active
			if (idx < newBoxes.length - 1) {
				activeBox.classList.remove('active-wordle-box');
				activeBox = newBoxes[idx + 1];
				activeBox.classList.add('active-wordle-box');
			}
		} else if (e.key === 'Backspace' || e.key === 'Delete') {
			if (newBoxes[idx].textContent !== '') {
				newBoxes[idx].textContent = '';
			} else if (idx > 0) {
				newBoxes[idx].classList.remove('active-wordle-box');
				activeBox = newBoxes[idx - 1];
				activeBox.classList.add('active-wordle-box');
				newBoxes[idx - 1].textContent = '';
			}
		}
	});
});