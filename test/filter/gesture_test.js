var expect = require('expect.js');
var sinon = require('sinon')
var BlueGel = require("../../lib/bluegel")
var GestureFilter = BlueGel.Filter.types.gesture;

var callback = function(gesture) {
  return gesture;
}

describe("Gesture filter", function() {
  var options, callback, filter;

  beforeEach(function() {
    options = {type: "swipe"};
    callback = sinon.spy();
    filter = new GestureFilter(options, callback);
  })

  describe("constructor", function() {
    it("sets the options provided", function() {
      var options = {type: "circle", duplicateWindow: 2, a: 3};
      var filter = new GestureFilter(options, callback);
      expect(filter.options).to.have.property("a", 3);
      expect(filter.options).to.have.property("type", "circle");
      expect(filter.options).to.have.property("duplicateWindow", 2);
    })

    it("defines the duplicateWindow if not provided", function() {
      expect(filter.options).to.have.property("duplicateWindow", 400);
    })

    it("allows a duplicate window of 0", function() {
      options.duplicateWindow = 0;
      expect(new GestureFilter(options, callback).options).to.have.property("duplicateWindow", 0);
    })

    it("saves the callback", function() {
      expect(filter.callback).to.equal(callback);
    })

    it("throws an exception if no callback is provided", function() {
      expect(function() { new GestureFilter(options) }).to.throwException();
    })

    it("throws an exception if no type is provided", function() {
      delete options.type;
      expect(function() { new GestureFilter(options, callback) }).to.throwException();
    })
  })

  describe("process", function() {
    var frame, gesture;

    beforeEach(function() {
      frame = {gestures: [
        {type: "swipe", state: "stop"},
        {type: "swipe", state: "start"}
      ]};
      gesture = frame.gestures[0];
    })

    it("loops through the gestures, passing the analyzed first matching one on", function() {
      filter.process(frame);
      expect(callback.calledOnce).to.be(true);
      var args = callback.firstCall.args
      expect(args).to.eql([gesture]);
      expect(args[0].dominantMovement).to.be.ok();
    })

    it("always passes on update events", function() {
      var updateGesture = {type: "swipe", state: "update"};
      frame.gestures.push(updateGesture);
      filter.process(frame);
      expect(callback.calledTwice).to.be(true);
      expect(callback.secondCall.args).to.eql([updateGesture]);
    })

    it("doesn't pass on events within the time window", function() {
      var clock = sinon.useFakeTimers();
      filter.process(frame);
      var callCount = callback.callCount;
      clock.tick(filter.options.duplicateWindow - 1);
      filter.process(frame);
      expect(callback.callCount).to.be(callCount);
      clock.restore();
    })

    it("will pass on events once the time window passes", function() {
      var clock = sinon.useFakeTimers();
      filter.process(frame);
      var callCount = callback.callCount;
      clock.tick(filter.options.duplicateWindow + 1);
      filter.process(frame);
      expect(callback.callCount).to.be(callCount + 1);
      clock.restore();
    })
  })
})
