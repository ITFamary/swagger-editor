import { loginConstants } from "../_constants";

export default {
  [loginConstants.LOGIN_SUCCESS]: (state, { payload }) => {
    console.log("LOGIN_SUCCESS", state);
    return state.delete("logging").set("login",payload);
  },
  [loginConstants.LOGIN_FAILED]: state => {
    // 还有消息呢
    console.log("LOGIN_FAILED", state);
    return state.delete("logging");
  },
  [loginConstants.LOGIN_REQUESTED]: state => {
    console.log("LOGIN_REQUESTED", state);
    return state.set("logging", true);
  },
  [loginConstants.REFRESH_SUCCESS]: (state, { payload }) => {
    // console.log("REFRESH_SUCCESS", state, payload);
    return state.set("login", payload);
  },
  [loginConstants.REFRESH_FAILED]: state => {
    // 还有消息呢
    // console.log("REFRESH_FAILED", state);
    return state.delete("login");
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
