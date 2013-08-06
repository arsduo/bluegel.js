// BlueGel: a library for making Leap Motion development easier.
var BlueGel = function(options) {
  this.options = options || {};
  this._filters = [];
}


// the core of BlueGel is the filtering -- you can request to get events when
// leap frames match certain criteria.
BlueGel.prototype.on = function(type, optionsOrCallback, callback) {
  var options = optionsOrCallback;
  if (typeof optionsOrCallback == "function") {
    options = {};
    callback = optionsOrCallback;
  }

  // always provide the type to the filter
  options.type = type;

  var filterType = this._getFilter(type);
  var filter = new filterType(options, callback);
  this._filters.push(filter);
  return this;
}

BlueGel.prototype._filterFrame = function(frame) {
  var filter;
  for (var i = 0; i < this._filters.length; i++) {
    filter = this._filters[i];
    filter.process(frame);
  }
}

BlueGel.prototype._getFilter = function(type) {
  var filterType = BlueGel.availableFilters[type];
  if (!filterType) {
    throw new Error("Unknown filter type " + type);
    return;
  }
  return filterType;
}

BlueGel.prototype.drinkFromFirehose = function(controller) {
  var that = this;
  controller.loop(function(frame) { that._filterFrame(frame) })
}

// what filter types are available, plus their
// exposed publicly so that you can add additional types
var gestureFilter = require('./filter/gesture.js');
BlueGel.availableFilters = {
  // built-in gestures
  swipe: gestureFilter,
  circle: gestureFilter,
  screenTap: gestureFilter,
  keyTap: gestureFilter,
  // simulated gestures/types
  hold: require('./filter/hold.js')
}

module.exports = BlueGel;
