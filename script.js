function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }

    const startRow = 3 * Math.floor(row / 3);
    const startCol = 3 * Math.floor(col / 3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku(board) {
    const empty = findEmptyLoc(board);
    if (!empty) {
        return true;
    }
    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
                return true;
            }
            board[row][col] = 0;
        }
    }
    return false;
}

function findEmptyLoc(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

function generateSolvedSudoku() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    for (let i = 0; i < 9; i++) {
        let row, col, num;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
            num = Math.floor(Math.random() * 9) + 1;
        } while (!isValid(board, row, col, num) || board[row][col] !== 0);
        board[row][col] = num;
    }
    solveSudoku(board);
    return board;
}

function countSolutions(board) {
    function count(board) {
        const empty = findEmptyLoc(board);
        if (!empty) {
            return 1;
        }
        const [row, col] = empty;
        let num_solutions = 0;
        for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
                board[row][col] = num;
                num_solutions += count(board);
                board[row][col] = 0;
                if (num_solutions > 1) {
                    return num_solutions;
                }
            }
        }
        return num_solutions;
    }

    return count(board);
}

function removeCells(board, num_holes) {
    const cells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            cells.push([i, j]);
        }
    }
    shuffleArray(cells);

    while (num_holes > 0 && cells.length > 0) {
        const [row, col] = cells.pop();
        const backup = board[row][col];
        board[row][col] = 0;

        const board_copy = board.map(row => row.slice());
        if (countSolutions(board_copy) !== 1) {
            board[row][col] = backup;
        } else {
            num_holes--;
        }
    }
}

function generateSudoku(num_holes = 60) {
    const solved_board = generateSolvedSudoku();
    const puzzle_board = solved_board.map(row => row.slice());
    removeCells(puzzle_board, num_holes);
    return [puzzle_board, solved_board];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const [puzzleBoard, solvedBoard] = generateSudoku(30);

const sudokuGrid = document.getElementById('sudoku-grid');


function createSudokuGrid() {
    for (let i = 1; i <= 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.id = `cell-${i}`;
        cell.setAttribute('data-row', Math.floor((i - 1) / 9));
        cell.setAttribute('data-col', (i - 1) % 9);

        if (puzzleBoard[Math.floor((i - 1) / 9)][(i - 1) % 9] === 0) {
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

            cell.addEventListener('focus', function() {
                event.target.style.outline = 'none';
            });

            cell.addEventListener('blur', function() {
                event.target.style.outline = 'none';
            });
        } 
        else {
            cell.textContent = puzzleBoard[Math.floor((i - 1) / 9)][(i - 1) % 9];
        }

        sudokuGrid.appendChild(cell);
    }
}

createSudokuGrid();
