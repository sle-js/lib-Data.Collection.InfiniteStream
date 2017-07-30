const Assertion = require("./Libs").Assertion;
const Unit = require("./Libs").Unit;

const Stream = require("../index.js");


const countStream = n =>
    Stream.Cons(n)(() => countStream(n + 1));


module.exports = Unit.Suite("Data.Collection.InfiniteStream")([
    Unit.Test("head returns the first elements")(Assertion
        .equals(1)(countStream(1).head()))
]);
