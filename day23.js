const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day23_input.txt');
  // var input = 'set a 1\nadd a 2\nmul a a\nmod a 5\nsnd a\nset a 0\nrcv a\njgz a -1\nset a 1\njgz a -2';
  console.log('part1', part1(input));
  //var input2 = 'snd 1\nsnd 2\nsnd p\nrcv a\nrcv b\nrcv c\nrcv d';
  console.log('part2', part2(input));
}

function part1(input) {
  var instructions = parseInput(input);
  var nextInstrIndex = 0;
  var mulCount = 0;
  var registers = initReg(instructions);
  console.log(registers);
  while (nextInstrIndex >= 0 && nextInstrIndex < instructions.length) {
    var instr = instructions[nextInstrIndex];
    if (instr.name === 'mul') {
      mulCount++;
    }
    var result = doInstr(instr, registers, nextInstrIndex);
    registers = result.registers;
    nextInstrIndex = result.nextInstrIndex;
    //console.log('done', nextInstrIndex, instr, registers);
  }
  return mulCount;
}

function part2(input) {
  var count = 0;
  var start = 108100;
  var limit = 125100;
  var primes = getPrimes(start, limit);
  for (i = start; i <= limit; i += 17) {
    if (isPrime(primes, i)) {
      count++;
    }
  }
  return count;
}

function isPrime(primes, i){
  return _.indexOf(primes, i) > -1;
}

function getPrimes(start, n) {
  var a = {};
  for (i = start; i < n; i++) {
    a[i] = true;
  }

  for (i = start; i < n; i++) {
    if (a[i]) {
      for (j = i ^ 2; j < n; j += i) {
        a[j] = false;
      }
    }
  }

  var result = {};
  var keys = _.keys(a);
  for (var i = 0; i < keys.length; i++) {
    if (a[keys[i]] === true) {
      result[keys[i]] = true;
    }
  }
  return result;
}

// function part2(input) {
//   var instructions = parseInput(input);
//   var nextInstrIndex = 0;
//   var registers = initReg(instructions, 'a', 1);
//   console.log(registers);
//   var count = 0;
//   while (nextInstrIndex >= 0 && nextInstrIndex < instructions.length) {
//     if(count % 1000000000 === 0 ){
//       console.log((count / 1000000000) + 'Bil');
//     }
//     var hOld = registers['h'];
//     var instr = instructions[nextInstrIndex];
//     var result = doInstr(instr, registers, nextInstrIndex);
//     registers = result.registers;
//     nextInstrIndex = result.nextInstrIndex;
//     console.log('done', nextInstrIndex, instr, registers);
//     if (hOld != registers['h']) {
//       console.log('h changed', registers['h'], instr);
//     }
//     count++;
//   }
//   return registers['h'];
// }

function doInstr(instr, registers, nextInstrIndex) {
  if (instr.name === 'jnz') {
    var jump = jnz(registers, instr.params[0], instr.params[1]);
    nextInstrIndex += jump;
  } else {
    nextInstrIndex++;
    if (instr.name === 'sub') {
      registers = sub(registers, instr.params[0], instr.params[1]);
    } else if (instr.name === 'mul') {
      registers = mul(registers, instr.params[0], instr.params[1]);
    } else if (instr.name === 'set') {
      registers = set(registers, instr.params[0], instr.params[1]);
    } else {
      console.log('unknown instruction', instr)
    }
  }
  return {registers: registers, nextInstrIndex: nextInstrIndex};
}

function initReg(instrs, reg, defaultVal) {
  var registers = [];
  _.forEach(instrs, (instr) => {
    _.forEach(instr.params, (param) => {
      if (isNaN(param)) {
        registers[param] = 0;
      }
    });
  });
  if (reg) {
    registers[reg] = defaultVal;
  }
  return registers;
}

function jnz(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  if (isNaN(x)) {
    x = registers[x];
  }
  if (x === 0) {
    return 1;
  }
  return y;
}

function sub(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  registers[x] -= y;
  return registers;
}

function set(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  registers[x] = y;
  return registers;
}

function mul(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  registers[x] = registers[x] * y;
  return registers;
}

function parseInput(input) {
  var instructions = [];
  return _.map(_.split(_.trim(input), '\n'), (row) => {
    var s = _.split(row, ' ');
    var params = _.map(_.slice(s, 1), (param) => {
      if (isNaN(param)) {
        return param;
      } else {
        return parseInt(param);
      }
    });
    return {name: s[0], params: params};
  });
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
