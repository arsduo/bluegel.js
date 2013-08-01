var expect = require('expect.js');
var sinon = require('sinon')
var BlueGel = require("../../lib/bluegel")
var HoldFilter = BlueGel.Filter.types.gesture;
var Analysis = BlueGel.Analysis;

var callback = function(gesture) {
  return gesture;
}

describe("Hold filter", function() {
  var options, callback, filter, frame, hand, clock;

  beforeEach(function() {
    options = {
      type: "hold",
      maximumVelocity: 6,
      maximumMovement: 8
    };

    callback = sinon.spy();
    filter = new HoldFilter(options, callback);
    hand = {
      id: Math.random(),
      position: [1, 2, 3],
      palmVelocity: [0.5, 0.3, 0.4]
    }

    frame = {
      hands: [hand]
    }

    clock = sinon.useFakeTimers();
  })

  afterEach(function() {
    clock.restore();
  })

  describe("process", function() {
    describe("if all requirements pass", function() {
      beforeEach(function() {
        filter.process(frame);
      })

      describe("the callback", function() {
        var gesture;
        beforeEach(function() {
          gesture = callback.firstArgs[0];
        })

        it("calls the callback if all requirements pass", function() {
          expect(callback.called).to.be(true);
        })

        it("includes the hand of the gesture", function() {
          expect(gesture).to.have.property("handIds", [hand]);
        })

        it("includes no fingers", function() {
          expect(gesture).to.have.property("pointableIds", []);
        })

        it("sets the type appropriately", function() {
          expect(gesture.type).to.be("hold");
        })

        it("includes other gesture properties", function() {
          var properties = ["type", "state", "position", "startPosition", "duration", "id"];
          for (var i = 0; i < properties.length; i++) {
            expect(gesture).to.have.property(properties[i]);
          }
        })
      })

      describe("if no hold is being tracked", function() {
        it("starts a hold if there is none", function() {
          filter.process(frame);
          expect(callback.firstCall.args[0].state).to.equal("start");
        })
      })

      describe("if there's already a hold", function() {
        beforeEach(function() {
          filter.process(frame);
        })

        it("sends an update", function() {
          filter.process(frame);
          expect(callback.callCount).to.be(2);
          expect(gesture.state).to.equal("update");
        })

        it("updates the position", function() {
          var originalLocation = frame.position;
          frame.position = [
            originalLocation[0] + 0.1,
            originalLocation[1] + 0.1,
            originalLocation[2] + 0.1
          ];
          var gesture = callback.lastCall.args[0];
          expect(gesture.startPosition).to.eql(originalLocation);
          expect(gesture.position).to.eql(frame.position);
        })

        it("updates the duration", function() {
          filter.process(frame);
          var ticks = 3;
          clock.tick(3);
          filter.process(frame);
          expect(callback.lastCall.args[0].duration).to.equal(3);
        })
      })
    })

    describe("if velocity fails", function() {
      describe("if no hold is being tracked", function() {
        beforeEach(function() {
          frame.velocity = [100, 100, 100];
        })

        it("doesn't start a gesture if there is none", function() {
          filter.process(frame);
          expect(callback.called).to.be(false);
        })

        it("also catches negative velocities", function() {
          frame.velocity = [-100, 0, 0];
          filter.process(frame);
          expect(callback.called).to.be(false);
        })
      })

      describe("if a hold is being tracked", function() {
        beforeEach(function() {
          frame.process(frame);
          frame.velocity = [100, 100, 100];
        })

        it("fires a stopped event the hold was started", function() {
          filter.process(frame);
          expect(callback.lastCall.args[0].state).to.equal("stop");
        })

        it("clears the tracked hold", function() {
          filter.process(frame);
          frame.velocity = [0, 0, 0];
          // see if after a hold stop, we trigger a hold start, not an update
          filter.process(frame);
          expect(callback.lastCall.args.state).to.equal("start");
        })
      })
    })

    describe("if position fails", function() {
      describe("if no hold is being tracked", function() {
        beforeEach(function() {
          frame.position = [100, 100, 100];
        })

        it("doesn't start a gesture if there is none", function() {
          filter.process(frame);
          expect(callback.called).to.be(false);
        })

        it("also catches negative positions", function() {
          frame.velocity = [-100, 0, 0];
          filter.process(frame);
          expect(callback.called).to.be(false);
        })
      })

      describe("if a hold is being tracked", function() {
        beforeEach(function() {
          frame.process(frame);
          frame.position = [100, 100, 100];
        })

        it("fires a stopped event the hold was started", function() {
          filter.process(frame);
          expect(callback.lastCall.args[0].state).to.equal("stop");
        })

        it("clears the tracked hold", function() {
          filter.process(frame);
          // see if after a hold stop, we trigger a hold start at the new
          // position, not an update
          filter.process(frame);
          var gesture = callback.lastCall.args;
          expect(gesture.state).to.equal("start");
          expect(gesture.position).to.eql(frame.position);
        })
      })
    })
  })

})
