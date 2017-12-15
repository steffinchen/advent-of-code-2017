const fs = require('fs');
const _ = require('lodash');

main();

function main() {
    var input = getInput('day09_input.txt');
  //var input = '{{{},{},{{}}}}';
  //var input = '{{<!>},{<!>},{<!>},{<a>}}';
  //var input = '<{o"i!a,<{i<a>';
  var result = takeOutGarbage(input);
  //console.log('clean', result.clean);
  console.log('part1', part1(result.clean));
  console.log('part2', result.count);
}

function part1(input) {
  return findGroups(input);
}

function takeOutGarbage(input) {
  var count = 0;
  var isGarbage = false;
  var ignoreNext = false;
  var clean = '';
  for (var i = 0; i < input.length; i++) {
    if (ignoreNext) {
      ignoreNext = false;
    } else if (input[i] === '!') {
      ignoreNext = true;
    } else {
      if (isGarbage === false && input[i] === '<') {
        isGarbage = true;
        count--;
      }
      if (!isGarbage) {
        clean += input[i];
      } else  if (isGarbage && input[i] != '>'){
        //console.log('garbage', input[i]);
        count++;
      }
      if (input[i] === '>') {
        isGarbage = false;
      }
    }
  }
  return {clean: clean, count: count};
}

function findGroups(input) {
  var score = 0;
  var sum = 0;
  for (var i = 0; i < input.length; i++) {
    if (input[i] === '{') {
      score++;
    } else if (input[i] === '}') {
      sum += score;
      score--;
    }
  }
  return sum;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
