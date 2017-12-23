import "whatwg-fetch";
import { syncConstants } from "../_constants";
import queryString from "query-string";
import jsonFormat from "json-format";
import * as ThisAPISchema from "./common-api.json";
import yaml from "js-yaml";
const APISchema = {};
Object.keys(ThisAPISchema)
  .filter(name => name !== "default")
  .map(name => {
    const data = ThisAPISchema[name];
    if (typeof data !== "function") {
      APISchema[name] = data;
    }
  });
const APIYaml = yaml.safeDump(APISchema);
// console.log("YAML:", APIYaml);

/**
 * JSON format的格式
 */
const jsonFormatConfig = {
  type: "space",
  size: 2
};
export function getRequest() {
  return {
    type: syncConstants.GET_REQUESTED
  };
}

export function getSuccess(spec) {
  return ({ specActions }) => {
    specActions.updateSpec(spec);
    return {
      type: syncConstants.GET_SUCCESS,
      payload: spec
    };
  };
}

export function getFailed(msg) {
  return {
    type: syncConstants.GET_FAILED,
    payload: msg
  };
}

export function get(id, branch = "master") {
  return ({ commonActions }) => {
    commonActions.getRequest();
    var params = { id, branch };
    // console.log("/getBranch?" + queryString.stringify(params));
    fetch("/projectApiYaml/" + id + "/" + branch, {
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) return Promise.reject("不存在");
        return response.text();
      })
      .then(yaml => {
        // console.log("result yaml:", yaml);
        if (yaml == "mock") return APIYaml;
        return yaml;
      })
      .then(
        yaml => {
          // console.log("next spec:", yaml);
          commonActions.getSuccess(yaml);
        },
        error => {
          commonActions.getFailed(error);
        }
      );
  };
}
