/**
 * Created by InspireUI on 05/01/2017.
 */

import { error, toast, log, warn } from "./../Omni";

import { Platform } from "react-native";
import * as Facebook from 'expo-facebook';
import { Constants } from "@common";

const LoginBehaviors = {
  native_with_fallback: "native",
  native_only: "native_only",
  web_only: "web_only"
};

class FacebookAPI {
  constructor() {
    // Expo.Facebook.setLoginBehavior(LoginBehaviors.native_with_fallback);
  }

  async login() {
    try {
      await Facebook.initializeAsync('<APP_ID>');
      const ask = await Facebook.logInWithReadPermissionsAsync(
        Constants.appFacebookId,
        {
          permissions: ["public_profile", "email", "user_friends"],
          behavior: Platform.OS === "ios" ? "web" : "browser"
        }
      );
      const { type } = ask;

      if (type === "cancel") return; // throw user_cancel;
      if (type === "success") {
        // const option = {parameters: {fields: {string: 'first_name,last_name,email,picture.height(961)'}}};
        // const infoRequest = new Expo.Facebook('/me', option, callback);
        // new Expo.Facebook.GraphRequestManager().addRequest(infoRequest).start();
        const { token } = ask;
        const response = await fetch(
          `https://graph.facebook.com/me?fields=name,first_name,last_name,id,email,picture&access_token=${token}`
        );
        return response.json();
      }
    } catch (err) {
      // if (err.framesToPop === 1 && err.code === 'EUNSPECIFIED') {
      //     if (Platform.OS === 'android') {
      //         Expo.Facebook.setLoginBehavior(LoginBehaviors.web_only);
      //     }
      // }
      //     return callback('Sorry, Can\'t get data from Facebook. Please try other login method', undefined);
      // }
      // callback(err, undefined);
    }
  }

  logout() {
    Facebook.logOut();
    log("Facebook logout!");
  }

  async getAccessToken() {
    return await Facebook.getCurrentExpo.Facebook();
  }

  async shareLink(link, desc) {
    const shareLinkContent = {
      contentType: "link",
      contentUrl: link,
      contentDescription: desc
    };
    try {
      const canShow = await Facebook.canShow(shareLinkContent); // Check if we have share permission
      if (canShow) {
        const result = await Facebook.show(shareLinkContent);
        if (!result.isCancelled) {
          toast("Post shared");
          log("Share a post with id: " + result.postId);
        }
      }
    } catch (error) {
      toast("An error occurred. Please try again later");
      error("Share post fail with error: " + error);
    }
  }
}

export default new FacebookAPI();
