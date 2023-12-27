import types from './types';
// import actions from './actions';

const initialState = {
  user: null,
};

export default (state = initialState, action) => {
  const {type, user} = action;
  switch (type) {
    case types.LOGOUT:
      return Object.assign({}, initialState);
    case types.LOGIN:
      return Object.assign({}, state, {user});
    default:
      return state;
  }
};