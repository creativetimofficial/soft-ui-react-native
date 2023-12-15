import {Constants, Images} from './index';
import {findIndex} from 'lodash';

import _Icon from '@expo/vector-icons/MaterialCommunityIcons';
export const Icon = _Icon;

import _IconIO from '@expo/vector-icons/Ionicons';
export const IconIO = _IconIO;

import {DeviceEventEmitter} from 'react-native';
export const EventEmitter = DeviceEventEmitter;

import _Timer from 'react-timer-mixin';
export const Timer = _Timer;

// import _Validate from './ultils/Validate';
// export const Validate = _Validate;

import _BlockTimer from './BlockTimer';
export const BlockTimer = _BlockTimer;

// import _FacebookAPI from './services/FacebookAPI';
// export const FacebookAPI = _FacebookAPI;

// import reactotron from 'reactotron-react-native'
// export const Reactotron = reactotron;

//TODO: replace those function after app go live
// export const log = (values) => __DEV__ && reactotron.log(values);
// export const warn = (values) => __DEV__ && reactotron.warn(values);
// export const error = (values) => __DEV__ && reactotron.error(values);

/**
 * An async fetch with error catch
 * @param url
 * @param data
 * @returns {Promise.<*>}
 */
export const request = async (url, data = {}) => {
  try {
    const response = await fetch(url, data);
    return await response.json();
  } catch (err) {
    // error(err);
    return {error: err};
  }
};

//Drawer
export const openDrawer = () =>
  EventEmitter.emit(Constants.EmitCode.SideMenuOpen);
export const closeDrawer = () =>
  EventEmitter.emit(Constants.EmitCode.SideMenuClose);
export const openModalFilter = () =>
  EventEmitter.emit(Constants.EmitCode.ModalOpen);
export const closeModalFilter = () =>
  EventEmitter.emit(Constants.EmitCode.ModalClose);

/**
 * Display the message toast-like (work both with Android and iOS)
 * @param msg Message to display
 * @param duration Display duration
 */
export const toast = (msg, duration = 4000) =>
  EventEmitter.emit(Constants.EmitCode.Toast, msg, duration);

import _ from 'lodash';
import _currencyFormatter from 'currency-formatter';
export const currencyFormatter = _.bind(
  _currencyFormatter.format,
  undefined,
  _,
  {
    symbol: '$',
    decimal: '.',
    thousand: ',',
    precision: 2,
    format: '%s%v', // %s is the symbol and %v is the value
  },
);

const ThumbnailSizes = {
  CatalogImages: {
    width: 300,
    height: 360,
  },
  SingleProductImage: {
    width: 600,
    height: 720,
  },
  ProductThumbnails: {
    width: 180,
    height: 216,
  },
};

// import {PixelRatio} from 'react-native';
export const getProductImage = (image, sizeName) => {
  // as the shopify not support optimize image
  if (image == null) {
    return Images.PlaceHolderURL;
  }

  const indexImage = findIndex(image.variants, (img) => img.name == sizeName);

  if (indexImage >= 0) {
    return image.variants[indexImage].src;
  }
  return image.src;
};
