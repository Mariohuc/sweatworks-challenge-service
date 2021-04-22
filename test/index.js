const truncate = require('./truncate');

function importTest(name, path) {
  describe(name, function () {
      require(path);
  });
}

describe("Running Testing", function () {
  beforeEach(async () => {
    console.info("Before each tests: truncate");
    await truncate();
  });

  importTest("Models tests", "./models/models");
  //importTest("b", "./b/b");

  after(function () {
    console.info("After all tests");
  });
});
