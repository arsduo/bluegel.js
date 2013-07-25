// define the GestureAnalyzer analyzer
var GestureAnalyzer = function(rawGesture) {
  this.gesture = rawGesture;
}

GestureAnalyzer.prototype = new Object();

GestureAnalyzer.prototype.dominantMovement = function() {
  if (!this._dominantMovement) {
    // calculate the details of the movement
    // leap gestures positions are [x, y, z]
    var movements = [
      {direction: "x", distance: this.gesture.position[0] - this.gesture.startPosition[0]},
      {direction: "y", distance: this.gesture.position[1] - this.gesture.startPosition[1]},
      {direction: "z", distance: this.gesture.position[2] - this.gesture.startPosition[2]}
    ];

    this._dominantMovement = movements.sort(function(a, b) {
      // we sort the movement components by which one traverse the greatest
      // distance
      return Math.abs(a.distance) > Math.abs(b.distance) ? -1 : 1
    })[0];
  }
  return this._dominantMovement;
}

module.exports = GestureAnalyzer;
