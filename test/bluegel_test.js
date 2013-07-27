var expect = require('expect.js');
var bluegel = require("../lib/bluegel");

describe("BlueGel", function() {
  it("defines Filter", function() {
    expect(bluegel.Filter).to.be.ok();
  })

  it("defines Analyzers", function() {
    expect(bluegel.Analyzers).to.be.ok();
  })

  it("defines Utils", function() {
    expect(bluegel.Utils).to.be.ok();
  })
})
