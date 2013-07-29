// the Gesture filter filters the stream looking for legit gestures
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
  if (!callback) { throw new Error("Gesture filter requires a callback!") }
  this.callback = callback;
  this._processOptions(options);
  // always allow the first gesture
  this.lastGestureStart = 0;
}

// act on a frame -- if it matches, act on it, if not, do nothing
GestureFilter.prototype.process = function(frame) {
  // look for swipe gesture
  for (var i = 0; i < frame.gestures.length; i++) {
    var gesture = frame.gestures[i];
    if (this._checkCriteria(gesture)) {
      this.lastGestureStart = new Date();
      this.callback(new GestureAnalyzer(gesture));
    }
  }
}

GestureFilter.prototype._processOptions = function(options) {
  this.options = options || {};
  if (!options.type) { throw new Error("Gesture filter requires a gesture type option!") }

  // define a duplicate window in which the same gesture type is considered a
  // duplicate, but allow it to be turned off with 0
  if (this.options.duplicateWindow === undefined) {
    this.options.duplicateWindow = 400;
  }
}

GestureFilter.prototype._checkCriteria = function(gesture) {
  // check to see if it's the right gesture in the right state (if applicable)
  if (gesture.type != this.options.type) { return false }
  if (this.options.state && gesture.state != this.options.state) { return false };

  // * not sure why, but for some reason the sensor sometimes fires
  // repeated events of the same type (at least for swipe stop).
  // we want to ignore anything that happens less than 400ms since the
  // prior swipe, since that's presumably not a real event.
  // * this obviously doesn't apply for update gestures, which happen frequently
  // * for two-handed/finger gesture use, this could be refactored to track the
  // time for a given hand object
  return gesture.state == "update" ||
    !this.lastGestureStart ||
    (new Date() - this.lastGestureStart > this.options.duplicateWindow);
}

module.exports = GestureFilter;
