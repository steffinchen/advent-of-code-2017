const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  console.log('part1', part1());
  console.log('part2', part2());
}

function part1(input) {
  var tape = new Map();
  var state = 'A';
  var currentSlot = 0;
  var limit =  12173597;
  for (var i = 0; i < limit; i++) {
    var result;
    if (state === 'A') {
      result = stateA(tape, currentSlot);
    } else if (state === 'B') {
      result = stateB(tape, currentSlot);
    } else if (state === 'C') {
      result = stateC(tape, currentSlot);
    } else if (state === 'D') {
      result = stateD(tape, currentSlot);
    } else if (state === 'E') {
      result = stateE(tape, currentSlot);
    } else if (state === 'F') {
      result = stateF(tape, currentSlot);
    }
    //console.log('result', result);
    tape = result.tape;
    currentSlot = result.currentSlot;
    state = result.currentState;
  }

  return _.reduce(Array.from(tape.keys()), (sum, key) =>{
    return sum + get(tape, key);
  }, 0);
}

function part2(input) {}

// In state A:
//   If the current value is 0:
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state B.
//   If the current value is 1:
//     - Write the value 0.
//     - Move one slot to the left.
//     - Continue with state C.
function stateA(tape, currentSlot) {
  var currValue = get(tape, currentSlot);
  if (currValue === 0) {
    set(tape, currentSlot, 1);
    return {
      tape: tape,
      currentSlot: currentSlot+1,
      currentState: 'B'
    };
  } else if (currValue === 1) {
    set(tape, currentSlot, 0);
    return {
      tape: tape,
      currentSlot: currentSlot-1,
      currentState: 'C'
    };
  }
}

// In state B:
//   If the current value is 0:
//     - Write the value 1.
//     - Move one slot to the left.
//     - Continue with state A.
//   If the current value is 1:
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state D.
function stateB(tape, currentSlot) {
  var currValue = get(tape, currentSlot);
  set(tape, currentSlot, 1);
  if (currValue === 0) {
    return {
      tape: tape,
      currentSlot: currentSlot-1,
      currentState: 'A'
    };
  } else if (currValue === 1) {
    return {
      tape: tape,
      currentSlot: currentSlot+1,
      currentState: 'D'
    };
  }
}
// In state C:
//   If the current value is 0:
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state A.
//   If the current value is 1:
//     - Write the value 0.
//     - Move one slot to the left.
//     - Continue with state E.
function stateC(tape, currentSlot) {
  var currValue = get(tape, currentSlot);
  if (currValue === 0) {
    set(tape, currentSlot, 1);
    return {
      tape: tape,
      currentSlot: currentSlot+1,
      currentState: 'A'
    };
  } else if (currValue === 1) {
    set(tape, currentSlot, 0);
    return {
      tape: tape,
      currentSlot: currentSlot-1,
      currentState: 'E'
    };
  }
}

// In state D:
//   If the current value is 0:
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state A.
//   If the current value is 1:
//     - Write the value 0.
//     - Move one slot to the right.
//     - Continue with state B.
function stateD(tape, currentSlot) {
  var currValue = get(tape, currentSlot);
  if (currValue === 0) {
    set(tape, currentSlot, 1);
    return {
      tape: tape,
      currentSlot: currentSlot+1,
      currentState: 'A'
    };
  } else if (currValue === 1) {
    set(tape, currentSlot, 0);
    return {
      tape: tape,
      currentSlot: currentSlot+1,
      currentState: 'B'
    };
  }
}
// In state E:
//   If the current value is 0:
//     - Write the value 1.
//     - Move one slot to the left.
//     - Continue with state F.
//   If the current value is 1:
//     - Write the value 1.
//     - Move one slot to the left.
//     - Continue with state C.
function stateE(tape, currentSlot) {
  var currValue = get(tape, currentSlot);
  if (currValue === 0) {
    set(tape, currentSlot, 1);
    return {
      tape: tape,
      currentSlot: currentSlot-1,
      currentState: 'F'
    };
  } else if (currValue === 1) {
    set(tape, currentSlot, 1);
    return {
      tape: tape,
      currentSlot: currentSlot-1,
      currentState: 'C'
    };
  }
}
// In state F:
//   If the current value is 0:
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state D.
//   If the current value is 1:
//     - Write the value 1.
//     - Move one slot to the right.
//     - Continue with state A.
function stateF(tape, currentSlot) {
  var currValue = get(tape, currentSlot);
  if (currValue === 0) {
    set(tape, currentSlot, 1);
    return {
      tape: tape,
      currentSlot: currentSlot+1,
      currentState: 'D'
    };
  } else if (currValue === 1) {
    set(tape, currentSlot, 1);
    return {
      tape: tape,
      currentSlot: currentSlot+1,
      currentState: 'A'
    };
  }
}

function get(tape, location) {
  if (_.isUndefined(tape.get(location))) {
    return 0;
  } else {
    return tape.get(location);
  }
}

function set(tape, location, value) {
  return tape.set(location, value);
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
