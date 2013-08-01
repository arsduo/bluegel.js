var expect = require('expect.js');
var bluegel = require("../lib/bluegel");

describe("BlueGel", function() {
  it("defines Filter", function() {
    expect(bluegel.Filter).to.be.ok();
  })

  it("defines Analysis", function() {
    expect(bluegel.Analysis).to.be.ok();
  })

  it("defines Utils", function() {
    expect(bluegel.Utils).to.be.ok();
  })
})
