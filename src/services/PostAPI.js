/**
 * Created by InspireUI on 13/06/2017.
 */

import WPAPI from "wpapi";
import {Constants} from "@common";

var wpAPI = new WPAPI({
    endpoint: Constants.WordPress.url + '/wp-json'
});

export default wpAPI;
