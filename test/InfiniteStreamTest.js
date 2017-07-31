const Array = require("./Libs").Array;
const Assertion = require("./Libs").Assertion;
const Unit = require("./Libs").Unit;

const Stream = require("../index.js");


const countStream = n =>
    Stream.Cons(n)(() => countStream(n + 1));


const isEven = n =>
    (n % 2 === 0);

const square = n =>
    (n * n);


const arrayEquals = l1 => l2 =>
    ((l1.length === l2.length) &&
    Array.foldl(true)(acc => i => acc && i)(Array.zipWith(e1 => e2 => e1 === e2)(l1)(l2)));


module.exports = Unit.Suite("Data.Collection.InfiniteStream")([
    Unit.Suite("head and tail")([
        Unit.Test("head of stream")(Assertion
            .equals(0)(countStream(0).head())),

        Unit.Test("head of tail of stream")(Assertion
            .equals(1)(countStream(0).tail().head())),

        Unit.Test("head of tail of tail of stream")(Assertion
            .equals(2)(countStream(0).tail().tail().head()))
    ]),

    Unit.Suite("get")([
        Unit.Test("get(0) of stream")(Assertion
            .equals(0)(countStream(0).get(0))),

        Unit.Test("get(1) of stream")(Assertion
            .equals(1)(countStream(0).get(1))),

        Unit.Test("get(2) of stream")(Assertion
            .equals(2)(countStream(0).get(2)))
    ]),

    Unit.Suite("filter")([
        Unit.Test("get(0) of filtered even numbers")(Assertion
            .equals(0)(countStream(0).filter(isEven).get(0))),

        Unit.Test("get(1) of filtered even numbers")(Assertion
            .equals(2)(countStream(0).filter(isEven).get(1))),

        Unit.Test("get(2) of filtered even numbers")(Assertion
            .equals(4)(countStream(0).filter(isEven).get(2)))
    ]),

    Unit.Suite("map")([
        Unit.Test("get(0) of map square")(Assertion
            .equals(0)(countStream(0).map(square).get(0))),

        Unit.Test("get(1) of map square")(Assertion
            .equals(1)(countStream(0).map(square).get(1))),

        Unit.Test("get(2) of map square")(Assertion
            .equals(4)(countStream(0).map(square).get(2)))
    ]),

    Unit.Suite("foldn")([
        Unit.Test("0 equals sum 1..0")(Assertion
            .equals(0)((countStream(1).foldn(0)(0)(acc => i => acc + i)))),

        Unit.Test("1 equals sum 1..1")(Assertion
            .equals(1)((countStream(1).foldn(1)(0)(acc => i => acc + i)))),

        Unit.Test("15 equals sum 1..5")(Assertion
            .equals(15)((countStream(1).foldn(5)(0)(acc => i => acc + i))))
    ]),

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
