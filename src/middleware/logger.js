// A middleware which logs dispatched actions and the resulting new state.
const logger = (store) => (next) => (action) => {
  console.group(action.tye);
  console.info("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  console.groupEnd();
  return result;
};
export default logger;
