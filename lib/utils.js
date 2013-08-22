var Utils = {
  dominantMovement: function(startPosition, endPosition) {
    if (!startPosition || !endPosition) {
      throw(new Error("Unable to calculate dominantMovement for null position value!"));
    }

    // calculate the details of the movement
    // leap gestures positions are [x, y, z]
    var movements = [
      {direction: "x", distance: endPosition[0] - startPosition[0]},
      {direction: "y", distance: endPosition[1] - startPosition[1]},
      {direction: "z", distance: endPosition[2] - startPosition[2]}
    ];

    return movements.sort(function(a, b) {
      // we sort the movement components by which one traverse the greatest
      // distance
      return Math.abs(a.distance) > Math.abs(b.distance) ? -1 : 1
    })[0];
  }
}

module.exports = Utils;
