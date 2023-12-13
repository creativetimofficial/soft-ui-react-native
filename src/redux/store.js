import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {persistCombineReducers} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import categories from './Categories';
import products from './Products';
import layouts from './Products/layouts';
import carts from './Carts';
import wishList from './WishList';
import netInfo from './NetInfo';
import toast from './Toast';
import user from './User';
const middleware = [thunk];

const reducers = combineReducers({
  categories,
  products,
  carts,
  wishList,
  netInfo,
  toast,
  user,
  layouts,
});
let store = null;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
store = composeEnhancers(applyMiddleware(...middleware))(createStore)(reducers);
// store = compose(applyMiddleware(...middleware))(createStore)(reducers);
const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    'netInfo',
    'toast',
    'categories',
    // 'layouts'
    // 'user'//TODO: remove this after complete user login
  ],
};

persistCombineReducers(config, store);
export {store};
