const Assertion = require("./Libs").Assertion;
const Generative = require("./Libs").Generative;
const Unit = require("./Libs").Unit;

const Stream = require("../index.js");


const countStream = n =>
    Stream.Cons(n)(() => countStream(n + 1));

const INTEGERS =
    Generative.randoms().then(things => things.map(s => s.asIntInRange(-10000)(10000)));


module.exports = Unit.Suite("Data.Collection.InfiniteStream")([
    Unit.Test("head returns the first element")(
        Generative.forAll(INTEGERS)(n => Assertion
            .equals(n)(countStream(n).head()))),

    Unit.Test("tail returns the rest of the elements")(
        Generative.forAll(INTEGERS)(n => Assertion
            .equals(n + 1)(countStream(n).tail().head())))
]);
