import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Root reducer
const rootReducer = combineReducers({ 
  // Add reducers here 
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)) // For Redux DevTools support
);

export default store;
