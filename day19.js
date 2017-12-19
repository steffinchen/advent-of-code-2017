const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day19_input.txt');
  // var input = '    |      \n    |  +--+   \n    A  |  C   \nF---|----E|--+\n    |  |  |  D\n    +B-+  +--+';
  var result = part1(input);
  console.log('part1', result.letters);
  console.log('part2', result.steps);
}

function part1(input) {
  var grid = parseInput(input);
  var start = _.indexOf(grid[0], '|');
  var coord = {
    row: 0,
    col: start
  };
  var dir = 'D'; //U, L, R
  var nextChar = grid[coord.row][coord.col];
  var letters = '';
  var steps = 1;
  while (nextChar != ' ' && nextChar != false && dir != false) {
    //collect letters
    steps++;
    var letter = grid[coord.row][coord.col];
    if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90) {
      letters += letter;
    }

    if (nextChar != '+') {
      coord = getNextCoord(coord, dir);
      // console.log(coord);
      nextChar = getNextChar(grid, coord, dir);
    } else {
      coord = getNextCoord(coord, dir);
      steps++;
      // console.log(coord);
      dir = findNextDir(grid, coord, dir);
      // console.log('new dir', dir);
      coord = getNextCoord(coord, dir);
      // console.log(coord);
      nextChar = getNextChar(grid, coord, dir);
    }
  }
  var letter = grid[coord.row][coord.col];
  if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90) {
    letters += letter;
  }
  return {letters: letters, steps: steps};
}

function findNextDir(grid, coord, dir) {
  if (dir === 'D' || dir === 'U') {
    if (getNextChar(grid, coord, 'R') != ' ') {
      return 'R';
    } else if (getNextChar(grid, coord, 'L') != ' ') {
      return 'L';
    } else {
      return false;
    }
  } else if (dir === 'R' || dir === 'L') {
    if (getNextChar(grid, coord, 'U') != ' ') {
      return 'U';
    }
    if (getNextChar(grid, coord, 'D') != ' ') {
      return 'D';
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function getNextCoord(coord, dir) {
  var row = coord.row;
  var col = coord.col;
  if (dir === 'D') {
    row = row + 1;
  } else if (dir === 'U') {
    row = row - 1;
  } else if (dir === 'R') {
    col = col + 1;
  } else if (dir === 'L') {
    col = col - 1;
  }
  return {row: row, col: col};
}

function getNextChar(grid, coord, dir) {
  var nextCoord = getNextCoord(coord, dir);
  if (nextCoord == false) {
    return false;
  }
  var row = nextCoord.row;
  var col = nextCoord.col;
  if (row < 0 || col < 0 || row >= grid.length || col >= grid[row].length) {
    console.log('coords out of bound', row, col);
    return false;
  }
  return grid[row][col];
}

function parseInput(input) {
  var grid = [];
  _.map(_.split(input, '\n'), (row, key) => {
    if (row != '') {
      grid[key] = _.map(_.split(row, ''), (char) => {
        return char;
      });
    }
  });
  return grid;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
