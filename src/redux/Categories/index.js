// import { Constants } from "@common";
import types from './types';
import actions from './actions';

export const DisplayMode = {
  ListMode: 'ListMode',
  GridMode: 'GridMode',
  CardMode: 'CardMode',
};

const initialState = {
  isFetching: false,
  error: null,
  displayMode: DisplayMode.GridMode,
  sortBy: 'updated_at',
  list: [],
  selectedCategory: null,
};

export {actions};

export default (state = initialState, action) => {
  const {type, mode, error, items, category} = action;
  switch (type) {
    case types.FETCH_CATEGORIES_PENDING: {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }
    case types.FETCH_CATEGORIES_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        list: items || [],
        error: null,
      };
    }
    case types.FETCH_CATEGORIES_FAILURE: {
      return {
        ...state,
        isFetching: false,
        list: [],
        error: error,
      };
    }
    case types.SWITCH_DISPLAY_MODE: {
      return {
        ...state,
        displayMode: mode,
      };
    }

    case types.SET_SELECTED_CATEGORY: {
      return {
        ...state,
        selectedCategory: category,
      };
    }

    case types.SET_SORT_BY: {
      return {
        ...state,
        sortBy: mode,
      };
    }

    default: {
      return state;
    }
  }
};
