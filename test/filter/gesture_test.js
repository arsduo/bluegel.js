var expect = require('expect.js');
var sinon = require('sinon')
var GestureFilter = require("../../lib/bluegel").Filter.types.gesture;

var callback = function(analyzer) {
  return analyzer;
}

describe("Gesture Filter", function() {
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
    var frame;

    beforeEach(function() {
      frame = {gestures: [
        {type: "swipe", state: "stop"},
        {type: "swipe", state: "update"},
        {type: "swipe", state: "start"}
      ]}
    })

    // it("loops through the gestures, and if they pass it passes the frame on", function() {
    //   filter.process(frame);
    //   expect(callback.args.length).to.equal(frame.gestures.length);
    //   for (var i = 0; i < callback.args.length; i++) {
    //     expect(callback.args[i]).to.equal([gestures[i]]);
    //   }
    // })
  })
})
