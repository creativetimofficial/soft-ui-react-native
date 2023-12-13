/**
 * Created by InspireUI on 14/02/2017.
 */

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN_SUCCESS',
};

export const actions = {
  login: (user) => {
    return {type: types.LOGIN, user};
  },
  logout(){
    return {type: types.LOGOUT};
  },
};

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