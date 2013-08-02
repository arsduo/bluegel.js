var expect = require('expect.js');
var sinon = require('sinon')
var BlueGel = require("../../lib/bluegel")
var HoldFilter = BlueGel.Filter.types.hold;
var TrackedHolds = require("../../lib/filter/hold/tracked_holds");

var callback = function(gesture) {
  return gesture;
}

describe("Hold filter", function() {
  var options, callback, filter, frame, hand, clock;

  beforeEach(function() {
    options = {};

    callback = sinon.spy();
    filter = new HoldFilter(options, callback);
    hand = {
      id: Math.random(),
      palmPosition: [1, 2, 3],
      palmVelocity: [0.5, 0.3, 0.4]
    }

    frame = {
      hands: [hand],
      hand: function(handId) {
        var hand;
        for (var i = 0; i < this.hands.length; i++) {
          hand = this.hands[i];
          if (handId == hand.id) {
            return hand;
          }
        }
        return null;
      }
    }

    clock = sinon.useFakeTimers();
  })

  afterEach(function() {
    clock.restore();
    TrackedHolds.flushAll();
  })

  describe("constructor", function() {
    it("sets the options provided", function() {
      var options = {maxVelocity: 3, a: 3};
      var filter = new HoldFilter(options, callback);
      expect(filter.options).to.have.property("a", 3);
      expect(filter.options).to.have.property("maxVelocity", 3);
    })

    it("defines the maxVelocity if not provided", function() {
      expect(filter.options).to.have.property("maxVelocity");
    })

    it("defines the maxDistance if not provided", function() {
      expect(filter.options).to.have.property("maxDistance");
    })

    it("saves the callback", function() {
      expect(filter.callback).to.equal(callback);
    })

    it("throws an exception if no callback is provided", function() {
      expect(function() { new HoldFilter(options) }).to.throwException();
    })
  })

  describe("process", function() {
    describe("filtering on state", function() {
      describe("for start", function() {
        it("doesn't call the callback if it asks for update", function() {
          options.state = "update";
          filter = new HoldFilter(options, callback);
          filter.process(frame);
          expect(callback.called).to.be(false)
        })

        it("doesn't call the callback if it asks for stop", function() {
          options.state = "stop";
          filter = new HoldFilter(options, callback);
          filter.process(frame);
          expect(callback.called).to.be(false)
        })
      })

      describe("for update", function() {
        var callCount;

        beforeEach(function() {
          filter.process(frame);
          callCount = callback.callCount;
        })

        it("doesn't call the callback if it asks for start", function() {
          options.state = "start";
          filter = new HoldFilter(options, callback);
          filter.process(frame);
          expect(callback.callCount).to.equal(callCount);
        })

        it("doesn't call the callback if it asks for stop", function() {
          options.state = "stop";
          filter = new HoldFilter(options, callback);
          filter.process(frame);
          expect(callback.callCount).to.equal(callCount);
        })
      })

      describe("for stop", function() {
        var callCount;

        beforeEach(function() {
          filter.process(frame);
          hand.palmVelocity = [1000, 0, 0]
          callCount = callback.callCount;
        })

        it("doesn't call the callback if it asks for start", function() {
          options.state = "start";
          filter = new HoldFilter(options, callback);
          filter.process(frame);
          expect(callback.callCount).to.equal(callCount);
        })

        it("doesn't call the callback if it asks for update", function() {
          options.state = "update";
          filter = new HoldFilter(options, callback);
          filter.process(frame);
          expect(callback.callCount).to.equal(callCount);
        })
      })
    })

    describe("if all requirements for a hold pass", function() {
      beforeEach(function() {
        filter.process(frame);
      })

      describe("the callback", function() {
        var gesture;

        beforeEach(function() {
          gesture = callback.firstCall.args[0];
        })

        it("calls the callback if all requirements pass", function() {
          expect(callback.called).to.be(true);
        })

        it("includes the hand of the gesture", function() {
          expect(gesture.handIds).to.eql([hand.id]);
        })

        it("includes no fingers", function() {
          expect(gesture.pointableIds).to.eql([]);
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
        it("sends an update", function() {
          filter.process(frame);
          expect(callback.callCount).to.be(2);
          var gesture = callback.lastCall.args[0];
          expect(gesture.state).to.equal("update");
        })

        it("updates the position", function() {
          var originalLocation = hand.palmPosition;
          hand.palmPosition = [
            originalLocation[0] + 0.1,
            originalLocation[1] + 0.1,
            originalLocation[2] + 0.1
          ];
          filter.process(frame);
          var gesture = callback.lastCall.args[0];
          expect(gesture.startPosition).to.eql(originalLocation);
          expect(gesture.position).to.eql(hand.palmPosition);
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
          hand.palmVelocity = [100, 100, 100];
        })

        it("doesn't start a gesture if there is none", function() {
          filter.process(frame);
          expect(callback.called).to.be(false);
        })

        it("also catches negative velocities", function() {
          hand.palmVelocity = [-100, 0, 0];
          filter.process(frame);
          expect(callback.called).to.be(false);
        })
      })

      describe("if a hold is being tracked", function() {
        beforeEach(function() {
          filter.process(frame);
          hand.palmVelocity = [100, 100, 100];
        })

        it("fires a stopped event the hold was started", function() {
          filter.process(frame);
          expect(callback.lastCall.args[0].state).to.equal("stop");
        })

        it("clears the tracked hold", function() {
          filter.process(frame);
          hand.palmVelocity = [0, 0, 0];
          // see if after a hold stop, we trigger a hold start, not an update
          filter.process(frame);
          expect(callback.lastCall.args[0].state).to.equal("start");
        })
      })
    })

    describe("if position fails", function() {
      // position can only fail if there's an existing hold
      describe("if a hold is being tracked", function() {
        beforeEach(function() {
          filter.process(frame);
          hand.palmPosition = [100, 100, 100];
          filter.process(frame);
        })

        it("fires a stopped event the hold was started", function() {
          expect(callback.lastCall.args[0].state).to.equal("stop");
        })

        it("clears the tracked hold", function() {
          // see if after a hold stop, we trigger a hold start at the new
          // position, not an update
          filter.process(frame);
          var gesture = callback.lastCall.args[0];
          expect(gesture.state).to.equal("start");
          expect(gesture.position).to.eql(hand.palmPosition);
        })
      })
    })

    describe("if a hand goes missing", function() {
      describe("if a hold is being tracked", function() {
        beforeEach(function() {
          filter.process(frame);
          frame.hands = [];
          filter.process(frame);
        })

        it("fires a stopped event the hold was started", function() {
          expect(callback.lastCall.args[0].state).to.equal("stop");
        })

        it("includes no position", function() {
          expect(callback.lastCall.args[0].position).to.be(null)
        })

        it("clears the tracked hold", function() {
          // see if after a hold stop, we trigger a hold start at the new
          // position, not an update
          frame.hands = [hand];
          filter.process(frame);
          var gesture = callback.lastCall.args[0];
          expect(gesture.state).to.equal("start");
          expect(gesture.position).to.eql(hand.palmPosition);
        })
      })
    })
  })
})
