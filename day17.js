const fs = require('fs');
const _ = require('lodash');


main();

function main() {
  var input = 303;
  console.log('part1', part1(input));
  console.log('part2', part2(input));
}

function part1(input){
  var steps = input;
  var buffer = [0];
  var currPosition = 0;
  for(var i = 1; i<=2017; i++){
     currPosition = ((currPosition + steps) % buffer.length) + 1;
    buffer = [..._.slice(buffer, 0, currPosition), i, ..._.slice(buffer, currPosition, buffer.length)]
  }
  return buffer[currPosition+1];
}

function part2(input){
  var steps = input;
  var positionOfZero = 0;
  var bufferLength = 1;
  var numberWeWant;
  var currPosition = 0;
  for(var i = 1; i<=50000000; i++){
     currPosition = ((currPosition  + steps) % bufferLength) + 1;
    if (currPosition === positionOfZero+1){
      numberWeWant = i;
    }
    bufferLength++;
  }
  return numberWeWant;
}

function  getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
