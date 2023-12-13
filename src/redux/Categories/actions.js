import types from './types'
import ShopifyAPI from '@services/ShopifyAPI';
import {warn} from "@app/Omni"

export default {
  switchDisplayMode: (mode) => {
    return {type: types.SWITCH_DISPLAY_MODE, mode};
  },
  setSortBy: (mode) => {
    return {type: types.SET_SORT_BY, mode};
  },
  setSelectedCategory: (category) => {
    return {type: types.SET_SELECTED_CATEGORY, category};
  },

  fetchCategories: async (dispatch) => {
    dispatch({type: types.FETCH_CATEGORIES_PENDING});
    const items = await ShopifyAPI.getCategories();
    
    if (items === undefined) {
      dispatch({type: types.FETCH_CATEGORIES_FAILURE, error: 'Can\'t get data from server'})
    } else if (items.code) {
      dispatch({type: types.FETCH_CATEGORIES_FAILURE, error: items.message});
    } else {
      dispatch({type: types.FETCH_CATEGORIES_SUCCESS, items});
    }
  },
};