function generateSudokuGrid() {
    const dropdownContainer = document.getElementById('dropdown-container');
    const sudokuGrid = document.getElementById('sudoku-grid');

    // Create dropdown menu
    const dropdown = document.createElement('select');
    const difficulties = [
        { label: 'Easy', holes: 20 },
        { label: 'Medium', holes: 30 },
        { label: 'Hard', holes: 45 },
        { label: 'Extreme', holes: 57 }
    ];

    difficulties.forEach(difficulty => {
        const option = document.createElement('option');
        option.value = difficulty.holes;
        option.textContent = difficulty.label;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', () => {
        const selectedHoles = parseInt(dropdown.value);
        createSudokuBoard(selectedHoles);
    });

    dropdownContainer.appendChild(dropdown);

    // Function to create the Sudoku board
    function createSudokuBoard(numHoles) {
        sudokuGrid.innerHTML = ''; // Clear previous grid

        const [puzzleBoard, solvedBoard] = generateSudoku(numHoles);

        for (let i = 1; i <= 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.id = `cell-${i}`;
            cell.setAttribute('data-row', Math.floor((i - 1) / 9));
            cell.setAttribute('data-col', (i - 1) % 9);

            const row = Math.floor((i - 1) / 9);
            const col = (i - 1) % 9;

            if (puzzleBoard[row][col] === 0) {
                cell.contentEditable = true;
                cell.addEventListener('input', function(event) {
                    var enteredValue = event.target.textContent.trim();
                    cell.addEventListener('keydown', function(event) {
                        const key = event.key;
                        if (key === "Backspace" || key === "Delete") {
                            event.target.textContent = '';
                            return;
                        }
                    });
                    if (enteredValue < 1 || enteredValue > 9) {
      
                        let myFunc = num => Number(num);
                        let intArr = Array.from(String(enteredValue), myFunc);
                        var t = intArr.splice(intArr.indexOf(enteredValue[0]), 1);
    
                        enteredValue = intArr[0];
                        event.target.textContent = t;
                    }
                    else if (enteredValue.length !== 1 || isNaN(enteredValue)) {
                        event.target.textContent = '';
                        return;
                    }
    
                    const row = parseInt(event.target.getAttribute('data-row'));
                    const col = parseInt(event.target.getAttribute('data-col'));
                    const newValue = parseInt(enteredValue);
                    const oldValue = puzzleBoard[row][col];
    
                    if (newValue !== oldValue) {
                        puzzleBoard[row][col] = newValue;
                        event.target.textContent = newValue;
                        if (newValue !== solvedBoard[row][col]) {
                            event.target.style.backgroundColor = 'red';
                        } else {
                            event.target.style.backgroundColor = 'transparent';
                            cell.contentEditable = false;
                        }
                    }
                });

                cell.addEventListener('focus', function(event) {
                    event.target.style.outline = '2px solid blue';
                });

                cell.addEventListener('blur', function(event) {
                    event.target.style.outline = 'none';
                });
            } else {
                cell.textContent = puzzleBoard[row][col];
            }

            sudokuGrid.appendChild(cell);
        }
    }

    // Generate initial board with default difficulty
    createSudokuBoard(difficulties[0].holes);
}

// Call the function to create Sudoku grid and dropdown on page load
generateSudokuGrid();