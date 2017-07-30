const Array = require("./Libs").Array;
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


const isEven = n =>
    (n % 2 === 0);


const arrayEquals = l1 => l2 =>
    ((l1.length === l2.length) &&
    Array.foldl(true)(acc => i => acc && i)(Array.zipWith(e1 => e2 => e1 === e2)(l1)(l2)));


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
            .equals(n * 2)(countStream(0).filter(i => isEven(i)).get(n)))),

    Unit.Test("map all elements by doubling")(
        Generative.forAll(NON_NEGATIVE_INTEGERS)(n => Assertion
            .equals(n * n)(countStream(0).map(i => i * i).get(n)))),

    Unit.Test("add 0 to n together using a fold")(
        Generative.forAll(NON_NEGATIVE_INTEGERS)(n => Assertion
            .equals(n * (n - 1) / 2)(countStream(0).foldn(n)(0)(acc => i => acc + i)))),

    Unit.Suite("takeAsArray")([
        Unit.Test("take 0 should return []")(Assertion
            .isTrue(arrayEquals(countStream(0).takeAsArray(0))([]))),
        Unit.Test("take 1 should return [0]")(Assertion
            .isTrue(arrayEquals(countStream(0).takeAsArray(1))([0]))),
        Unit.Test("take 5 should return [0, 1, 2, 3, 4]")(Assertion
            .isTrue(arrayEquals(countStream(0).takeAsArray(5))([0, 1, 2, 3, 4])))
    ]),

    Unit.Test("zip with count and count + 2")(Assertion
        .isTrue(countStream(0).zip(countStream(2)).foldn(10)(true)(acc => e => acc && e[0] + 2 === e[1])))
]);
