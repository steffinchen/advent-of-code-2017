const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day17_input.txt');
  // var input = 'set a 1\nadd a 2\nmul a a\nmod a 5\nsnd a\nset a 0\nrcv a\njgz a -1\nset a 1\njgz a -2';
  console.log('part1', part1(input));
  //var input2 = 'snd 1\nsnd 2\nsnd p\nrcv a\nrcv b\nrcv c\nrcv d';
  console.log('part2', part2(input));
}

function part1(input) {
  var instructions = parseInput(input);
  var lastRecoveredSound;
  var lastSound;
  var nextInstrIndex = 0;
  var registers = initReg(instructions);
  while (!lastRecoveredSound && nextInstrIndex >= 0 && nextInstrIndex < instructions.length) {
    var instr = instructions[nextInstrIndex]
    if (instr.name === 'jgz') {
      var jump = jgz(registers, instr.params[0], instr.params[1]);
      nextInstrIndex += jump;
    } else {
      nextInstrIndex++;
      if (instr.name === 'snd') {
        lastSound = snd(registers, instr.params[0]);
      } else if (instr.name === 'add') {
        registers = add(registers, instr.params[0], instr.params[1]);
      } else if (instr.name === 'mul') {
        registers = mul(registers, instr.params[0], instr.params[1]);
      } else if (instr.name === 'mod') {
        registers = mod(registers, instr.params[0], instr.params[1]);
      } else if (instr.name === 'set') {
        registers = set(registers, instr.params[0], instr.params[1]);
      } else if (instr.name === 'rcv') {
        lastRecoveredSound = rcv(registers, instr.params[0], lastSound);
      } else {
        console.log('unknown instruction', instr)
      }
    }
  }
  return lastRecoveredSound;
}

function part2(input) {
  var instructions = parseInput(input);
  var registers = [
    initReg(instructions, 'p', 0),
    initReg(instructions, 'p', 1)
  ];
  var nextInstrIndex = [0, 0];
  var waiting = [false, false];
  var currProgId = 0;
  var queues = [[], []];
  var prog1SentCount = 0;
  //if both waiting, finish
  while (waiting[0] === false || waiting[1] === false) {
    var nextProgramId = (currProgId + 1) % 2;
    //while pr0 has instr
    while (waiting[currProgId] === false && nextInstrIndex[currProgId] >= 0
      && nextInstrIndex[currProgId] < instructions.length) {
      // exectue instrs
      var instr = instructions[nextInstrIndex[currProgId]];
      if (instr.name === 'rcv') {
        if (queues[currProgId].length > 0) {
          // if rcv, get from queue
          registers[currProgId][instr.params[0]] = queues[currProgId].shift();
                  nextInstrIndex[currProgId] += 1;
        } else {
          //if queue0 empty, set waiting0 = true, break
          waiting[currProgId] = true;
        }
      } else if (instr.name === 'snd') {
        if (currProgId === 1) {
          prog1SentCount++;
        }
        // put value into queue1
        var val = isNaN(instr.params[0])
          ? registers[currProgId][instr.params[0]]
          : instr.params[1];
        queues[nextProgramId].push(val);
        //if sending to 1, set waiting1 = false
        waiting[nextProgramId] = false;
        nextInstrIndex[currProgId]++;
      } else {
        var result = doInstr(instr, registers[currProgId], nextInstrIndex[currProgId]);
        nextInstrIndex[currProgId] = result.nextInstrIndex;
        registers[currProgId] = result.registers;
      }
    }
    currProgId = nextProgramId;
  }

  return prog1SentCount;
}

function doInstr(instr, registers, nextInstrIndex) {
  if (instr.name === 'jgz') {
    var jump = jgz(registers, instr.params[0], instr.params[1]);
    nextInstrIndex += jump;
  } else {
    nextInstrIndex++;
    if (instr.name === 'add') {
      registers = add(registers, instr.params[0], instr.params[1]);
    } else if (instr.name === 'mul') {
      registers = mul(registers, instr.params[0], instr.params[1]);
    } else if (instr.name === 'mod') {
      registers = mod(registers, instr.params[0], instr.params[1]);
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

function rcv(registers, x, lastSound) {
  if (isNaN(x)) {
    x = registers[x];
  }
  if (x === 0) {
    return;
  } else {
    return lastSound;
  }
}

function jgz(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  if (isNaN(x)) {
    x = registers[x];
  }
  if (x <= 0) {
    return 1;
  }
  return y;
}

function add(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  registers[x] += y;
  return registers;
}

function set(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  registers[x] = y;
  return registers;
}

function mod(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  registers[x] = registers[x] % y;
  return registers;
}

function mul(registers, x, y) {
  if (isNaN(y)) {
    y = registers[y];
  }
  registers[x] = registers[x] * y;
  return registers;
}

function snd(registers, x) {
  if (isNaN(x)) {
    x = registers[x];
  }
  return x;
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
