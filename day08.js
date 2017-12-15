const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day08_input.txt');
  //  var input = "b inc 5 if a > 1\na inc 1 if b < 5\nc dec -10 if a >= 1\nc inc -20 if c == 10";

  var instructions = getInstructions(input);
  var registers = initRegisters(instructions);
  var result = doInstructions(instructions, registers);
  var part1 = _.max(Object.values(result.registers));
  console.log('part1', part1);
  console.log('part2', result.max);
}


function doInstructions(instructions, registers) {
  var max ;
  _.map(instructions, (instr) => {
    if (_.isUndefined(instr.condition) === false) {
      let operator = instr.op === 'inc'
        ? '+'
        : '-';
      let condSplit = _.split(instr.condition, ' ');
      let condition = eval('registers["' + condSplit[0] + '"]' + condSplit[1] + condSplit[2]);
      if (condition) {
        let result = eval(registers[instr.register] + ' ' + operator + ' ' + instr.amount);
        registers[instr.register] = result;
        if(result > max || _.isUndefined(max)){
          max = result;
        }
      }
    }
  });

  return {registers: registers, max: max};
}

// function doInstructions(instructions, registers) {
//   _.map(instructions, (instr) => {
//     if (_.isUndefined(instr.condition) === false) {
//       let operator = instr.op === 'inc'
//         ? '+'
//         : '-';
//       let condSplit = _.split(instr.condition, ' ');
//       let condition = eval('registers["' + condSplit[0] + '"]' + condSplit[1] + condSplit[2]);
//       if (condition) {
//         let result = eval(registers[instr.register] + ' ' + operator + ' ' + instr.amount);
//         registers[instr.register] = result;
//       }
//     }
//   });
//
//   return registers;
// }

function initRegisters(instructions) {
  var reg = {};
  _.map(instructions, (instr) => {
    reg[instr.register] = 0;
  });
  return reg;
}

function getInstructions(input) {
  let instr = [];
  _.map(_.split(input, '\n'), (row) => {
    var parts = _.split(row, ' if ');
    var instructions = _.split(parts[0], ' ');
    instr.push({
      register: instructions[0],
      op: instructions[1],
      amount: parseInt(instructions[2]),
      condition: parts[1]
    });
  });
  //  console.log(instr);
  return instr;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
