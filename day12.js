const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  //var input = '0 <-> 2\n1 <-> 1\n2 <-> 0, 3, 4\n3 <-> 2, 4\n4 <-> 2, 3, 6\n5 <-> 6\n6 <-> 4, 5';
  var input = getInput('day12_input.txt');
  console.log('part1', part1(input));
  console.log('part2', part2(input));
}

function part1(input) {
  var graph = parseInput(input);
  var keys = _.keys(findAllInGroupWith(graph, 0));
  return keys.length;
}

function part2(input) {
    var graph = parseInput(input);
    var elements = _.keys(graph);
    var allPossibleGroups =  _.map(elements, (el) =>{
      return findAllInGroupWith(graph, el);
    });
    var unique = _.uniqWith(allPossibleGroups, _.isEqual);
    return unique.length;
}

function findAllInGroupWith(graph, src) {
  var group = {};
  var queue = [];
  queue.push(src);
  while (queue.length > 0) {
    var element = queue.shift();
    //console.log('element', element, 'children', graph[element]);
    group[element] = true;
    for (var index in graph[element]) {
      var child = graph[element][index];
      //console.log('child', child, 'inGroup', group[child]);
      if (_.isUndefined(group[child])) {
        queue.push(child);
        //console.log('queue', queue);
      }
      group[child] = true;
    }
  }
  return group;
}

function parseInput(input) {
  input = _.replace(input, ' ', '');
  var result = [];
  _.forEach(_.split(input, '\n'), (row) => {
    if (row != '') {
      var s = _.split(row, '<->');
      var index = parseInt(_.trim(s[0]));
      result[index] = _.map(_.split(s[1], ','), (val) => {
        return parseInt(_.trim(val));
      });
    }
  });
  return result;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
