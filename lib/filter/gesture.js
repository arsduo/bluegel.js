// this filters the stream looking for legit gestures
// right now, it's just looking at a single hand and sequential actions
// in the future, it can track the hands separately

// it takes two arguments:
// * options (what to look for, etc.)
// * a callback, which receives an analyzed Gesture (Analyzers.Gesture)
// and returns a function which you can pass to Leap.loop
//
// I expect this to get refactored significantly so that you can compose
// multiple filters together.
var GestureAnalyzer = require("../analyzers/gesture");

var GestureFilter = function(options, callback) {
  // need to validate that options.type and callback are provided
  this.options = options || {};
  // validate/default options should occur in a separate method
  this.options.duplicateWindow = this.options.duplicateWindow || 400;
  this.callback = callback;
  this.lastGestureStart = new Date();
}

// act on a frame -- if it matches, act on it, if not, do nothing
GestureFilter.prototype.process = function(frame) {
  // look for swipe gesture
  for (var i = 0; i < frame.gestures.length; i++) {
    var gesture = frame.gestures[i];
    if (gesture.type == this.options.type) {
      if (!this.options.state || gesture.state == this.options.state) {
        // not sure why, but for some reason the sensor sometimes fires
        // repeated events of the same type (at least for swipe stop).
        // we want to ignore anything that happens less than 400ms since the
        // prior swipe, since that's presumably not a real swipe event.
        if (new Date() - this.lastGestureStart < this.options.duplicateWindow) {
          continue;
        }
        else {
          this.lastGestureStart = new Date();
          this.callback(new GestureAnalyzer(gesture));
        }
      }
    }
  }
}

module.exports = GestureFilter;
