const Assertion = require("./Libs").Assertion;
const Generative = require("./Libs").Generative;
const Unit = require("./Libs").Unit;

const Stream = require("../index.js");


const countStream = n =>
    Stream.Cons(n)(() => countStream(n + 1));

const INTEGERS =
    Generative.randoms().then(things => things.map(s => s.asIntInRange(-10000)(10000)));

const NON_NEGATIVE_INTEGERS =
    Generative.randoms().then(things => things.map(s => s.asIntInRange(0)(10000)));


module.exports = Unit.Suite("Data.Collection.InfiniteStream")([
    Unit.Test("head returns the first element")(
        Generative.forAll(INTEGERS)(n => Assertion
            .equals(n)(countStream(n).head()))),

    Unit.Test("tail returns the rest of the elements")(
        Generative.forAll(INTEGERS)(n => Assertion
            .equals(n + 1)(countStream(n).tail().head())
            .equals(n + 2)(countStream(n).tail().tail().head()))),

    Unit.Test("get returns the nth element")(
        Generative.forAll(NON_NEGATIVE_INTEGERS)(n => Assertion
            .equals(n)(countStream(0).get(n)))),

    Unit.Test("filter out the even numbers")(
        Generative.forAll(NON_NEGATIVE_INTEGERS)(n => Assertion
            .equals(n * 2)(countStream(0).filter(n => isEven(n)).get(n)))),

    Unit.Test("map all elements by doubling")(
        Generative.forAll(NON_NEGATIVE_INTEGERS)(n => Assertion
            .equals(n * n)(countStream(0).map(n => n * n).get(n)))),

    Unit.Test("add 0 to n together using a fold")(
        Generative.forAll(NON_NEGATIVE_INTEGERS)(n => Assertion
            .equals(n * (n - 1) / 2)(countStream(0).foldn(n)(0)(acc => i => acc + i))))
]);


const isEven = n =>
    n % 2 === 0;
