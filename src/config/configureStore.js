import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import monitorReducersEnhancer from "../enhancers/monitorReducer";
import loggerMiddleware from "../middleware/logger";
import rootReducers from "../reducers";

import firebase from "../config/config.js";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer, monitorReducersEnhancer];

  const rrfConfig = {
    attachAuthIsReady: true,
  };

  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducers, preloadedState, composedEnhancers);
  /*const store = createStore(
    rootReducers,
    composedEnhancers(
      reactReduxFirebase(firebase, rrfConfig),
      reduxFirestore(firebase),
      applyMiddleware(
        thunkMiddleware.withExtraArgument({ getFirebase, getFirestore })
      )
    )
  );*/

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("../reducers", () => store.replaceReducer(rootReducers));
  }

  return store;
}
