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

function part2() {
  var count = 0;
  var x = 93 * 100 + 100000;
   for (var n = x; n <= x + 17000; n += 17) {
       var d = 2;
       while (n % d !== 0) d++;
       if (n !== d) count++;
   }
   return count;
}

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
