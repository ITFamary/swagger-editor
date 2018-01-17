import * as actions from "./_actions";
import reducers from "./_reducers";
import * as selectors from "./_selectors";
import LoginFrame from "./_components/LoginFrame";
import BranchSelector from "./_components/BranchSelector";
import createHistory from "history/createBrowserHistory";
import fetcher from "./AutoFetch";
const history = createHistory();

// Get the current location.
const location = history.location;
// // Listen for changes to the current location.
// const unlisten = history.listen((location, action) => {
//   // location is an object like window.location
//   console.log(action, location.pathname, location.state)
// })
export default function(system) {
  console.log("prepare to plugin", {
    common: {
      reducers,
      actions,
      selectors
    }
  });

  // [schema]://[host][:[port]][contextPath]/...
  // 默认打开的路径是 .../id/branch 其中... 为 contextPath 默认为空
  const infos = location.pathname.split("/").filter(x => x.length > 0);
  const id = infos.length > 1 ? infos[infos.length - 2] : infos[0];
  const branch = infos.length > 1 ? infos[infos.length - 1] : "master";
  var contextPath;
  if (infos.length > 1) {
    // 移除后面2个
    infos.pop();
    infos.pop();
    contextPath = infos.join("/");
    if (contextPath.length > 0) {
      contextPath = "/" + contextPath;
    }
  } else {
    contextPath = "";
  }
  console.log("id:", id, " ,branch:", branch, " ,contextPath:", contextPath);

  setTimeout(() => {
    const commonActions = system.getSystem().commonActions;
    // 默认pathname 算是 /common-solution-manager/master
    commonActions.get(id, branch);
  }, 1);
  // 这里获取一切切入点
  function heart() {
    const commonActions = system.getSystem().commonActions;
    if (commonActions) {
      commonActions.refresh();
    }
  }
  setTimeout(heart, 500);
  setInterval(heart, 30000);

  // errActions.

  var nextPushTimer = null;
  function changeHappen(spec) {
    const { commonSelectors, commonActions } = system.getSystem();
    if (nextPushTimer) {
      clearTimeout(nextPushTimer);
      nextPushTimer = null;
    }
    
    if (commonSelectors.syncSuspend()) {
      //暂时不关心修改
      return;
    }

    nextPushTimer = setTimeout(() => {
      if (commonSelectors.syncSuspend()) {
        //暂时不关心修改
        return;
      }
      commonActions.putApi(
        commonSelectors.currentApiId(),
        commonSelectors.currentBranch(),
        spec
      );
    }, 3000);
  }

  setTimeout(() => {
    fetcher(system, path => {
      return (
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "") +
        path
      );
    });
  }, 1);
  // setTimeout(()=>{
  //     console.log(system,system.getSystem());
  // },10000);

  return {
    components: { LoginFrame, BranchSelector },
    statePlugins: {
      common: {
        reducers,
        actions,
        selectors
      },
      spec: {
        wrapActions: {
          updateSpec: ori => (...args) => {
            let [spec] = args;
            ori(...args);
            console.log("发生了什么？", args);
            // saveContentToStorage(spec);
            changeHappen(spec);
          }
        }
      }
    }
  };
}
