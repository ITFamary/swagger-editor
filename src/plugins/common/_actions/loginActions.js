import "whatwg-fetch";
import queryString from "query-string";
import { loginConstants } from "../_constants";

export function refreshRequest() {
  return {
    type: loginConstants.REFRESH_REQUESTED
  };
}
export function refreshSuccess(status) {
  return {
    type: loginConstants.REFRESH_SUCCESS,
    payload: status
  };
}
export function refreshFailed(msg) {
  return {
    type: loginConstants.REFRESH_FAILED,
    payload: msg
  };
}

export function loginRequest() {
  return {
    type: loginConstants.LOGIN_REQUESTED
  };
}
export function loginSuccess(status) {
  return {
    type: loginConstants.LOGIN_SUCCESS,
    payload: status
  };
}
export function loginFailed(msg) {
  return {
    type: loginConstants.LOGIN_FAILED,
    payload: msg
  };
}
/**
 * 实施登录
 * @param {String} username
 * @param {String} password
 */
export function login(username, password) {
  return ({ commonActions }) => {
    commonActions.loginRequest();

    // var formData = new FormData();

    // formData.append("username", username);
    // formData.append("password", password);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

    fetch("/login",{
        method: "post",
        credentials: "include",
        headers: myHeaders,
        body: queryString.stringify(
          {
            username:username,
            password:password
          }
        )
      })
      .then(response => {
        if (!response.ok || response.status === 240) return Promise.reject("用户名或者密码不正确");
        return response.json();
      })
      .then(
        loginStatus => {
          commonActions.loginSuccess(loginStatus);
        },
        error => {
          // 尚未登录
          commonActions.loginFailed("尚未登录");
          // dispatch(failed("尚未登录"));
        }
      );
  };
}

/**
 * 自动刷新登录状态
 */
export function refresh() {
  return ({ commonActions,specSelectors }) => {
    commonActions.refreshRequest();
    // console.log('specSelectors',specSelectors);

    // console.log('i am refreshing.');
    fetch("/loginStatus",{
        credentials: "include"
      })
      .then(response => {
        if (!response.ok || response.status === 240) return Promise.reject("尚未登录");
        return response.json();
      })
      .then(
        loginStatus => {
          commonActions.refreshSuccess(loginStatus);
        },
        error => {
          // 尚未登录
          commonActions.refreshFailed("尚未登录");
          // dispatch(failed("尚未登录"));
        }
      )
      .catch(e => {
        // console.error('bad', e);
        // dispatch(failure(e));
        // dispatch(alertActions.error(error));
      });
  };
}
