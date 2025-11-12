// Wordle box color cycling (simpler version)
document.addEventListener('DOMContentLoaded', function() {
	var colors = ['#787c7e', '#c9b458', '#6aaa64']; // gray, yellow, green
	var activeBox = null;

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

	// Setup initial boxes
	var boxes = document.querySelectorAll('.wordle-box');
	for (var i = 0; i < boxes.length; i++) {
		setupBox(boxes[i]);
	}

	// Add new row on Solve button click
	var solveBtn = document.getElementById('solve-button');
	if (solveBtn) {
		solveBtn.onclick = function() {
			var rowsContainer = document.getElementById('wordle-rows');
			// Get all rows
			var allRows = rowsContainer.querySelectorAll('.wordle-row');
			var lastRow = allRows[allRows.length - 1];
			var boxes = lastRow.querySelectorAll('.wordle-box');
			var word = '';
			for (var i = 0; i < boxes.length; i++) {
				var letter = boxes[i].textContent.trim();
				word += letter ? letter : '_';
			}
			console.log('Most recent word:', word);

			// Add a new row
			var newRow = document.createElement('div');
			newRow.className = 'wordle-row';
			for (var i = 0; i < 5; i++) {
				var box = document.createElement('div');
				box.className = 'wordle-box';
				setupBox(box);
				newRow.appendChild(box);
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