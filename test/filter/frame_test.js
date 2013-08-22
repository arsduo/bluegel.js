var expect = require('expect.js');
var sinon = require('sinon')
var FrameFilter = require("../../lib/filter/frame");

var callback = function(gesture) {
  return gesture;
}

describe("the frame filter", function() {
  it("calls through with the frame", function() {
    var frame = {a: 2};
    var callback = sinon.spy();
    var filter = new FrameFilter({}, callback);
    filter.process(frame);
    expect(callback.calledOnce).to.be(true);
    expect(callback.firstCall.args).to.eql([frame]);
  })
})

