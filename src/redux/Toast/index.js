/**
 * Created by InspireUI on 14/02/2017.
 */

const types = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
};

export const actions = {
  addToast: (msg, key) => {
    return {type: types.ADD_TOAST, payload: {msg, key}};
  },
  removeToast: (key) => {
    return {type: types.REMOVE_TOAST, payload: {key}};
  },
};

const initialState = {
  list: []
}

export default (state = initialState, action) => {
  const {type, payload} = action;
  const {list} = state;

  switch (type) {
    case types.ADD_TOAST: {
      return {
        ...state,
        list: list.some(toast => toast.msg === payload.msg) ? list : [payload, ...list],
      };
    }
    case types.REMOVE_TOAST: {
      return {
        ...state,
        list: list.filter(msg => msg.key !== payload.key),
      };
    }
    default: {
      return state;
    }
  }
};