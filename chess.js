// Simple chess board and piece setup
const board = document.getElementById('chessboard');
let gameBoard = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['♙','♙','♙','♙','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖']
];

let selected = null;
let possibleMoves = [];
let turn = 'white'; // 'white' or 'black'
let capturedWhite = [];
let capturedBlack = [];

function drawBoard() {
  board.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
      square.dataset.row = row;
      square.dataset.col = col;
      const move = possibleMoves.find(m => m[0] === row && m[1] === col);
      if (move) {
        const target = gameBoard[row][col];
        if (target && isOpponent(gameBoard[selected[0]][selected[1]], target)) {
          square.textContent = target;
          square.style.backgroundColor = '#e74c3c';
          square.style.color = '#fff';
        } else if (!target) {
          square.textContent = '•';
          square.style.color = '#333';
        }
      } else {
        square.textContent = gameBoard[row][col];
      }
      if (selected && selected[0] === row && selected[1] === col) {
        square.style.outline = '2px solid red';
      }
      square.onclick = () => handleSquareClick(row, col);
      board.appendChild(square);
    }
  }
  drawCaptured();
}

function drawCaptured() {
  let capturedDiv = document.getElementById('captured-pieces');
  if (!capturedDiv) {
    capturedDiv = document.createElement('div');
    capturedDiv.id = 'captured-pieces';
    capturedDiv.style.display = 'flex';
    capturedDiv.style.flexDirection = 'column';
    capturedDiv.style.position = 'absolute';
    capturedDiv.style.left = '420px';
    capturedDiv.style.top = '40px';
    capturedDiv.style.minWidth = '60px';
    capturedDiv.style.fontSize = '28px';
    document.body.appendChild(capturedDiv);
  }
  capturedDiv.innerHTML = `<div><b>White Captured:</b> ${capturedWhite.join(' ')}</div><div><b>Black Captured:</b> ${capturedBlack.join(' ')}</div>`;
}

function handleSquareClick(row, col) {
  const piece = gameBoard[row][col];
  // Only allow selecting pieces of the current turn
  if (!selected && piece && ((turn === 'white' && isWhite(piece)) || (turn === 'black' && isBlack(piece)))) {
    selected = [row, col];
    possibleMoves = getPossibleMoves(row, col, piece);
    drawBoard();
    return;
  }
  // If clicking a possible move
  if (selected && possibleMoves.some(m => m[0] === row && m[1] === col)) {
    const movingPiece = gameBoard[selected[0]][selected[1]];
    const targetPiece = gameBoard[row][col];
    if (targetPiece) {
      if (isWhite(targetPiece)) capturedWhite.push(targetPiece);
      else if (isBlack(targetPiece)) capturedBlack.push(targetPiece);
    }
    // Move piece
    gameBoard[row][col] = movingPiece;
    gameBoard[selected[0]][selected[1]] = '';
    selected = null;
    possibleMoves = [];
    // Switch turn
    turn = (turn === 'white') ? 'black' : 'white';
    drawBoard();
    return;
  }
  // Deselect if clicking elsewhere
  selected = null;
  possibleMoves = [];
  drawBoard();
}

function getPossibleMoves(row, col, piece) {
  let moves = [];
  // Pawn moves (white and black)
  if (piece === '♙') {
    if (row > 0 && !gameBoard[row-1][col]) moves.push([row-1, col]);
    if (row === 6 && !gameBoard[row-1][col] && !gameBoard[row-2][col]) moves.push([row-2, col]);
    // Captures
    if (row > 0 && col > 0 && gameBoard[row-1][col-1] && isBlack(gameBoard[row-1][col-1])) moves.push([row-1, col-1]);
    if (row > 0 && col < 7 && gameBoard[row-1][col+1] && isBlack(gameBoard[row-1][col+1])) moves.push([row-1, col+1]);
  } else if (piece === '♟') {
    if (row < 7 && !gameBoard[row+1][col]) moves.push([row+1, col]);
    if (row === 1 && !gameBoard[row+1][col] && !gameBoard[row+2][col]) moves.push([row+2, col]);
    // Captures
    if (row < 7 && col > 0 && gameBoard[row+1][col-1] && isWhite(gameBoard[row+1][col-1])) moves.push([row+1, col-1]);
    if (row < 7 && col < 7 && gameBoard[row+1][col+1] && isWhite(gameBoard[row+1][col+1])) moves.push([row+1, col+1]);
  }
  // Rook
  if (piece === '♖' || piece === '♜') {
    moves = moves.concat(getLineMoves(row, col, -1, 0, piece)); // up
    moves = moves.concat(getLineMoves(row, col, 1, 0, piece));  // down
    moves = moves.concat(getLineMoves(row, col, 0, -1, piece)); // left
    moves = moves.concat(getLineMoves(row, col, 0, 1, piece));  // right
  }
  // Bishop
  if (piece === '♗' || piece === '♝') {
    moves = moves.concat(getLineMoves(row, col, -1, -1, piece)); // up-left
    moves = moves.concat(getLineMoves(row, col, -1, 1, piece));  // up-right
    moves = moves.concat(getLineMoves(row, col, 1, -1, piece));  // down-left
    moves = moves.concat(getLineMoves(row, col, 1, 1, piece));   // down-right
  }
  // Queen
  if (piece === '♕' || piece === '♛') {
    // All rook and bishop moves
    moves = moves.concat(getLineMoves(row, col, -1, 0, piece));
    moves = moves.concat(getLineMoves(row, col, 1, 0, piece));
    moves = moves.concat(getLineMoves(row, col, 0, -1, piece));
    moves = moves.concat(getLineMoves(row, col, 0, 1, piece));
    moves = moves.concat(getLineMoves(row, col, -1, -1, piece));
    moves = moves.concat(getLineMoves(row, col, -1, 1, piece));
    moves = moves.concat(getLineMoves(row, col, 1, -1, piece));
    moves = moves.concat(getLineMoves(row, col, 1, 1, piece));
  }
  // Knight
  if (piece === '♘' || piece === '♞') {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightMoves) {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = gameBoard[r][c];
        if (!target || isOpponent(piece, target)) moves.push([r, c]);
      }
    }
  }
  // King
  if (piece === '♔' || piece === '♚') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr, c = col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const target = gameBoard[r][c];
          if (!target || isOpponent(piece, target)) moves.push([r, c]);
        }
      }
    }
  }
  return moves;
}

function getLineMoves(row, col, dr, dc, piece) {
  let moves = [];
  let r = row + dr, c = col + dc;
  while (r >= 0 && r < 8 && c >= 0 && c < 8) {
    const target = gameBoard[r][c];
    if (!target) {
      moves.push([r, c]);
    } else {
      if (isOpponent(piece, target)) moves.push([r, c]);
      break;
    }
    r += dr;
    c += dc;
  }
  return moves;
}

function isWhite(piece) {
  return '♙♖♘♗♕♔'.includes(piece);
}
function isBlack(piece) {
  return '♟♜♞♝♛♚'.includes(piece);
}
function isOpponent(piece, target) {
  return (isWhite(piece) && isBlack(target)) || (isBlack(piece) && isWhite(target));
}

drawBoard();
// You can add click handlers and game logic next!