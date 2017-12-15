const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  var input_p1 = [102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216];
  //var input = '1,2,3';
  var result = part1(input_p1, 255);
  console.log('part1', result.list[0] * result.list[1]);

  var input = '102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216';
  //var input = 'AoC 2017';
  //var p2Expected = '33efeb34ea91902bb2f59c9920caa6cd';
  var p2 = part2(input);
  console.log('part2', p2, p2.length);
}

function part2(input) {
  const lengths = prepareInput(input);
  var pos = 0;
  var skip = 0;
  var list = _.range(0, 256);
  for (var i = 0; i < 64; i++) {
    var result = doHash(lengths, 255, pos, skip, list);
    pos = result.pos;
    skip = result.skip;
    list = result.list;
  }

  var dense = getDenseHash(list);
  console.log('dense', dense);
  return toHex(dense);
}

function toHex(hash){
  return _.reduce(hash, (acc, value)=>{
    return acc + _.padStart(value.toString(16), 2, '0');
  }, '');
}

function getDenseHash(sparse) {
  return  _.map(_.range(0, 16), (i) => {
    return _.reduce(_.slice(sparse, i*16, i * 16 + 16), (acc, val) => {
      return acc ^ val;
    }, 0);
  });
}

function prepareInput(input) {
  var result = _.map(input, (c) => {
    return c.charCodeAt(0);
  })
  return _.concat(result, [17, 31, 73, 47, 23]);
}

function part1(lengths, len) {
  return doHash(lengths, len, 0, 0, _.range(0, len + 1));
}

function doHash(lengths, len, pos, skip, list) {
  for (var i = 0; i < lengths.length; i++) {
    //   Reverse the order of that length of elements in the list, starting with
    //the element at the current position.
     list = reverseSublist(list, pos, pos + lengths[i]);
    // Move the current position forward by that length plus the skip size.
    pos = pos + lengths[i] + skip;
    // Increase the skip size by one.
    skip++;
  }

  return {
    list: list,
    pos: pos,
    skip: skip
  };

}

function reverseSublist(array, start, end) {
  if (start === end) {
    return array;
  }
  var l = array.length;
  start = start % l;
  end = end % l;
  var sublist;
  if (end <= start) {
    sublist = _.concat(_.slice(array, start, l), _.slice(array, 0, end));
  } else {
    sublist = _.slice(array, start, end);
  }
  sublist = _.reverse(sublist);
  //  console.log('reversed sublist', sublist);
  for (var i = 0; i < sublist.length; i++) {
    array[(start + i) % l] = sublist[i];
  }
  //console.log('reversed from ', start, ' to ', end, array);
  return array;
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
