var TrackedHolds = require("./tracked_holds.js")

// a class for analyzing a specific frame
// being able to store and reference the frame in object instances is quite
// useful
var FrameAnalyzer = function(frame, options, callback) {
  this.frame = frame;
  this.options = options;
  this.callback = callback;
}

FrameAnalyzer.prototype.process = function() {
  var hand, gesture, passing, checkFnName;

  this._removeVanishedAppendages();
  for (var i = 0; i < this.frame.hands.length; i++) {
    hand = this.frame.hands[i];
    passing = true;
    for (var i = 0; i < this._holdChecks.length && passing; i++) {
      checkFnName = this._holdChecks[i];
      passing = passing && this[checkFnName](hand);
    }
    if (passing) {
      gesture = this._processActiveHold(hand);
      // we may not always publish gestures even if they're active
      // for instance, if they're below the minimum duration
      if (gesture) {
        this.callback(gesture);
      }
    }
    else if (TrackedHolds.storedHold(hand.id)) {
      // if we don't have a valid hold, we only want to fire a stopped event
      // if there's actually a hold being tracked
      // otherwise you'd fire events during non-hold movement
      this.callback(this._processStoppedHold(hand.id));
    }
  }
}

FrameAnalyzer.prototype._holdChecks = ["_checkVelocity", "_checkPosition"];

FrameAnalyzer.prototype._checkVelocity = function(hand) {
  var velocity = hand.palmVelocity;
  for (var i = 0; i < velocity.length; i++) {
    if (Math.abs(velocity[i]) > this.options.maxVelocity) {
      return false;
    }
  }
  return true;
}

FrameAnalyzer.prototype._checkPosition = function(hand) {
  var position = hand.palmPosition, distance;
  // sometime we get hands without position?!
  if (!position) { return false; }
  var originalData = TrackedHolds.storedHold(hand.id);
  if (!originalData) {
    // no position check for new gestures, obviously
    return true;
  }
  var originalPosition = originalData.hand.palmPosition;

  for (var i = 0; i < position.length; i++) {
    distance = position[i] - originalPosition[i];
    if (Math.abs(distance) > this.options.maxDistance) {
      return false;
    }
  }
  return true;
}

FrameAnalyzer.prototype._removeVanishedAppendages = function() {
  for (var id in TrackedHolds.holds("hand")) {
    if (!this.frame.hand(id)) {
      var stopGesture = this._processStoppedHold(id, "vanished");
      this.callback(stopGesture)
    }
  }
}

FrameAnalyzer.prototype._processStoppedHold = function(handId, reason) {
  var gesture = this._constructGesture(handId, "stop");
  TrackedHolds.flushHold(handId);
  return gesture;
}

FrameAnalyzer.prototype._processActiveHold = function(hand) {
  // first, make sure we're tracking this
  var hold = TrackedHolds.storedHold(hand.id);
  var minDuration = this.options.minDuration;
  if (!hold) {
    hold = TrackedHolds.storeHold(hand);
  }

  // now, see if we should publish an event
  if (!minDuration || new Date() - hold.timestamp > minDuration) {
    state = hold.published ? "update" : "start";
    hold.published = true;
    return this._constructGesture(hand.id, state);
  }
  else {
    // don't publish this yet
    return null;
  }
}

FrameAnalyzer.prototype._constructGesture = function(handId, state) {
  // storedHold should always be available,
  // but hand might not be (if the hand has vanished)
  var storedHold = TrackedHolds.storedHold(handId);
  var hand = this.frame.hand(handId);

  return {
    type: "hold",
    state: state,
    handIds: [handId],
    pointableIds: [],
    position: hand ? hand.palmPosition : null,
    startPosition: storedHold.hand.palmPosition,
    duration: new Date() - storedHold.timestamp,
    // id is, for now, useless -- later we'll have to wrap Frame.gesture()
    id: Math.round(Math.random() * 100000)
  }
}

module.exports = FrameAnalyzer;
