const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day22_input.txt');
  // var input = '..#\n#..\n...\n';
  console.log('part1', part1(input));
  console.log('part2', part2(input));
}

function part1(input) {
  var grid = parseInput(input);
  var dir = 'U';
  var coord = {
    x: 0,
    y: 0
  };
  printGrid(grid, coord);
  var infections = 0;
  for (var i = 0; i < 10000; i++) {
    // console.log("===== Before ======");
    // printGrid(grid, coord);
    // console.log('=================');
    var cell = get(grid, coord);
    dir = getNewDirection(dir, cell);
    //console.log('new direction ', dir);
    var newCell;
    if (cell === '.') {
      infections++;
      newCell = '#';
    } else {
      newCell = '.';
    }
    set(grid, coord, newCell);
    coord = move(coord, dir);
    // console.log('new coord', coord);
    // console.log("===== After ======");
    // printGrid(grid, coord);
    // console.log('=================');
  }
  return infections;
}

function part2(input) {
  var grid = parseInput(input);
  var dir = 'U';
  var coord = {
    x: 0,
    y: 0
  };
  var infections = 0;
  for (var i = 0; i < 10000000; i++) {
    // console.log("===== Before ======");
    // printGrid(grid, coord);
    // console.log('=================');
    var cell = get(grid, coord);
    dir = getNewDirection(dir, cell);
    //console.log('new direction ', dir);
    var newCell;
    if (cell === '.') {
      newCell = 'W';
    } else if (cell === 'W') {
      newCell = '#';
      infections++;
    } else if (cell === '#') {
      newCell = 'F';
    } else if (cell === 'F') {
      newCell = '.';
    }
    set(grid, coord, newCell);
    coord = move(coord, dir);
    // console.log('new coord', coord);
    // console.log("===== After ======");
    // printGrid(grid, coord);
    // console.log('=================');
  }
  return infections;
}

function printGrid(grid, coord) {
  var xstart,
    ystart,
    xend,
    yend;
  _.forEach(Array.from(grid.keys()), (key) => {
    var s = _.split(key, '_');
    if (_.isUndefined(xstart) || parseInt(s[0]) < xstart) {
      xstart = parseInt(s[0]);
    }
    if (_.isUndefined(ystart) || parseInt(s[1]) < ystart) {
      ystart = parseInt(s[1]);
    }
    if (_.isUndefined(xend) || parseInt(s[0]) > xend) {
      xend = parseInt(s[0]);
    }
    if (_.isUndefined(yend) || parseInt(s[1]) > yend) {
      yend = parseInt(s[1]);
    }
  });

  for (var y = ystart; y <= yend; y++) {
    var line = '';
    for (var x = xstart; x <= xend; x++) {
      if (coord.x === x && coord.y === y) {
        line += '[';
      } else {
        line += ' '
      }
      line += get(grid, {
        x: x,
        y: y
      });
      if (coord.x === x && coord.y === y) {
        line += ']';
      } else {
        line += ' '
      }
    }
    console.log(line);
  }
}

function move(coord, dir) {
  if (dir === 'D') {
    return goDown(coord);
  } else if (dir === 'R') {
    return goRight(coord);
  } else if (dir === 'L') {
    return goLeft(coord);
  } else if (dir === 'U') {
    return goUp(coord);
  } else {
    console.log('unknown direction', dir);
  }
}

function getNewDirection(dir, cell) {
  var turnRight = {
    'U': 'R',
    'R': 'D',
    'D': 'L',
    'L': 'U'
  };
  var turnLeft = {
    'U': 'L',
    'L': 'D',
    'D': 'R',
    'R': 'U'
  };
  var reverse = {
    'U': 'D',
    'D': 'U',
    'R': 'L',
    'L': 'R'
  };
  if (cell === '#') {
    //turn right
    return turnRight[dir];
  } else if (cell === '.') {
    //turn left
    return turnLeft[dir];
  } else if (cell == 'W') {
    return dir;
  } else if (cell == 'F') {
    return reverse[dir];
  } else {
    console.log('unkown cell', cell)
  }
}

function parseInput(input) {
  var grid = new Map();
  var rows = _.split(_.trim(input), '\n');
  var start = 0 - Math.floor(rows.length / 2);
  var x,
    y = start;
  for (var i = 0; i < rows.length; i++) {
    x = start;
    for (var j = 0; j < rows[i].length; j++) {
      var coord = {
        x: x,
        y: y
      };
      set(grid, coord, rows[i][j]);
      x++;
    }
    y++;
  }
  return grid;
}

function get(grid, coord) {
  var cell = grid.get(coord.x + '_' + coord.y);
  if (_.isUndefined(cell)) {
    return '.';
  } else {
    return cell;
  }
}

function set(grid, coord, value) {
  return grid.set(coord.x + '_' + coord.y, value);
}

function goDown(coord) {
  // console.log('goDown');
  coord.y = coord.y + 1;
  return coord;
}

function goLeft(coord) {
  // console.log('goLeft');
  coord.x = coord.x - 1;
  return coord;
}
function goRight(coord) {
  // console.log('goRight');
  coord.x = coord.x + 1;
  return coord;
}

function goUp(coord) {
  // console.log('goUp');
  coord.y = coord.y - 1;
  return coord;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
