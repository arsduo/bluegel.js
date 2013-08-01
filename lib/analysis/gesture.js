var utils = require("../utils.js");

// inject the dominant movement method into the gesture
var GestureEnhancer = function(gesture) {
  gesture.dominantMovement = function() {
    return utils.dominantMovement(this.startPosition, this.position);
  }
  return gesture;
}

module.exports = GestureEnhancer;
