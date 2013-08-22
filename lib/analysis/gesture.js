var utils = require("../utils.js");

// inject the dominant movement method into the gesture
var GestureEnhancer = function(gesture, frame) {
  gesture.dominantMovement = utils.dominantMovement(gesture.startPosition, gesture.position);
  gesture.frame = frame
  return gesture;
}

module.exports = GestureEnhancer;
