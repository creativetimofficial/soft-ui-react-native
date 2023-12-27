import {Constants} from '@common';
import types from './types';
import _actions from './actions';

const initialState = {
  cartItems: [],
  total: 0,
  totalPrice: 0,
  myOrders: [],
  isFetching: false,
};

export const actions = _actions;

const compareCartItem = (cartItem, action) => {
  if (
    cartItem.variation !== undefined &&
    action.variation !== undefined &&
    cartItem.variation != null &&
    action.variation != null
  )
    return (
      cartItem.product.id === action.product.id &&
      cartItem.variation.id === action.variation.id
    );
  else return cartItem.product.id === action.product.id;
};

const cartItem = (
  state = {product: undefined, quantity: 1, variation: undefined},
  action,
) => {
  switch (action.type) {
    case types.ADD_CART_ITEM:
      return state.product === undefined
        ? Object.assign({}, state, {
            product: action.product,
            variation: action.variation,
          })
        : !compareCartItem(state, action)
        ? state
        : Object.assign({}, state, {
            quantity:
              state.quantity < Constants.LimitAddToCart
                ? state.quantity + 1
                : state.quantity,
          });
    case types.REMOVE_CART_ITEM:
      return !compareCartItem(state, action)
        ? state
        : Object.assign({}, state, {quantity: state.quantity - 1});
    default:
      return state;
  }
};

export default (state = initialState, action) => {
  const {type} = action;

  switch (type) {
    case types.ADD_CART_ITEM: {
      const isExisted = state.cartItems.some((cartItem) =>
        compareCartItem(cartItem, action),
      );
      return Object.assign(
        {},
        state,
        isExisted
          ? {cartItems: state.cartItems.map((item) => cartItem(item, action))}
          : {cartItems: [...state.cartItems, cartItem(undefined, action)]},
        {
          total: state.total + 1,
          totalPrice:
            state.totalPrice +
            Number(
              action.variation === undefined ||
                action.variation == null ||
                action.variation.price === undefined
                ? action.product.price
                : action.variation.price,
            ),
        },
      );
    }
    case types.REMOVE_CART_ITEM: {
      const index = state.cartItems.findIndex((cartItem) =>
        compareCartItem(cartItem, action),
      ); // check if existed
      return index == -1
        ? state //This should not happen, but catch anyway
        : Object.assign(
            {},
            state,
            state.cartItems[index].quantity == 1
              ? {
                  cartItems: state.cartItems.filter(
                    (cartItem) => !compareCartItem(cartItem, action),
                  ),
                }
              : {
                  cartItems: state.cartItems.map((item) =>
                    cartItem(item, action),
                  ),
                },
            {
              total: state.total - 1,
              totalPrice:
                state.totalPrice -
                Number(
                  action.variation === undefined ||
                    action.variation == null ||
                    action.variation.price === undefined
                    ? action.product.price
                    : action.variation.price,
                ),
            },
          );
    }
    case types.DELETE_CART_ITEM: {
      const index1 = state.cartItems.findIndex((cartItem) =>
        compareCartItem(cartItem, action),
      ); // check if existed
      return index1 == -1
        ? state //This should not happen, but catch anyway
        : Object.assign({}, state, {
            cartItems: state.cartItems.filter(
              (cartItem) => !compareCartItem(cartItem, action),
            ),
            total: state.total - Number(action.quantity),
            totalPrice:
              state.totalPrice -
              Number(action.quantity) *
                Number(
                  action.variation === undefined ||
                    action.variation == null ||
                    action.variation.price === undefined
                    ? action.product.price
                    : action.variation.price,
                ),
          });
    }
    case types.EMPTY_CART:
      return Object.assign({}, state, {
        type: types.EMPTY_CART,
        cartItems: [],
        total: 0,
        totalPrice: 0,
      });
    case types.INVALIDATE_CUSTOMER_INFO:
      return Object.assign({}, state, {
        message: action.message,
        type: types.INVALIDATE_CUSTOMER_INFO,
      });
    case types.VALIDATE_CUSTOMER_INFO:
      return Object.assign({}, state, {
        message: null,
        type: types.VALIDATE_CUSTOMER_INFO,
        customerInfo: action.customerInfo,
      });
    case types.CREATE_NEW_ORDER_SUCCESS:
      return Object.assign({}, state, {
        type: types.CREATE_NEW_ORDER_SUCCESS,
        cartItems: [],
        total: 0,
        totalPrice: 0,
      });
    case types.CREATE_NEW_ORDER_ERROR:
      return Object.assign({}, state, {
        type: types.CREATE_NEW_ORDER_ERROR,
        message: action.message,
      });
    case types.FETCH_MY_ORDER:
      return Object.assign({}, state, {
        type: types.FETCH_MY_ORDER,
        isFetching: false,
        myOrders: action.data,
      });
    case types.FETCH_CART_PENDING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    default: {
      return state;
    }
  }
};
