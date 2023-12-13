import {Constants} from "@common"
import actions from './actions'
import types from './types'

const initialState = {
  isFetching: false,
  layoutHome: Constants.Layout.horizal,

  error: null,
  list: [],
  listAll: [],
  stillFetch: true,

  productFinish: false,
  productsByName: [],
  productSticky: [],
  productDetail: {},
  productRelated: [],
}

export {actions};

export default (state = initialState, action) => {
  const {type, error, items, page} = action;
  switch (type) {
    case types.FETCH_PRODUCTS_PENDING: {
      return {
        ...state,
        isFetching: true,
        error: null
      };
    }
    case types.FETCH_ALL_PRODUCTS_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        listAll: [...state.listAll, ...items],
        stillFetch: items.length !== 0,
        error: null,
        productFinish: items.length < Constants.pagingLimit,
      });
    }
    case types.FETCH_PRODUCTS_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        list: page == 1 ? items : state.list.concat(items),
        stillFetch: items.length !== 0,
        error: null,
        productFinish: items.length < Constants.pagingLimit,
      });
    }
    case types.FETCH_PRODUCTS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error: action.message
      };
    }

    case types.CLEAR_PRODUCTS: {
      initialState.listAll = state.listAll;
      initialState.productSticky = state.productSticky;
      return Object.assign({}, initialState);
    }

    case types.INIT_PRODUCTS: {
      return {
        ...state,
        listAll: [],
      };
    }

    case types.FETCH_REVIEWS_PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.FETCH_REVIEWS_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        reviews: action.reviews,
      });
    }
    case types.FETCH_REVIEWS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    }
    case types.FETCH_PRODUCTS_BY_TAGS_PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.FETCH_PRODUCTS_BY_TAGS_SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        products: action.products,
      });
    }
    case types.FETCH_PRODUCTS_BY_TAGS_FAILURE: {
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    }

    case types.FETCH_PRODUCTS_BY_NAME_PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.FETCH_PRODUCTS_BY_NAME_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        productsByName: action.productsByName,
      };
    }
    case types.FETCH_PRODUCTS_BY_NAME_FAILURE: {
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    }

    case types.FETCH_PRODUCTS_STICKY_PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.FETCH_PRODUCTS_STICKY_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        productSticky: action.productSticky,
      };
    }
    case types.FETCH_PRODUCTS_STICKY_FAILURE: {
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    }

    case types.FETCH_PRODUCT_DETAIL_PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.FETCH_PRODUCT_DETAIL_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        productDetail: action.productDetail,
      };
    }
    case types.FETCH_PRODUCT_DETAIL_FAILURE: {
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    }

    case types.FETCH_PRODUCTS_RELATED_PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case types.FETCH_PRODUCTS_RELATED_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        productRelated: action.productRelated,
      };
    }
    case types.FETCH_PRODUCTS_RELATED_FAILURE: {
      return {
        ...state,
        isFetching: false,
        message: action.message
      };
    }

    case types.SWITCH_LAYOUT_HOME: {
      return {
        ...state,
        layoutHome: action.layout,
      };
    }

    default: {
      return state;
    }
  }
};
