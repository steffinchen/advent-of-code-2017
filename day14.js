const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  //var input = 'flqrgnkx';
  var input = 'hwlqcszp';
  console.log('part1', part1(input));
  console.log('part2', part2(input));
}

function part1(input) {
  var grid = [];
  for (var i = 0; i < 128; i++) {
    var hash = getKnotHash(input + '-' + i);
    grid[i] = hashToBinary(hash);
  }
  return countUsed(grid);
}

function part2(input) {
  var grid = [];
  for (var i = 0; i < 128; i++) {
    var hash = getKnotHash(input + '-' + i);
    grid[i] = hashToBinary(hash);
  }

  grid = _.map(grid, (row)=>{
    return _.split(row, '');
  });

  var regions = 0;
  var queue = [];
  for(var row = 0; row<grid.length; row++){
    for(var col = 0; col<grid[row].length; col++){
      if(grid[row][col] === '1'){
        regions++;
        queue.push({row: row, col: col});
      }
      while(queue.length > 0){
        var coords = queue.shift();
        //check all neighbors
        remove(grid, coords.row+1, coords.col, queue);
        remove(grid, coords.row-1, coords.col, queue);
        remove(grid, coords.row, coords.col+1, queue);
        remove(grid, coords.row, coords.col-1, queue);
      }
    }
  }

  return regions;
}

function remove(grid, row, col, queue){
  if(row < 0 || col < 0 || row > 127 || col > 127) return;
  if(grid[row][col] === '1'){
      grid[row][col] = '0';
      queue.push({row: row, col: col});
  }
}

function countUsed(grid) {
  return _.reduce(grid, (acc, value) => {
    return acc + (value.match(/1/g) || []).length;
  }, 0);
}

function hashToBinary(hash) {
  return _.reduce(hash, (acc, value) => {
    //console.log(value);
    return acc + _.padStart(hexToBinary(value), 4, '0');
  }, '');
}

function hexToBinary(dec) {
  return parseInt(dec, 16).toString(2);
}

function getKnotHash(input) {
  const lengths = prepareInput(input);
  var pos = 0;
  var skip = 0;
  var list = _.range(0, 256);
  for (var i = 0; i < 64; i++) {
    var result = doHash(lengths, 255, pos, skip, list);
    pos = result.pos;
    skip = result.skip;
    list = result.list;
  }

  var dense = getDenseHash(list);
  return toHex(dense);
}

function getDenseHash(sparse) {
  return _.map(_.range(0, 16), (i) => {
    return _.reduce(_.slice(sparse, i * 16, i * 16 + 16), (acc, val) => {
      return acc ^ val;
    }, 0);
  });
}

function prepareInput(input) {
  var result = _.map(input, (c) => {
    return c.charCodeAt(0);
  })
  return _.concat(result, [17, 31, 73, 47, 23]);
}

function doHash(lengths, len, pos, skip, list) {
  for (var i = 0; i < lengths.length; i++) {
    //   Reverse the order of that length of elements in the list, starting with
    //the element at the current position.
    list = reverseSublist(list, pos, pos + lengths[i]);
    // Move the current position forward by that length plus the skip size.
    pos = pos + lengths[i] + skip;
    // Increase the skip size by one.
    skip++;
  }

  return {list: list, pos: pos, skip: skip};

}

function toHex(hash) {
  return _.reduce(hash, (acc, value) => {
    return acc + _.padStart(value.toString(16), 2, '0');
  }, '');
}

function reverseSublist(array, start, end) {
  if (start === end) {
    return array;
  }
  var l = array.length;
  start = start % l;
  end = end % l;
  var sublist;
  if (end <= start) {
    sublist = _.concat(_.slice(array, start, l), _.slice(array, 0, end));
  } else {
    sublist = _.slice(array, start, end);
  }
  sublist = _.reverse(sublist);
  //  console.log('reversed sublist', sublist);
  for (var i = 0; i < sublist.length; i++) {
    array[(start + i) % l] = sublist[i];
  }
  //console.log('reversed from ', start, ' to ', end, array);
  return array;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
