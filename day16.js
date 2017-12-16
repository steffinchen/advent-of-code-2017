const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day16_input.txt');
  // var input = 's1,x3/4,pe/b';
  console.log('part1', part1(_.trim(input)));
  console.log('part2', part2(input));
}

function part1(input) {
  var programs = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p'
  ];

  var splitInput = _.split(input, ',');

  _.forEach(splitInput, (instr) => {
    if (_.startsWith(instr, 's')) {
      var x = parseInt(_.replace(instr, 's', ''));
      programs = spin(programs, x);
    } else if (_.startsWith(instr, 'x')) {
      var params = _.split(_.replace(instr, 'x', ''), '/');
      programs = exchange(programs, params[0], params[1]);
    } else if (_.startsWith(instr, 'p')) {
      var params = _.split(_.replace(instr, 'p', ''), '/');
      programs = partner(programs, params[0], params[1]);
    } else {
      console.log('unknown instruction ', instr);
    }
  });

  return _.join(programs, '');
}

function part2(input) {
  var programs = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p'
  ];

  var instructions = [];

  _.forEach(_.split(_.trim(input), ','), (instr) => {
    if (_.startsWith(instr, 's')) {
      var x = parseInt(_.replace(instr, 's', ''));
      instructions.push({no: 0, x: x});
    } else if (_.startsWith(instr, 'x')) {
      var params = _.split(_.replace(instr, 'x', ''), '/');
      instructions.push({no: 1, a: params[0], b: params[1]});
    } else if (_.startsWith(instr, 'p')) {
      var params = _.split(_.replace(instr, 'p', ''), '/');
      instructions.push({no: 2, a: params[0], b: params[1]});
    } else {
      console.log('unknown instruction ', instr);
    }
  });

  // max cycle
  //for (var i = 0; i < 19600; i++) {
  var seen = [];
  var i = 0;
  var reps = 1000000000;
  while (_.indexOf(seen, _.join(programs, '')) === -1 ) {
    seen.push(_.join(programs, ''));
    i++;
    for (var j = 0; j < instructions.length; j++) {
      var instr = instructions[j];
      if (instr.no === 0) {
        programs = spin(programs, instr.x);
      } else if (instr.no === 1) {
        programs = exchange(programs, instr.a, instr.b);
      } else if (instr.no === 2) {
        programs = partner(programs, instr.a, instr.b);
      }
    }
  }
  console.log('i', i, 'reps % i', reps % i);

  return seen[reps % i];
}

function spin(programs, x) {
  var end = _.slice(programs, programs.length - x, programs.length);
  var start = _.slice(programs, 0, programs.length - x);
  return _.concat(end, start);
}

function exchange(programs, x, y) {
  var tmp = programs[x];
  programs[x] = programs[y];
  programs[y] = tmp;
  return programs;
}

function partner(programs, a, b) {
  var indexA = _.indexOf(programs, a);
  var indexB = _.indexOf(programs, b);
  programs[indexA] = b;
  programs[indexB] = a;
  return programs;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
