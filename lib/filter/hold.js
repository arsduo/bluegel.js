var HoldFrameAnalyzer = require("./hold/frame_analyzer.js");

var HoldFilter = function(options, callback) {
  if (!callback) { throw new Error("Hold filter requires a callback!") }
  this.callback = callback;
  this._processOptions(options);
}

HoldFilter.prototype._processOptions = function(options) {
  this.options = options || {};

  options.maxDistance = options.maxDistance || 20;
  options.maxVelocity = options.maxVelocity || 60;
}

HoldFilter.prototype.process = function(frame) {
  var filteringCallback = function(gesture) {
    if (this._checkCriteria(gesture)) {
      this.callback(gesture);
    }
  }.bind(this);

  new HoldFrameAnalyzer(frame, this.options, filteringCallback).process();
}

HoldFilter.prototype._checkCriteria = function(gesture) {
  // check to see if it's the right gesture in the right state (if applicable)
  if (this.options.state && gesture.state != this.options.state) { return false };

  // later we can have checks for criteria like duration
  return true;
}

module.exports = HoldFilter;
