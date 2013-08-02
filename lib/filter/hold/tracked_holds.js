var TrackedHolds = {
  hands: {}
}

TrackedHolds.holds = function() {
  return this.hands;
}

TrackedHolds.storedHold = function(id) {
  return this.hands[id];
}

TrackedHolds.storeHold = function(hand) {
  // there's an easier way to do this but I'm on an airplane
  var handCopy = {};
  for (var attr in hand) {
    handCopy[attr] = hand[attr];
  }

  // track the initial information for the hand
  this.hands[hand.id] = {
    hand: handCopy,
    timestamp: new Date(),
    published: false
  };

  return this.hands[hand.id];
}

TrackedHolds.flushHold = function(id) {
  delete this.hands[id];
}

TrackedHolds.flushAll = function() {
  this.hands = {};
}

module.exports = TrackedHolds;
