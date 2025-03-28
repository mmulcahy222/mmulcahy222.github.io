// Variables
const menu = Array.from({ length: 20 }, (_, i) => i + 1); // Creates an array from 1 to 20
const windowSize = 5; // Size of the sliding window
let windowStart = 0; // Start index of the sliding window
let selectedIndex = 0; // Index of the selected item

/**
 * Moves the selection left.
 * If the selection is at the start of the window, shift the window left.
 */
function moveLeft() {
  // If selected index is within the window, move it left
  if (selectedIndex > windowStart) {
    selectedIndex--;
  }
  // If selected index is at the left boundary of the window, shift the window left
  else if (windowStart > 0) {
    windowStart--;
    selectedIndex--;
  }
  displayWindow();
}

/**
 * Moves the selection right.
 * If the selection is at the end of the window, shift the window right.
 */
function moveRight() {
  // If selected index is within the window, move it right
  if (
    selectedIndex < windowStart + windowSize - 1 &&
    selectedIndex < menu.length - 1
  ) {
    selectedIndex++;
  }
  // If selected index is at the right boundary of the window, shift the window right
  else if (windowStart + windowSize < menu.length) {
    windowStart++;
    selectedIndex++;
  }
  displayWindow();
}

/**
 * Displays the current window and selected item in the console.
 */
function displayWindow() {
  console.log("Menu: ", menu.slice(windowStart, windowStart + windowSize));
  console.log("Selected: ", menu[selectedIndex]);
}

moveRight();
moveRight();
moveRight();
moveRight();
moveRight();
moveRight();
moveRight();
moveRight();
moveRight();
moveLeft();

displayWindow();
