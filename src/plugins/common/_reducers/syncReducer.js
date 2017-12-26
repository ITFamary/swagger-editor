import { syncConstants } from "../_constants";

export default {
  [syncConstants.BRANCHES_CLEAR]: state => {
    console.log("BRANCHES_CLEAR", state);
    // return state.delete("logging").set("login",payload);
    return state.delete("branches");
  },
  [syncConstants.BRANCH_SELECT]: (state, { payload }) => {
    console.log("BRANCH_SELECT", payload);
    // return state.delete("logging").set("login",payload);
    // 更换了当前分支 实际上尚未完成
    return state.set("selectedBranch", payload);
  },
  [syncConstants.PUT_API_SUCCESS]: (state, { payload }) => {
    console.log("PUT_API_SUCCESS", payload);
    return state.set("currentCommitId", payload);
  },
  [syncConstants.GET_SUCCESS]: (state, { payload }) => {
    console.log("GET_SUCCESS", state);
    // return state.delete("logging").set("login",payload);
    return state
      .delete("syncSuspend")
      .set("currentApiId", payload.id)
      .set("currentCommitId", payload.commitId)
      .set("currentBranch", payload.branch);
  },
  [syncConstants.GET_FAILED]: state => {
    // 一旦发生获取请求，表明当前工作区的互动应该通知
    return state.delete("syncSuspend");
  },
  [syncConstants.GET_BRANCHES_REQUESTED]: state => {
    // start request
    return state
      .delete("branches")
      .set("branchFetching", true)
      .set("loadingText", "载入分支中");
  },
  [syncConstants.GET_REQUESTED]: state => {
    // 一旦发生获取请求，表明当前工作区的互动应该通知
    return state.set("syncSuspend", true);
  },
  [syncConstants.GET_BRANCHES_SUCCESS]: (state, { payload }) => {
    console.log("GET_BRANCHES_SUCCESS", payload);
    return state
      .delete("branchFetching")
      .set("branches", payload)
      .delete("loadingText");
  },
  [syncConstants.GET_BRANCHES_FAILED]: state => {
    return state.delete("branchFetching").delete("loadingText");
  }
};
