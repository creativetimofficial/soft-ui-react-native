import types from './types'
import {flatten, pickBy, identity} from 'lodash'
import {HorizonLayouts} from "@common";
import {warn} from '@app/Omni'
import {REHYDRATE} from 'redux-persist'

const initialState = HorizonLayouts;

export default (state = initialState, action) => {
  const {extra, type, payload, finish} = action;

  switch (type) {
    case REHYDRATE:
      const layouts = action.payload.layouts;
    // if (typeof layouts != 'undefined') {
    //   return {...state, ...action.payload.layouts};
    // }

    case types.COLLECTION_FETCH_SUCCESS:
      return state.map((item, index) => {
        if (typeof extra != 'undefined' && index !== extra.index) {
          return item;
        }
        return {
          ...item,
          list: flatten(payload)
        };
      });

    case types.COLLECTION_FETCH_MORE:
      return state.map((item, index) => {
        if (typeof extra != 'undefined' && index !== extra.index) {
          return item;
        }
        return {
          ...item,
          list: item.list.concat(flatten(payload)),
          finish: finish
        };
      });

    default:
      return state;
  }
};
