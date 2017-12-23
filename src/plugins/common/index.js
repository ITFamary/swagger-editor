import * as actions from "./_actions";
import reducers from "./_reducers/loginReducer";
import * as selectors from "./_selectors";
import LoginFrame from "./_components/LoginFrame";
import createHistory from "history/createBrowserHistory";
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
  console.log("location:", location);
  setTimeout(() => {
    const commonActions = system.getSystem().commonActions;
    // 默认pathname 算是 /common-solution-manager/master
    const infos = location.pathname.split("/").filter(x => x.length > 0);
    const id = infos[0];
    const branch = infos.length > 1 ? infos[1] : "master";
    console.log("id:", id, " ,branch:", branch);
    commonActions.get(id, branch);
  }, 1);
  // 这里获取一切切入点
  function heart() {
    const commonActions = system.getSystem().commonActions;
    if (commonActions) {
      commonActions.refresh();
    }
  }
  setTimeout(heart, 2000);
  setInterval(heart, 30000);

  // setTimeout(()=>{
  //     console.log(system,system.getSystem());
  // },10000);

  return {
    components: { LoginFrame },
    statePlugins: {
      common: {
        reducers,
        actions,
        selectors
      }
    }
  };
}
