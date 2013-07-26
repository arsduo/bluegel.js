var Filter = function(options) {
  this.options = options || {};
  this._filters = [];
}

Filter.Gesture = require('./filter/gesture.js');

// what types go to what filter objects
var filterMap = {
  "gesture": Filter.Gesture
};

Filter.prototype.on = function(type, optionsOrCallback, callback) {
  var filterType = filterMap[type];
  if (!filterType) {
    console.log("Unknown filter type %s", type);
    return;
  }

  var options = optionsOrCallback;
  if (typeof optionsOrCallback == "function") {
    options = {};
    callback = optionsOrCallback;
  }
  this._filters.push(new filterType(options, callback));
  return this;
}

Filter.prototype.filter = function(frame) {
  var filter;
  for (var i = 0; i < this._filters.length; i++) {
    filter = this._filters[i];
    filter.process(frame);
  }
}

Filter.prototype.drinkFromFirehose = function(controller) {
  var that = this;
  controller.loop(function(frame) { that.filter(frame) })
}

module.exports = Filter;
