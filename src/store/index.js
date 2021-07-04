/**
 * Redux store setup.
 */

import { createStore, combineReducers, applyMiddleware } from "redux";

// Logger with default options
import settingsReducer from './reducers/settings';
import notifyReducer from './reducers/notification';
import globalReducer from './reducers/globals';

export default function getStore() {
  let initialState = {
    settings: {},
    notify: {
      type: '',
      message: '',
    },
    globals: {
      company_id: 1,
    },
  };
  const store = createStore(combineReducers({
    settings: settingsReducer,
    notify: notifyReducer,
    globals: globalReducer,
  }), initialState);
  return store;
}