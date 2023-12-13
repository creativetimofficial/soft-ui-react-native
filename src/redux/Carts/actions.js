import types from './types'
import ShopifyAPI from '@services/ShopifyAPI';

export default {
  addCartItem: (dispatch, product, variation) => {
    product.price = variation.selectedSize !== "undefined" && product.variants[variation.selectedSize]
      ? product.variants[variation.selectedSize].price : 0;
    dispatch({
      type: types.ADD_CART_ITEM,
      product: product,
      variation: variation,
    })
  },

  fetchMyOrder: (dispatch, user) => {
    dispatch({ type: types.FETCH_CART_PENDING });

    WooWorker.ordersByCustomerId(user.id, 20, 1).then(data => {
      dispatch({
        type: types.FETCH_MY_ORDER,
        data: data,
      })
    }).catch(err => console.log(err));
  },

  removeCartItem: (dispatch, product, variation) => {
    dispatch({
      type: types.REMOVE_CART_ITEM,
      product: product,
      variation: variation,
    })
  },

  deleteCartItem: (dispatch, product, variation, quantity) => {
    dispatch({
      type: types.DELETE_CART_ITEM,
      product: product,
      variation: variation,
      quantity: quantity,
    })
  },

  emptyCart: (dispatch) => {
    dispatch({
      type: types.EMPTY_CART
    })
  },
  validateCustomerInfo: (dispatch, customerInfo) => {
    var { first_name, last_name, address_1, email, phone } = customerInfo
    if (first_name.length == 0 || last_name.length == 0 || address_1.length == 0 || email.length == 0 || phone.length == 0) {
      dispatch({ type: types.INVALIDATE_CUSTOMER_INFO, message: Languages.RequireEnterAllFileds });
    } else if (!Validate.isEmail(email)) {
      dispatch({ type: types.INVALIDATE_CUSTOMER_INFO, message: Languages.InvalidEmail });
    } else {
      dispatch({ type: types.VALIDATE_CUSTOMER_INFO, message: '', customerInfo: customerInfo });
    }
  },
  createNewOrder: async (dispatch, payload) => {
    dispatch({ type: types.CREATE_NEW_ORDER_PENDING });
    const json = await WooWorker.createOrder(payload)


    // console.log('json', json);
    if (json.hasOwnProperty("id")) {
      // dispatch({type: types.EMPTY_CART});
      dispatch({ type: types.CREATE_NEW_ORDER_SUCCESS, orderId: json.id });
    } else {
      dispatch({ type: types.CREATE_NEW_ORDER_ERROR, message: Languages.CreateOrderError });
    }
  },
};
