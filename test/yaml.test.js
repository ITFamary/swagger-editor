const apiSchemaJson = require("../src/plugins/common/_actions/common-api.json")
// const yaml = require("yaml-js")
// const  dumper = require("yaml-js/dumper");
const yaml = require("js-yaml")

describe("YAML", function () {
  describe("1", function () {
    it("2", function () {
      // yaml.dumper.Dumper
      // var v=yaml.dump(apiSchemaJson)
      // var v = yaml.dump(apiSchemaJson, undefined, yaml.dumper.Dumper, {indent: 9,canonical:true})
      var  v = yaml.safeDump(apiSchemaJson)
      console.log(v)
    })
  })
})


