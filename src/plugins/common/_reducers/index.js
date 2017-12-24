// 将所有reducers进行合并
import loginReducer from "./loginReducer";
import syncReducer from "./syncReducer";

// console.log("loginReducer", loginReducer);
// console.log("syncReducer", syncReducer);
// 进行合并

// var reducers = {};
// reducers = Object.assign(reducers, ...loginReducer);
// reducers = Object.assign(reducers, ...syncReducer);
const reducers = Object.assign({}, loginReducer, syncReducer);
// console.log("after merge:", reducers);
export default reducers;