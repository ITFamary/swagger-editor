import { createSelector } from "reselect";
import Im from "immutable";

const state = state => {
  return state || Im.Map();
};

/**
 * 登录状态
 */
export const login = createSelector(state, state => {
  return state.get("login") || null;
});

/**
 * 是否正在登录
 */
export const logging = createSelector(state, state => {
  return state.get("logging") || null;
});

/**
 * 项目的id
 */
export const currentApiId = createSelector(state, state => {
  return state.get("currentApiId") || null;
});

/**
 * 当前工作分支
 */
export const currentBranch = createSelector(state, state => {
  return state.get("currentBranch") || null;
});

/**
 * 最后一次拉取到的commitId
 */
export const currentCommitId = createSelector(state, state => {
  return state.get("currentCommitId") || null;
});

/**
 * 是否正在拉取分支信息
 */
export const branchFetching = createSelector(state, state => {
  return state.get("branchFetching") || null;
});

/**
 * 当前可用分支
 */
export const branches = createSelector(state, state => {
  return state.get("branches") || null;
});

/**
 * 正在loading的样子信息
 */
export const loadingText = createSelector(state, state => {
  return state.get("loadingText") || null;
});

/**
 * 选择了什么分支
 */
export const selectedBranch = createSelector(state, state => {
  return state.get("selectedBranch") || null;
});

/**
 * 同步状态是否被挂起
 */
export const syncSuspend = createSelector(state, state => {
  return state.get("syncSuspend") || null;
});

/**
 * 用户最后修改时间。
 */
export const userLastEdit = createSelector(state, state => {
  return state.get("userLastEdit") || 0;
});