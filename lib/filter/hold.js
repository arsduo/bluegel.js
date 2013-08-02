var HoldFrameAnalyzer = require("./hold/frame_analyzer");
var TrackedHolds = require("./hold/tracked_holds");

var HoldFilter = function(options, callback) {
  if (!callback) { throw new Error("Hold filter requires a callback!") }
  this.callback = callback;
  this._processOptions(options);
}

HoldFilter.prototype._processOptions = function(options) {
  this.options = options || {};

  options.maxDistance = options.maxDistance || 20;
  options.maxVelocity = options.maxVelocity || 60;
  // minimum duration by default 1 second
  options.minDuration = typeof(options.minDuration) == "undefined" ? 1000 : options.minDuration;
}

HoldFilter.prototype.process = function(frame) {
  var filteringCallback = function(gesture) {
    if (this._checkCriteria(gesture)) {
      // if this is a hold that just hit its duration limit, override the state
      // to update
      this.callback(gesture);
    }
  }.bind(this);

  new HoldFrameAnalyzer(frame, this.options, filteringCallback).process();
}

HoldFilter.prototype._checkCriteria = function(gesture) {
  // check to see if it's the right gesture in the right state (if applicable)
  if (this.options.state && gesture.state != this.options.state) { return false };

  return true;
}

module.exports = HoldFilter;
