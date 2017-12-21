const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day21_input.txt');
  //var input = '../.# => ##./#../...\n.#./..#/### => #..#/..../..../#..#';

  var parsed = parseInput(input);
  var rules2 = parsed.rules2;
  var rules3 = parsed.rules3;


  console.log('part1', doWork(rules2, rules3, 5));
  console.log('part2', doWork(rules2, rules3, 18));
}

function doWork(rules2, rules3, iterations) {
  var picture = ['.#.', '..#', '###'];

  for (var i = 0; i < iterations; i++) {
    var n;
    var rulebook;
    var expectedSize = 0;
    if (picture.length % 2 === 0) {
      n = 2;
      rulebook = rules2;
      expectedSize = picture.length / 2 + picture.length;
    } else {
      n = 3;
      rulebook = rules3;
      expectedSize = picture.length / 3 + picture.length;
    }
    var chunks = chunkPicture(picture, n);
    //  console.log('chunks', chunks);
    var matches = [];
    for (var row = 0; row < chunks.length; row++) {
      if (_.isUndefined(matches[row])) {
        matches[row] = [];
      }
      for (var col = 0; col < chunks[row].length; col++) {
        //console.log('chunks', chunks[j]);
        matches[row][col] = findMatch(chunks[row][col], rulebook);
        if (_.isUndefined(matches[row][col])) {
          console.log('no matches found', chunks[row][col], rulebook);
          return;
        }
      }
    }

    picture = putTogether(matches, n + 1);
    // console.log(i);
    //console.log('picture', picture);
    if (expectedSize != picture.length) {
      console.log('picture has the wrong size', picture.length, 'expected', expectedSize);
      return;
    }

  }
  var count = 0;
  for (var row = 0; row < picture.length; row++) {
    for (var col = 0; col < picture.length; col++) {
      if (picture[row][col] === '#') {
        count++;
      }
    }
  }
  return count;
}

function part2(input) {}

function putTogether(chunks, n) {
  if (chunks.length === 1) {
    return chunks[0][0];
  }
  var result = [];

  for (var i = 0; i < chunks.length; i++) {
    for (var j = 0; j < chunks[i].length; j++) {
      for (var row = 0; row < chunks[i][j].length; row++) {
        var resultRow = i * n + row;
        if (_.isUndefined(result[resultRow])) {
          result[resultRow] = [];
        }
        result[resultRow] = _.join(_.concat(result[resultRow], chunks[i][j][row]), '');
      }
    }
  }
  return result;
}

function chunkPicture(pic, length) {
  var chunks = [];
  for (var i = 0; i < pic.length / length; i++) {
    for (var j = 0; j < pic.length / length; j++) {
      if (_.isUndefined(chunks[i])) {
        chunks[i] = [];
      }
      var chunk = [];
      for (var row = 0; row < length; row++) {
        chunk[row] = [];
        for (var col = 0; col < length; col++) {
          //  console.log('chunk i_j', i,j, row + (i*length), col + (j*length));
          chunk[row][col] = pic[row + (i * length)][col + (j * length)];
        }
      }
      chunks[i][j] = chunk;
    }
  }
  return chunks;
}

function findMatch(picture, rules) {
  var pictureHash = _.join(_.map(picture, (row) => {
    return _.join(row, '');
  }), '/');
  return rules[pictureHash];
}

/**
* Takes an array and returns an array
* of all possible permutations as strings,
* where the rows are joined by '/'.
*/
function permutePattern(array) {
  var hash = _.join(array, '/');
  var result = {
    [hash]: true
  };
  var hasMore = true;
  var queue = [array];
  while (queue.length > 0) {
    var a = queue.shift();
    var rotated = rotate(a);
    var rotatedHash = _.join(rotated, '/');
    if (_.isUndefined(result[rotatedHash])) {
      result[rotatedHash] = true;
      queue.push(rotated);
    }
    // rotated = rotate(rotated);
    // var rotatedHash = _.join(rotated, '/');
    // if (_.isUndefined(result[rotatedHash])) {
    //   result[rotatedHash] = true;
    //   queue.push(rotated);
    // }
    var rotated = flipHor(a);
    var rotatedHash = _.join(rotated, '/');
    if (_.isUndefined(result[rotatedHash])) {
      result[rotatedHash] = true;
      queue.push(rotated);
    }
    var rotated = flipVert(a);
    var rotatedHash = _.join(rotated, '/');
    if (_.isUndefined(result[rotatedHash])) {
      result[rotatedHash] = true;
      queue.push(rotated);
    }
  }
  return _.keys(result);
}

function rotate(array) {
  array = _.map(array, (row) => {
    return _.split(row, '');
  });
  array = _.zip.apply(_, array);
  return _.map(array, row => {
    return _.join(row, '');
  });
}

function flipHor(array) {
  var result = _.clone(array);
  result[0] = array[array.length - 1];
  result[result.length - 1] = array[0];
  return result;
}

function flipVert(array) {
  return _.map(array, (row) => {
    return _.join([
      row[row.length - 1],
      ..._.slice(row, 1, row.length - 1),
      row[0]
    ], '');;
  });
}

function parseInput(input) {
  var rules2 = [];
  var rules3 = [];

  _.forEach(_.split(_.trim(input), '\n'), (row) => {
    var parts = _.split(row, ' => ');
    var rule_result = _.split(parts[1], '/');
    var initialPattern = _.split(parts[0], '/');
    var allPatterns = permutePattern(initialPattern);
    if (initialPattern.length === 2) {
      _.forEach(allPatterns, (pattern) => {
        rules2[pattern] = rule_result;
      });
    } else {
      _.forEach(allPatterns, (pattern) => {
        rules3[pattern] = rule_result;
      });
    }
  });
  return {rules2: rules2, rules3: rules3};
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
