/**
 * Created by InspireUI on 01/03/2017.
 * An API for JSON API Auth Word Press plugin.
 * https://wordpress.org/plugins/json-api-auth/
 */

import {Constants} from '@common';
import {request, error} from './../Omni';

const url = Constants.WordPress.url;
const isSecured = url.startsWith('https');
const secure = isSecured ? '' : '&insecure=cool';

const WPUserAPI = {
  login: async (username, password) => {
    const _url = `${url}/api/user/generate_auth_cookie/?username=${username}&password=${password}${secure}`;
    return await request(_url);
  },
  register: async ({
    username,
    email,
    firstName,
    lastName,
    password = undefined,
  }) => {
    try {
      const nonce = await WPUserAPI.getNonce();
      //Optional fields: 'user_pass', 'user_nicename', 'user_url', 'nickname', 'first_name', 'last_name',
      //'description', 'rich_editing', 'user_registered', 'jabber', 'aim', 'yim',
      //'comment_shortcuts', 'admin_color', 'use_ssl', 'show_admin_bar_front'.
      let _url =
        `${url}/api/user/register/?` +
        `username=${username}` +
        `&email=${email}` +
        `&display_name=${firstName + '+' + lastName}` +
        `&first_name=${firstName}` +
        `&last_name=${lastName}` +
        (password ? `&user_pass=${password}` : '') +
        `&nonce=${nonce}` +
        '&notify=both' +
        secure;
      return await request(_url);
    } catch (err) {
      error(err);
      return {error: err};
    }
  },
  getNonce: async () => {
    const _url = `${url}/api/get_nonce/?controller=user&method=register`;
    const json = await request(_url);
    return json && json.nonce;
  },
  getUserInfo: async (userId) => {
    const _url = `${url}/api/user/get_userinfo/?user_id=${userId}` + secure;
    return await request(_url);
  },
};

export default WPUserAPI;
