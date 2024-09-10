import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import redditReducer from './reducers/redditReducer';

// Combine reducers
const rootReducer = combineReducers({
  reddit: redditReducer,
});

// Create store without redux-devtools-extension
const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Apply only the middleware without devtools
);

export default store;