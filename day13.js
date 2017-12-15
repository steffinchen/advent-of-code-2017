const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day13_input.txt');
  //var input = '0: 3\n1: 2\n4: 4\n6: 4';
  console.log('part1', part1(input));
  console.log('part2', part2(input));
}

function part1(input) {
  var layers = parseInput(input);
  var caught = move(layers);

  return _.reduce(caught, (acc, val) => {
    return acc + (val.layer * val.depth);
  }, 0);
}

function part2(input) {
  var layers = parseInput(input);
  var delay = 0;
  var caught = moveWithDelay(layers, delay);
  while (caught) {
    delay++;
    caught = moveWithDelay(layers, delay);
  }
  return delay;
}

function moveWithDelay(layers, delay) {
  var pico = 0 + delay;
  var caught = [];
  for (var i = 0; i <= _.max(_.keys(layers)); i++) {
    //  console.log('layer', i, 'pico', pico);
    if (_.isUndefined(layers[i]) === false) {
      if (isAtTop(layers[i], pico)) {
        return true;
      }
    }
    pico++;
  }
  return false;
}

function move(layers) {
  var pico = 0;
  var caught = [];
  for (var i = 0; i <= _.max(_.keys(layers)); i++) {
    if (_.isUndefined(layers[i]) === false) {
      if (isAtTop(layers[i], pico)) {
        console.log('was caught in layer', i, ', depth=', layers[i], 'pico=', pico);
        caught.push({layer: i, depth: layers[i]});
      }
    }
    pico++;
  }
  return caught;
}

function isAtTop(depth, pico) {
  if (depth === 0 ) {
    return true;
  }
  if (depth === 1){
    return pico === 0 || _.isEven(pico);
  }
  return pico % (depth + depth-2) === 0;
}

function parseInput(input) {
  var rows = _.split(_.trim(input), '\n')
  var layers = {};
  _.forEach(rows, (row) => {
    var s = _.split(row, ': ');
    layers[parseInt(s[0])] = parseInt(s[1]);
  });
  return layers;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
