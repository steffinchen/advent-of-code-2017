const fs = require('fs');
const _ = require('lodash');

main();

function main() {
  //var input = 'p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>\np=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>';
  var input = getInput('day20_input.txt');
  console.log('part1', part1(input));
  //var input = 'p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>\np=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>\np=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>\np=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>';
  console.log('part2', part2(input));
}

function part1(input) {
  var particles = parseInput(input);
  var closest;
  var closeCount = 0;
  //  console.log(particles);
  while (closeCount < 1000) {
    for (var j = 0; j < particles.length; j++) {
      particles[j] = doRotation(particles[j]);
    }
    var closestTmp = findClosest(particles);
    if (closest === closestTmp) {
      closeCount++;
    } else {
      closeCount = 0;
    }
    closest = closestTmp;
  }
  return closest;
}

function findClosest(particles) {
  var closest = {
    id: -1,
    dist: Infinity
  };
  for (var j = 0; j < particles.length; j++) {
    if (getManhattanDistance(particles[j]) < closest.dist) {
      closest.dist = getManhattanDistance(particles[j]);
      closest.id = j;
    }
  }
  return closest.id;
}

function part2(input) {
  var particles = parseInput(input);
  var collisionCountSame = 0;
  //  console.log(particles);
  while (collisionCountSame < 1000) {
    for (var j = 0; j < particles.length; j++) {
      particles[j] = doRotation(particles[j]);
    }
    var particlesLengthBefore = particles.length;
    particles = findAndRemoveCollisions(particles);
    if (particlesLengthBefore === particles.length) {
      collisionCountSame++;
    } else {
      collisionCountSame = 0;
    }
  }
  return particles.length;
}

function findAndRemoveCollisions(particles) {
  var count = {};

  _.forEach(particles, (p) => {
    var index = p.p.x + '_' + p.p.y + '_' + p.p.z;
    if (_.isUndefined(count[index])) {
      count[index] = 0;
    }
    count[index]++
  });
  var collisionFree =[];
  _.forEach(particles, (p) => {
    var index = p.p.x + '_' + p.p.y + '_' + p.p.z;
    if(count[index] === 1){
      collisionFree.push(p);
    }
  });
  return collisionFree;
}

function getManhattanDistance(particle) {
  return Math.abs(particle.p.x) + Math.abs(particle.p.y) + Math.abs(particle.p.z);
}

function doRotation(particle) {
  //   Increase the X velocity by the X acceleration.
  particle.v.x += particle.a.x;
  // Increase the Y velocity by the Y acceleration.
  particle.v.y += particle.a.y;
  // Increase the Z velocity by the Z acceleration.
  particle.v.z += particle.a.z;
  // Increase the X position by the X velocity.
  particle.p.x += particle.v.x;
  // Increase the Y position by the Y velocity.
  particle.p.y += particle.v.y;
  // Increase the Z position by the Z velocity.
  particle.p.z += particle.v.z;
  return particle;
}

function parseInput(input) {
  return _.map(_.split(_.trim(input), '\n'), (row) => {
    var parts = _.split(_.replace(row, '>', ''), ', ');
    var p = _.split(_.trim(_.replace(parts[0], 'p=<', '')), ',');
    var v = _.split(_.trim(_.replace(parts[1], 'v=<', '')), ',');
    var a = _.split(_.trim(_.replace(parts[2], 'a=<', '')), ',');
    return {
      p: {
        x: parseInt(p[0]),
        y: parseInt(p[1]),
        z: parseInt(p[2])
      },
      v: {
        x: parseInt(v[0]),
        y: parseInt(v[1]),
        z: parseInt(v[2])
      },
      a: {
        x: parseInt(a[0]),
        y: parseInt(a[1]),
        z: parseInt(a[2])
      }
    }
  });
}

function getInput(file) {
  return fs.readFileSync(file, 'utf8');
}
