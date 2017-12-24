import { createSelector } from "reselect";
import Im from "immutable";

const state = state => {
  return state || Im.Map();
};

export const login = createSelector(state, state => {
  return state.get("login") || null;
});

export const logging = createSelector(state, state => {
  return state.get("logging") || null;
});

export const currentApiId = createSelector(state, state => {
  return state.get("currentApiId") || null;
});

export const currentCommitId = createSelector(state, state => {
  return state.get("currentCommitId") || null;
});
