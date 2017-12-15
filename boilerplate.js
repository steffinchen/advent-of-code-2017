const fs = require('fs');
const _ = require('lodash');


main();

function main() {
  var input = getInput('dayXX_input.txt');
  console.log('part1', part1(input));
  console.log('part2', part2(input));
}

function part1(input){

}

function part2(input){

}

function  getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
