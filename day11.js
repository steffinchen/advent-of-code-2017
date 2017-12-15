const fs = require('fs');
const _ = require('lodash');


main();

function main() {
  var input = getInput('day11_input.txt');
  //var input = 'se,sw,se,sw,se,sw';
  console.log('part1', part1(input));
  console.log('part2', findCoords2(input));
}

function findDistance(coords){
  var n = Math.abs(coords.y);
  var e = Math.abs(coords.x);

  return e + n-(0.5*e);
}

function part1(input){
  var coords = findCoords(input);
  console.log(coords);
  return findDistance(coords);
}


function findCoords(input){
  var movements = _.split(input, ',');
  var x = 0 ;
  var y = 0;
  for(var i = 0; i<movements.length; i++){
    var m = _.trim(movements[i]);
    if (m === 'n'){
      y++ ;
    } else if (m === 'nw'){
      y+=0.5;
      x--;
    } else if (m === 'ne'){
      y+=0.5;
      x++;
    } else if (m === 'se'){
      y-=0.5;
      x++;
    } else if (m === 's'){
      y--;
    } else if (m === 'sw'){
      y-=0.5;
      x--;
    } else if (m === 'se'){
      y-=0.5;
      x++;
    } else {
      console.log('illegal movement ', m);
    }
  }
  return {x:x, y:y};
}

function findCoords2(input){
  var movements = _.split(input, ',');
  var x = 0 ;
  var y = 0;
  var max = 0;
  for(var i = 0; i<movements.length; i++){
    var m = _.trim(movements[i]);
    if (m === 'n'){
      y++ ;
    } else if (m === 'nw'){
      y+=0.5;
      x--;
    } else if (m === 'ne'){
      y+=0.5;
      x++;
    } else if (m === 'se'){
      y-=0.5;
      x++;
    } else if (m === 's'){
      y--;
    } else if (m === 'sw'){
      y-=0.5;
      x--;
    } else if (m === 'se'){
      y-=0.5;
      x++;
    } else {
      console.log('illegal movement ', m);
    }
    var dist = findDistance({x:x, y:y});
    if(dist > max){
      max = dist;
    }
  }
  return max;
}

function  getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
