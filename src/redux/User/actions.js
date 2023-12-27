import types from './types';
export default {
  login: (user, dispatch) => {
    return dispatch({type: types.LOGIN, user});
  },
  logout() {
    return {type: types.LOGOUT};
  },
};
