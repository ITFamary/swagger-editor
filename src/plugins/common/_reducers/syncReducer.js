import { syncConstants } from "../_constants";

export default {
  [syncConstants.BRANCHES_CLEAR]: state => {
    console.log("BRANCHES_CLEAR", state);
    // return state.delete("logging").set("login",payload);
    return state.delete("branches");
  },
  [syncConstants.BRANCH_SELECT]: (state, { payload }) => {
    console.log("BRANCH_SELECT",payload);
    // return state.delete("logging").set("login",payload);
    return state.set("selectedBranch", payload);
  },
  [syncConstants.GET_SUCCESS]: (state, { payload }) => {
    console.log("GET_SUCCESS", state);
    // return state.delete("logging").set("login",payload);
    return state
      .set("currentApiId", payload.id)
      .set("currentCommitId", payload.commitId);
  },
  [syncConstants.GET_BRANCHES_REQUESTED]: state => {
    // start request
    return state
      .delete("branches")
      .set("branchFetching", true)
      .set("loadingText", "载入分支中");
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
