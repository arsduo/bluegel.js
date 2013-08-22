var expect = require('expect.js');
var Analysis = require("../../lib/analysis");

describe("gesture analysis enhancements", function() {
  var gesture, frame;

  beforeEach(function() {
    gesture = {
      position: [1, 2, 3],
      startPosition: [0, 0, 3]
    };
    frame = {a: 2};
  })

  it("returns the gesture", function() {
    expect(Analysis.enhanceGesture(gesture, frame)).to.be(gesture);
  })

  it("adds a dominantMovement method that calculates the dominant movement", function() {
    Analysis.enhanceGesture(gesture, frame);
    expect(gesture.dominantMovement).to.eql({direction: "y", distance: 2});
  })

  it("provides a reference back to the frame", function() {
    Analysis.enhanceGesture(gesture, frame);
    expect(gesture.frame).to.be(frame);
  })
})
