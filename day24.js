const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input = getInput('day24_input.txt');
  //var input = '0/48\n50/0\n50/10\n30/10\n48/5\n5/6\n6/7\n7/8';
  var all = buildBridges(input);
  console.log('part1', part1(all));
  console.log('part2', part2(all));
}

function buildBridges(input) {
  var pieces = parseInput(input);
  var first = {
    bridge: [
      {
        portA: 0,
        portB: 0
      }
    ],
    remaining: pieces,
    sum: 0
  };
  var queue = [first];
  var all = [];
  while (queue.length > 0) {
    var currBridge = queue.shift();
    var nextPieces = getNextPieces(currBridge);
    if (nextPieces.length === 0) {
      all.push(currBridge);
    }
    _.forEach(nextPieces, (nextPiece) => {
      var newBridge = _.cloneDeep(currBridge);
      newBridge.bridge.push(nextPiece);
      newBridge.remaining = _.filter(newBridge.remaining, (remainingPiece) => {
        return remainingPiece.id != nextPiece.id;
      });
      newBridge.sum = _.sumBy(newBridge.bridge, (piece) => {
        return piece.portA + piece.portB;
      });
      if (newBridge.remaining.length > 0) {
        queue.push(newBridge);
      } else {
        all.push(newBridge);
      }
    });
  }
  return all;
}

function part1(all) {
  var max = 0;
  _.forEach(all, (bridge) =>{
    if(bridge.sum > max){
      max = bridge.sum;
    }
  });
  return max;
  // return _.max(_.map(all, 'sum'));
}

function getNextPieces(bridge) {
  var port = _.last(bridge.bridge).portB;
  var next = _.filter(bridge.remaining, (piece) => {
    return port === piece.portA || port === piece.portB;
  });
  return _.map(next, (n) => {
    if (n.portA === port) {
      return n;
    } else {
      return {portA: n.portB, portB: n.portA, id: n.id};
    }
  });
}

function part2(all) {
  var maxLength = 0;
  var maxStrength = 0;
  _.forEach(all, (bridge) =>{
    if(bridge.bridge.length > maxLength){
      maxLength = bridge.bridge.length;
    }
  });
  _.forEach(all, (bridge)=>{
    if(bridge.bridge.length === maxLength){
      if(bridge.sum > maxStrength){
        maxStrength = bridge.sum;
      }
    }
  });
  return maxStrength;
    // return _.max(_.map(all, (bridge)=>{
    //   return bridge.bridge.length;
    // }));
}

function parseInput(input) {
  return _.map(_.split(_.trim(input), '\n'), (row, key) => {
    var s = _.map(_.split(row, '/'), (el) => {
      return parseInt(el);
    });
    return {id: key, portA: s[0], portB: s[1]};
  });
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
