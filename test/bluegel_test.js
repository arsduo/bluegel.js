var expect = require('expect.js');
var sinon = require('sinon');
var BlueGel = require("../lib/bluegel");

// a testing filter that uses the callback it's provided as the process method
// e.g. it always matches
var TestFilter = function(options, callback) {
  this.options = options;
  this.process = callback;
}

// fake leap motion controller
// takes an example frame to pass on
var TestController = function() {
  var that = this;
  // mock up accepting a loop callback function
  this.loop = function(callback) {
    that.callback = callback;
  }
  // and provide a mechanism to trigger it
  this.executeLoop = function(frame) {
    that.callback(frame);
  }
}

describe("Filter", function() {
  var filter, controller;

  beforeEach(function() {
    BlueGel.availableFilters["test"] = TestFilter;
    controller = new TestController();
    filter = new BlueGel(controller);
  })

  afterEach(function() {
    delete BlueGel.availableFilters["test"];
  })

  describe("constructor", function() {
    it("records the controller", function() {
      expect(filter.controller).to.be(controller);
    })

    it("records the options", function() {
      var options = {a: 2};
      expect(new BlueGel(new TestController(), options).options).to.equal(options);
    })

    it("works with no specified options", function() {
      expect(filter.options).to.eql({});
    })

    it("throws an error if no controller is specified", function() {
      expect(function() { new BlueGel() }).to.throwException();
    })
  })

  describe("on", function() {
    it("throws an exception for an unknown type", function() {
      expect(function() { filter.on("badType", function() {}) }).to.throwException();
    })

    it("is chainable", function() {
      expect(filter.on("swipe", {type: "swipe"}, function() {})).to.equal(filter);
    })
  })

  describe("processing events", function() {
    var callback, frame;

    beforeEach(function() {
      callback = sinon.spy();
      filter.on("test", callback);
      frame = controller.frame = {a: 3};
    })

    it("passes the frame to the callbacks", function() {
      callback.withArgs(frame);
      controller.executeLoop(frame);
      expect(callback.withArgs(frame).calledOnce).to.be(true)
    })

    it("works with two callbacks", function() {
      callback2 = sinon.spy();
      callback2.withArgs(frame);
      filter.on("test", callback2);
      controller.executeLoop(frame);
      expect(callback2.withArgs(frame).calledOnce).to.be(true)
    })
  })
})
