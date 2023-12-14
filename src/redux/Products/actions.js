import types from './types';
import ShopifyAPI from '@services/ShopifyAPI';
import { Languages } from '@common';

const actions = {
  fetchProductsByCategoryId: async (dispatch, categoryId, per_page, page, filter = null) => {
    // dispatch({type: types.FETCH_PRODUCTS_PENDING});
    const json = await ShopifyAPI.productsByCategoryId(categoryId, per_page, page, filter);
    if (json === undefined) {
      dispatch(actions.fetchProductsFailure('Can\'t get data from server'));
    } else if (json.code) {
      dispatch(actions.fetchProductsFailure(json.message));
    } else {
      dispatch(actions.fetchProductsSuccess(json, page));
    }
  },
  fetchProductsSuccess: (items, page) => ({ type: types.FETCH_PRODUCTS_SUCCESS, items, page }),
  fetchProductsFailure: (error) => ({ type: types.FETCH_PRODUCTS_FAILURE, error }),
  clearProducts: () => ({ type: types.CLEAR_PRODUCTS }),
  initProduct: () => ({ type: types.INIT_PRODUCTS }),
  fetchReviewsByProductId: async (dispatch, productId) => {
    // dispatch({type: types.FETCH_REVIEWS_PENDING});

    const json = await ShopifyAPI.reviewsByProductId(productId);
    if (json === undefined) {
      dispatch({ type: types.FETCH_REVIEWS_FAILURE, message: Languages.ErrorMessageRequest });
    } else if (json.code) {
      dispatch({ type: types.FETCH_REVIEWS_FAILURE, message: json.message });
    } else {
      dispatch({ type: types.FETCH_REVIEWS_SUCCESS, reviews: json });
    }
  },

  fetchProductsByName: async (dispatch, handle) => {
    // dispatch({type: types.FETCH_PRODUCTS_BY_NAME_PENDING});

    const json = await ShopifyAPI.searchByName(handle);
    if (json === undefined) {
      dispatch({ type: types.FETCH_PRODUCTS_BY_NAME_FAILURE, message: Languages.ErrorMessageRequest });
    } else if (json.code) {
      dispatch({ type: types.FETCH_PRODUCTS_BY_NAME_FAILURE, message: json.message });
    } else {
      dispatch({ type: types.FETCH_PRODUCTS_BY_NAME_SUCCESS, productsByName: json });
    }
  },
  fetchStickyProducts: async (dispatch, collection_id, per_page = 8) => {
    // dispatch({type: types.FETCH_PRODUCTS_STICKY_PENDING});

    const json = await ShopifyAPI.productSticky(collection_id, per_page, page);
    if (json === undefined) {
      dispatch({ type: types.FETCH_PRODUCTS_STICKY_FAILURE, message: Languages.ErrorMessageRequest });
    } else if (json.code) {
      dispatch({ type: types.FETCH_PRODUCTS_STICKY_FAILURE, message: json.message });
    } else {
      dispatch({ type: types.FETCH_PRODUCTS_STICKY_SUCCESS, productSticky: json });
    }
  },
  fetchAllProducts: async (dispatch, per_page = 20, filter) => {
    // dispatch({type: types.FETCH_PRODUCTS_PENDING});

    const json = await ShopifyAPI.getAllProducts(filter, per_page);
    if (json === undefined) {
      dispatch({ type: types.FETCH_PRODUCTS_FAILURE, message: Languages.ErrorMessageRequest });
    } else {
      dispatch({ type: types.FETCH_ALL_PRODUCTS_SUCCESS, items: json });
    }
  },
  fetchProduct: async (dispatch, productId) => {
    // dispatch({type: types.FETCH_PRODUCT_DETAIL_PENDING});

    const json = await ShopifyAPI.fetchProduct(productId);
    if (json === undefined) {
      dispatch({ type: types.FETCH_PRODUCT_DETAIL_FAILURE, message: Languages.ErrorMessageRequest });
    } else if (json.code) {
      dispatch({ type: types.FETCH_PRODUCT_DETAIL_FAILURE, message: json.message });
    } else {
      dispatch({ type: types.FETCH_PRODUCT_DETAIL_SUCCESS, productDetail: json });
    }
  },
  fetchProductRelated: async (dispatch, tag, excludeId = []) => {
    // dispatch({type: types.FETCH_PRODUCTS_RELATED_PENDING});

    const json = await ShopifyAPI.fetchProductRelated(tag, excludeId);
    if (json === undefined) {
      dispatch({ type: types.FETCH_PRODUCTS_RELATED_FAILURE, message: Languages.ErrorMessageRequest });
    } else if (json.code) {
      dispatch({ type: types.FETCH_PRODUCTS_RELATED_FAILURE, message: json.message });
    } else {
      dispatch({ type: types.FETCH_PRODUCTS_RELATED_SUCCESS, productRelated: json });
    }
  },
  switchLayoutHomePage: (layout) => {
    return { type: types.SWITCH_LAYOUT_HOME, layout };
  },

  fetchProductsByCollections: async (dispatch, categoryId, page, index) => {
    // dispatch({type: types.FETCH_PRODUCTS_PENDING});
    const per_page = 10;

    const json = await ShopifyAPI.productsByCategoryId(categoryId, per_page, page);

    if (json === undefined) {
      dispatch(actions.fetchProductsFailure('Can\'t get data from server'));
    } else if (json.code) {
      dispatch(actions.fetchProductsFailure(json.message));
    } else {
      if (page > 1) {
        dispatch({ type: types.COLLECTION_FETCH_MORE, payload: json, extra: { index }, finish: json.length == 0 });
      }
      dispatch({ type: types.COLLECTION_FETCH_SUCCESS, payload: json, extra: { index }, finish: json.length == 0 });
    }
  },
  fetchNextPage: async (dispatch, list) => {
    dispatch({ type: types.FETCH_PRODUCTS_PENDING });
    
    const json = await ShopifyAPI.fetchNextPage(list);
    if (json === undefined) {
      dispatch({ type: types.FETCH_PRODUCTS_FAILURE, message: Languages.ErrorMessageRequest });
    } else {
      dispatch({ type: types.FETCH_ALL_PRODUCTS_SUCCESS, items: json });
    }
  }
};

export default actions;
