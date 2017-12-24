import { syncConstants } from "../_constants";

export default {
  [syncConstants.GET_SUCCESS]: (state, { payload }) => {
    console.log("GET_SUCCESS", state);
    // return state.delete("logging").set("login",payload);
    return state
      .set("currentApiId", payload.id)
      .set("currentCommitId", payload.commitId);
  }
};

// export function refresh(state, action) {
// console.log(action);
//   switch (action.type) {
//     case loginConstants.REFRESH_SUCCESS:
//       state.set("login", action.data);
//       return state;
//     case loginConstants.REFRESH_FAILED:
//       state.set("login", {});
//       return state;
//     default:
//       return state;
//   }
// }
