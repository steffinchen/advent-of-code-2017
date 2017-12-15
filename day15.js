const fs = require('fs');
const _ = require('lodash');

const factor_a = 16807;
const factor_b = 48271;
const mod = 2147483647;
const modLower16 = 65536;

main();

function main() {
  // var input_a = '65';
  // var input_b = '8921';
  var input_a = '277';
  var input_b = '349';

  console.log('part1', part1(input_a, input_b));
  console.log('part2', part2(input_a, input_b));
}

function part1(input_a, input_b) {
  var judge = 0;
  var val_a = input_a;
  var val_b = input_b;
  for (var i = 0; i < 40000000; i++) {
    val_a = getNextValue(val_a, factor_a, mod);
    val_b = getNextValue(val_b, factor_b, mod);

    if(val_a % modLower16 === val_b % modLower16){
      judge++;
    }
  }
  return judge;
}

function part2(input_a, input_b) {
  var judge = 0;
  var val_a = input_a;
  var val_b = input_b;

  var results_a = [];
  var results_b = [];

  for (var i = 0;results_a.length <= 5000000 || results_b.length <= 5000000; i++) {
    var val_a = getNextValue(val_a, factor_a, mod);
    var val_b = getNextValue(val_b, factor_b, mod);

    if (val_a % 4 === 0) {
      results_a.push(val_a % modLower16);
    }
    if (val_b % 8 === 0) {
      results_b.push(val_b % modLower16);
    }
  }

  for (var i = 0; i < results_a.length && i < results_b.length; i++) {
    if (results_a[i]  === results_b[i]) {
      judge++;
    }
  }
  return judge;
}

function getNextValue(currValue, factor, mod) {
  return (currValue * factor) % mod;
}
