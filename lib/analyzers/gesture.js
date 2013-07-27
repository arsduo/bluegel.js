var utils = require("../utils.js");

// define the GestureAnalyzer analyzer
var GestureAnalyzer = function(rawGesture) {
  this.gesture = rawGesture;
}

GestureAnalyzer.prototype = new Object();

GestureAnalyzer.prototype.dominantMovement = function() {
  return utils.dominantMovement(this.gesture.startPosition, this.gesture.position);
}

module.exports = GestureAnalyzer;
