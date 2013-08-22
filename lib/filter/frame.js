// Unfiltered access to the frames the Leap Motion sensor puts out.

var FrameFilter = function(options, callback) {
  if (!callback) { throw new Error("Gesture filter requires a callback!") }
  this.callback = callback;
  this.options = options || {};
}

FrameFilter.prototype.process = function(frame) {
  this.callback(frame);
}

module.exports = FrameFilter;
