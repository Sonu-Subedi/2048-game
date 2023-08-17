// Js file for  defining the individual tiles used in the game

export default class Tile {
  #tileElement;
  // Private fields for the tile's position on the grid
  #x;
  #y;
  // Private field for the value of the tile
  #value;
  constructor(tileContainer, value = Math.random() > 0.1 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");
    tileContainer.appendChild(this.#tileElement);
    this.value = value;
  }

  // Getter and Setter for value
  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    const power = Math.log2(v);
    const backgroundLightness = 100 - power * 9;
    const textLightness = 20;
    this.#tileElement.style.setProperty(
      "--background-lightness",
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--text-lightness",
      `${backgroundLightness <= 50 ? 90 : 10}%`
    );
  }

  // Setter for x
  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  // Setter for y
  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }
  remove() {
    this.#tileElement.remove();
  }
}
