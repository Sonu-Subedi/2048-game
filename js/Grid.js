// JS file for defining the game board, manages cells, and provides methods for tile placement and movement.

const GRID_SIZE = 4;
const CELL_SIZE = 16;
const CELL_GAP = 2;
let globalSum = 0;

export default class Grid {
  //  Private field that holds an array of cell objects
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
  }

  // Getter for accessing the cells.
  get cells() {
    return this.#cells;
  }

  // Getters for organizing cells into column-wise and row-wise arrays.
  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }

  // Private getter for retrieving empty cells
  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile === null);
  }

  // Returns a random empty cell for tile placement.
  randomEmptyCell() {
    const emptyCells = this.#emptyCells;
    if (emptyCells.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }
}
function createCellElements(gridElement) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);
    gridElement.appendChild(cell);
  }
  return cells;
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
    this.#tile = null; // Initialize tile to null
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }
  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value === null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }
  //   mergeTiles() {
  //     if (this.tile == null || this.mergeTile == null) return;
  //     this.tile.value = this.tile.value + this.mergeTile.value;
  //     globalSum += this.tile.value;
  //     this.mergeTile.remove();
  //     this.mergeTile = null;
  //   }
  // }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    const mergedSum = this.tile.value + this.mergeTile.value;
    globalSum += mergedSum;

    updateScore(mergedSum);

    this.tile.value = mergedSum;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

// _mergedSum is an implementation detail and not something that should be manipulated or accessed directly from outside the function

function updateScore(_mergedSum) {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = globalSum;
}
