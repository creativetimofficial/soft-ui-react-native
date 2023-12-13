import {Constants} from "@common"
import types from './types'
import _actions from './actions'

export const actions = _actions;

const initialState = {
  wishListItems: [],
  total: 0,
  totalPrice: 0
};

const compareWishListItem = (wishListItem, action) => {
  return wishListItem.product.id === action.product.id
}


const wishListItem = (state = {product: undefined, variation: undefined}, action) => {
  switch (action.type) {
    case types.ADD_WISHLIST_ITEM:
      return Object.assign({}, state, {product: action.product})
    default:
      return state
  }
}

export default (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case types.ADD_WISHLIST_ITEM: {
      const isExisted = state.wishListItems.some((wishListItem) => compareWishListItem(wishListItem, action))
      return isExisted ? state : Object.assign({}, state,
        {
          wishListItems: [...state.wishListItems, wishListItem(undefined, action)],
          total: state.total + 1,
        },
      )
    }
    case types.REMOVE_WISHLIST_ITEM: {
      const index1 = state.wishListItems.findIndex((wishListItem) => compareWishListItem(wishListItem, action)) // check if existed
      return index1 == -1 ? state : //This should not happen, but catch anyway
        Object.assign({}, state, {
          wishListItems: state.wishListItems.filter((wishListItem) => !compareWishListItem(wishListItem, action)),
          total: state.total - 1,
        })
    }
    case types.EMPTY_WISHLIST:
      return Object.assign({}, state, {
        wishListItems: [],
        total: 0,
      })
    default: {
      return state;
    }
  }
};

