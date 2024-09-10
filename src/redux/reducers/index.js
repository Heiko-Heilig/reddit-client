import { combineReducers } from 'redux';

// Placeholder reducer (we'll add actual reducers here)
const placeholderReducer = (state = {}, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  placeholder: placeholderReducer,
});
