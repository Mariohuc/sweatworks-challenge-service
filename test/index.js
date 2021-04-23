
function importTest(name, path) {
  describe(name, function () {
      require(path);
  });
}

describe("Running Testing", function () {

  importTest("\n***************** Models tests *****************", "./models/models");
  importTest("\n***************** REST API tests *****************", "./api/api");

});
