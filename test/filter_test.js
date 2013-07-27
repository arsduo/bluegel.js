var expect = require('expect.js');
var Filter = require("../lib/bluegel").Filter;

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
  this.loop = function(callback) {
    callback(that.frame);
  }
}

describe("Filter", function() {
  var filter;

  beforeEach(function() {
    Filter.types["test"] = TestFilter;
    filter = new Filter();
  })

  afterEach(function() {
    delete Filter.types["test"];
  })

  describe("constructor", function() {
    it("records the options", function() {
      var options = {a: 2};
      expect(new Filter(options).options).to.equal(options);
    })

    it("works with no specified options", function() {
      expect(new Filter().options).to.eql({});
    })
  })

  describe("on", function() {
    it("throws an exception for an unknown type", function() {
      expect(function() { filter.on("badType", function() {}) }).to.throwException();
    })

    it("is chainable", function() {
      expect(filter.on("gesture", function() {})).to.equal(filter);
    })
  })

  describe("drinkFromFirehose", function() {
    var callback, controller;

    beforeEach(function() {
      filter.on("test", function() { callback.apply(this, arguments) });
      controller = new TestController();
    })

    it("passes the frame to the callbacks", function() {
      var frame = controller.frame = {a: 3};
      callback = function(receivedFrame) {
        expect(receivedFrame).to.equal(frame);
      }
      filter.drinkFromFirehose(controller);
    })
  })
})
