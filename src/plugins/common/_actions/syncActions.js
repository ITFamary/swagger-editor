import createHistory from "history/createBrowserHistory";
import "whatwg-fetch";
import { syncConstants } from "../_constants";
import queryString from "query-string";
import jsonFormat from "json-format";
import * as ThisAPISchema from "./common-api.json";
import yaml from "js-yaml";

const history = createHistory();

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
export function getSuccess2(id, branch, commitId, spec) {
  //
  const infos = history.location.pathname.split("/").filter(x => x.length > 0);
  // 把之前id 如果之前
  if (infos.length <= 2) history.push("/" + id + "/" + branch);
  else {
    infos[infos.length - 1] = branch;
    infos[infos.length - 2] = id;
    history.push("/" + infos.join("/"));
  }
  return {
    type: syncConstants.GET_SUCCESS,
    payload: {
      branch,
      commitId,
      spec,
      id
    }
  };
}

/**
 * 成功获取到远程数据时；它会触发2个具体操作
 * @param {String} id 项目id
 * @param {Object} spec 包含yaml的object
 */
export function getSuccess(id, branch, spec) {
  return ({ commonActions, specActions }) => {
    specActions.updateSpec(spec.yaml);
    console.log("make GET_SUCCESS action");
    commonActions.getSuccess2(id, branch, spec.id, spec);
  };
}

export function getFailed(msg) {
  return {
    type: syncConstants.GET_FAILED,
    payload: msg
  };
}

export function putApiRequest() {
  return {
    type: syncConstants.PUT_API_REQUESTED
  };
}

export function putApiFailed(msg) {
  return {
    type: syncConstants.PUT_API_FAILED,
    payload: msg
  };
}

export function putApiSuccess(id) {
  return {
    type: syncConstants.PUT_API_SUCCESS,
    payload: id
  };
}

export function putApi(id, branch, spec) {
  return ({ commonSelectors, commonActions }) => {
    console.log('try to put');
    if (commonSelectors.syncSuspend())
      return;
    console.log('make put request');
    commonActions.putApiRequest();
    fetch("/projectApiYaml/" + id + "/" + branch, {
      credentials: "include",
      method: "put",
      body: spec
    })
      .then(response => {
        if (!response.ok) return Promise.reject("失败");
        return response.text();
      })
      .then(
        json => {
          commonActions.putApiSuccess(json);
        },
        error => {
          commonActions.putApiFailed(error);
        }
      );
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
          commonActions.getSuccess(id, branch, json);
        },
        error => {
          commonActions.getFailed(error);
        }
      );
  };
}

export function branchesRequest(id) {
  return {
    type: syncConstants.GET_BRANCHES_REQUESTED,
    payload: id
  };
}

export function branchesSuccess(branches) {
  return {
    type: syncConstants.GET_BRANCHES_SUCCESS,
    payload: branches
  };
}

export function branchesFailed(msg) {
  return {
    type: syncConstants.GET_BRANCHES_FAILED,
    payload: msg
  };
}

/**
 * 清空分支
 */
export function clearBranches() {
  return {
    type: syncConstants.BRANCHES_CLEAR
  };
}

/**
 * 选择分支
 * @param {String} branch
 */
export function selectBranch(branch) {
  // 应当暂停所有的互动
  return ({ commonActions, commonSelectors }) => {
    commonActions.get(commonSelectors.currentApiId(), branch);
    return {
      type: syncConstants.BRANCH_SELECT,
      payload: branch
    };
  };
}

export function newBranch() {
  let name = prompt("新分支的名称:");
  // 名字校验 应该只有 大小写英文数字以及-/.
  if (name) {
    const pattern = /^[a-zA-Z0-9-\_\.]+$/;
    name = name.trim();
    if (name.length < 1 || !name.match(pattern)) {
      alert("请输入正确的分支名称");
      return;
    }
    return ({ commonActions, commonSelectors }) => {
      fetch("/projectBranches/" + commonSelectors.currentApiId(), {
        credentials: "include",
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: commonSelectors.currentBranch(),
          to: name
        })
      })
        .then(response => {
          if (!response.ok) return Promise.reject("创建失败");
          return true;
        })
        .then(() => {
          commonActions.get(commonSelectors.currentApiId(), name);
        });
    };
  }
}

/**
 * 获取分支信息；
 * @param {String} id 项目id，若不传入则使用当前项目id
 */
export function branches(id) {
  id = typeof id == "string" ? id : undefined;
  return ({ commonSelectors, commonActions }) => {
    const opId = id || commonSelectors.currentApiId();
    console.log("branches of ", opId);
    commonActions.branchesRequest(opId);
    fetch("/projectBranches/" + opId, {
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) return Promise.reject("失败");
        return response.json();
      })
      .then(
        json => {
          commonActions.branchesSuccess(json);
        },
        error => {
          commonActions.branchesFailed(error);
        }
      );
  };
}

export function userEditEvent(time){
  return {
    type: syncConstants.USER_EDIT,
    payload: time
  };
}

/**
 * 若太长时间没有编辑，则获取最新版本
 */
export function getCurrentIfIdle(){
  return ({ commonSelectors, commonActions }) => {
    const currentApiId = commonSelectors.currentApiId();
    const currentBranch = commonSelectors.currentBranch();
    console.log('getCurrentIfIdle for:', currentApiId ,':', currentBranch, ' time:', commonSelectors.userLastEdit());
    if(!currentApiId || !currentBranch)
    return;
    // 若10秒没有编辑
    if(new Date().getTime()-commonSelectors.userLastEdit() > 10000){
      commonActions.get(currentApiId, currentBranch); 
    }
  };
}