// Of note: it's been a while since I've designed a Javascript project.
// This is probably not the ideal way to structure the library --
// should I structure this?
// Of course, it's not like I really know yet everything the library will contain anyway :)

var BlueGel = {
  Analyzers: require("./analyzers.js"),
  Filter: require("./filter.js"),
  Utils: require("./utils.js")
}

module.exports = BlueGel;
