import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import monitorReducersEnhancer from "../enhancers/monitorReducer";
import loggerMiddleware from "../middleware/logger";
import rootReducers from "../reducers";

import firebase from "../config/config.js";
import { getFirebase } from "react-redux-firebase";
import { reduxFirestore, getFirestore } from "redux-firestore";
import reduxThunk from "redux-thunk";

import { verifyAuth } from "../actions";

export default function configureStore(preloadedState) {
  const middlewares = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [
    middlewareEnhancer,
    monitorReducersEnhancer,
    reduxFirestore(firebase),
    applyMiddleware(
      reduxThunk.withExtraArgument({ getFirebase, getFirestore })
    ),
  ];

  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducers, preloadedState, composedEnhancers);
  store.dispatch(verifyAuth());

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("../reducers", () => store.replaceReducer(rootReducers));
  }

  return store;
}
