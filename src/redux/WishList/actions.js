import types from './types'
import ShopifyAPI from '@services/ShopifyAPI';

export default {
  addWishListItem:(dispatch,product, variation)=>{
    dispatch({
      type: types.ADD_WISHLIST_ITEM,
      product: product
    })
  },

  removeWishListItem:(dispatch,product, variation) =>{
    dispatch({
      type: types.REMOVE_WISHLIST_ITEM,
      product: product
    })
  },
  emptyWishList:(dispatch) =>{
    dispatch({
      type: types.EMPTY_WISHLIST
    })
  }
};
