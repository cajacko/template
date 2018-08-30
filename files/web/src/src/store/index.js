// @flow

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import logger from "redux-logger";
import config from "../config";

const reducers = config.REDUCERS && combineReducers(config.REDUCERS);

const store =
  config.REDUCERS &&
  createStore(
    reducers,
    compose(
      applyMiddleware(logger),
      autoRehydrate()
    )
  );

if (config.REDUCERS) persistStore(store);

export default store;
