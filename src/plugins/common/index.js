import * as actions from "./_actions";
import reducers from "./_reducers/loginReducer";
import * as selectors from "./_selectors";
import LoginFrame from './_components/LoginFrame';

export default function(system) {
  console.log({
    common: {
      reducers,
      actions,
      selectors
    }
  });
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
