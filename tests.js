const Unit = require("./test/Libs").Unit;

require("./test/InfiniteStreamTest")
    .then(Unit.showErrors)
    .then(Unit.showSummary)
    .then(Unit.setExitCodeOnFailures);