var expect = require('expect.js');
var utils = require("../lib/bluegel").Utils;

describe("Utils", function() {
  describe("dominantMovement", function() {
    it("returns the dominant movement as a direction and distance", function() {
      var movementOne = [1, 2, 3];
      var movementTwo = [2, -4, 4];

      expect(utils.dominantMovement(movementOne, movementTwo)).to.eql({direction: "y", distance: -6});
    })

    it("throws an exception if one or both values are null", function() {
      expect(function() { utils.dominantMovement(null, [1, 2, 3]) }).to.throwException();
      expect(function() { utils.dominantMovement([1, 2, 3], null) }).to.throwException();
      expect(function() { utils.dominantMovement(null, null) }).to.throwException();
    })
  })
})
