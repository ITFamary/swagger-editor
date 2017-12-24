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

/**
 * 实际的成功抓取到远程数据
 * @param {String} id
 * @param {String} commitId
 * @param {String} spec
 */
export function getSuccess2(id, commitId, spec) {
  return {
    type: syncConstants.GET_SUCCESS,
    payload: {
      commitId,
      spec,
      id
    }
  };
}

/**
 * 成功获取到远程数据时；它会触发2个具体操作
 * @param {String} id
 * @param {Object} spec 包含yaml的object
 */
export function getSuccess(id, spec) {
  return ({ commonActions, specActions }) => {
    specActions.updateSpec(spec.yaml);
    console.log("make GET_SUCCESS action");
    commonActions.getSuccess2(id, spec.id, spec);
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
        return response.json();
      })
      .then(json => {
        if (json.yaml == "mock")
          return {
            yaml: APIYaml,
            id: null
          };
        return json;
      })
      .then(
        json => {
          // console.log("next spec:", yaml);
          commonActions.getSuccess(id, json);
        },
        error => {
          commonActions.getFailed(error);
        }
      );
  };
}

/**
 * 获取分支信息；
 * @param {String} id 项目id，若不传入则使用当前项目id
 */
export function branches(id) {
  id = typeof id == "string" ? id : undefined;
  return ({ commonSelectors }) => {
    const opId = id || commonSelectors.currentApiId();
    console.log("branches of ", opId);
  };
}
