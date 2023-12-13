'use strict';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Constants} from './Constants';
import {AllHtmlEntities} from 'html-entities';
import truncate from 'lodash/truncate';
import URI from 'urijs';
export default class Tools {
  /**
   * refresh the tab bar & read later page
   */
  static getImage(data, imageSize) {
    // console.log(data);

    if (typeof data === 'undefined' || data == null) {
      return '';
    }
    if (typeof imageSize === 'undefined') {
      imageSize = 'medium';
    }

    var imageURL =
      typeof data.better_featured_image !== 'undefined' &&
      data.better_featured_image != null
        ? data.better_featured_image.source_url
        : '';

    if (typeof data._embedded !== 'undefined') {
      if (typeof data._embedded['wp:featuredmedia'] !== 'undefined') {
        if (
          typeof data._embedded['wp:featuredmedia'][0].media_details !==
          'undefined'
        ) {
          if (
            typeof data._embedded['wp:featuredmedia'][0].media_details.sizes !==
            'undefined'
          ) {
            if (
              typeof data._embedded['wp:featuredmedia'][0].media_details.sizes[
                imageSize
              ] !== 'undefined'
            ) {
              imageURL =
                data._embedded['wp:featuredmedia'][0].media_details.sizes[
                  imageSize
                ].source_url;
            }

            if (
              imageURL == '' &&
              typeof data._embedded['wp:featuredmedia'][0].media_details.sizes
                .medium !== 'undefined'
            ) {
              imageURL =
                data._embedded['wp:featuredmedia'][0].media_details.sizes.medium
                  .source_url;
            }

            if (
              imageURL == '' &&
              typeof data._embedded['wp:featuredmedia'][0].media_details.sizes
                .full !== 'undefined'
            ) {
              imageURL =
                data._embedded['wp:featuredmedia'][0].media_details.sizes.full
                  .source_url;
            }
          }
        }
      }
    }

    if (imageURL == '') {
      return Constants.PlaceHolder;
    }

    return imageURL;
  }
  static getDescription(desc, limit) {
    if (typeof limit === 'undefined') {
      limit = 50;
    }
    var desc = desc.replace('<p>', '');
    desc = truncate(desc, {length: limit, separator: ' '});

    return AllHtmlEntities.decode(desc);
  }

  static getLinkVideo(content) {
    const regExp =
      /^.*((www.youtube.com\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\??v?=?))([^#&\?\/\ ]*).*/;
    var embedId = '';
    var youtubeUrl = '';

    URI.withinString(content, function (url) {
      var match = url.match(regExp);
      if (match && match[7].length === 11) {
        embedId = match[7];
        youtubeUrl = 'www.youtube.com/embed/' + embedId;
      }
    });
    return youtubeUrl;
  }
  static async getFontSizePostDetail() {
    const data = await AsyncStorage.getItem('@setting_fontSize');
    if (typeof data !== 'undefined') {
      return parseInt(data);
    }
    return Constants.fontText.size;
  }
}
