var expect = require('expect.js');
var Analysis = require("../../lib/bluegel").Analysis;

describe("gesture analysis enhancements", function() {
  var gesture;

  beforeEach(function() {
    gesture = {
      position: [1, 2, 3],
      startPosition: [0, 0, 3]
    };
  })

  it("adds a dominantMovement method that calculates the dominant movement", function() {
    Analysis.enhanceGesture(gesture);
    expect(gesture.dominantMovement()).to.eql({direction: "y", distance: 2});
  })
})
