// JS file for initializing the game, handling user input, and controling the game loop

import Grid from "./Grid.js";
import Tile from "./Tile.js";

const board = document.getElementById("board");
// const scoreElement = document.getElementById("score");

const grid = new Grid(board);

grid.randomEmptyCell().tile = new Tile(board);
grid.randomEmptyCell().tile = new Tile(board);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

// Handling User Input
function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      moveRight();
      break;
    default:
      setupInput();
      return;
  }
  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(board);
  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    const gameOverMessage = document.getElementById("game-over");

    gameOverMessage.style.display = "block";
    restartButton.style.display = "block";
    return;
  }

  setupInput();
}

// Moving Tiles
function moveUp() {
  slideTiles(grid.cellsByColumn);
}

function moveDown() {
  slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  console.log(grid.cellsByRow);
  slideTiles(grid.cellsByRow);
}

function moveRight() {
  slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

// Sliding and Merging Tiles
const slideTiles = (cells) => {
  cells.forEach((group) => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];
      if (cell.tile == null) continue;
      let lastValidCell;
      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];
        if (!moveToCell.canAccept(cell.tile)) break;
        lastValidCell = moveToCell;
      }
      if (lastValidCell != null) {
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });
};

// Checking Valid Moves
function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

// check if moves is possible or not
function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}

// Add a click event listener to the restart button

const restartButton = document.getElementById("restart-button");
restartButton.addEventListener("click", restartGame);

function restartGame() {
  board.innerHTML = "";
  grid.cells.forEach((cell) => {
    if (cell.tile) {
      cell.tile.remove();
    }
    cell.tile = null;
  });

  // Reset the score
  // globalSum = 0;
  // updateScore();

  // Generate initial tiles
  grid.randomEmptyCell().tile = new Tile(board);
  grid.randomEmptyCell().tile = new Tile(board);

  // Set up input for the game
  setupInput();
  console.log("Game restarted");
}
