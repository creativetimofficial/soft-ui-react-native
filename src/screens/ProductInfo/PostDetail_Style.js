import React, {Platform, StyleSheet, Dimensions, PixelRatio} from "react-native";
import {Color, Constants, Styles} from '@common';

const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default  StyleSheet.create({
    "fill": {
        "flex": 1,
        "backgroundColor": "#ffffff"
    },
    "card": {
        "width": width,
        "flexDirection": "row"
    },
    "box": {
        "width": vw * 40,
        "height": 100,
        "backgroundColor": "#ccc",
        "marginLeft": 20,
        "marginTop": 10,
        "marginBottom": 10
    },
    "header": {
        "position": "absolute",
        "top": 0,
        "left": 0,
        "zIndex": 2,
        "right": 0,
        "backgroundColor": "rgba(255, 255, 255, 0.5)",
        "overflow": "hidden",
        "height": Constants.Window.headerHeight
    },
    "linearGradient": {
        "height": 50,
        "zIndex": 3,
        "width": width,
        "alignItems": "flex-start",
        "justifyContent": "flex-start",
        "position": "absolute"
    },
    "linearGradientBottom": {
        "height": 50,
        "bottom": 0,
        "zIndex": 3,
        "width": width,
        "alignItems": "flex-end",
        "justifyContent": "flex-end",
        "position": "absolute"
    },
    "headerIcon": {
        "height": 40,
        "position": "absolute",
        "top": 0,
        "width": width,
        "zIndex": 4
    },
    "image": {
        "width": vw * 40,
        "height": 90,
        "resizeMode": "cover",
        "marginLeft": 8,
        "marginTop": 20,
        "marginBottom": 10
    },
    "content": {
        "width": vw * 50,
        "marginLeft": 14,
        "marginTop": 20,
        "marginBottom": 30
    },
    "greyRow": {
        "backgroundColor": "#eee"
    },
    "menuView": {
        "backgroundColor": "#F4F4F4",
        "height": 40
    },
    "menuItemView": {
        "marginTop": 6,
        "marginRight": 6,
        "marginBottom": 6,
        "marginLeft": 6,
        "height": 28
    },
    "menuItem": {
        "marginTop": 6,
        "marginRight": 16,
        "marginBottom": 6,
        "marginLeft": 16,
        "fontSize": 12,
        "fontWeight": "500",
        "color": "#8A939C"
    },
    "menuItemActive": {
        "backgroundColor": "#fff",
        "borderRadius": 16,
        "borderWidth": 1,
        "borderColor": "#eee"
    },
    "menuActiveText": {
        "color": "#000"
    },
    "bannerImage": {
        "width": width,
        "height": width / 2 + 40,
        "backgroundColor": "rgba(67, 130, 208, 0.2)"
    },
    "placeHolderImage": {
        "alignItems": "center",
        "width": width,
        "height": width/3,
        "justifyContent": "center",
        "backgroundColor": "rgba(67, 130, 208, 0.2)"
    },
    "backgroundOne": {
        "backgroundColor": "rgba(58, 75, 133, 0.6)"
    },
    "backgroundTwo": {
        "backgroundColor": "rgba(188, 59, 36, 0.6)"
    },
    "backgroundThree": {
        "backgroundColor": "rgba(57, 174, 84, 0.6)"
    },
    "bannerText": {
        "position": "absolute",
        "bottom": 30,
        "backgroundColor": "rgba(0, 0, 0, 0.3)",
        "width": vw * 60
    },
    "bannerTitle": {
        "marginTop": 12,
        "marginRight": 12,
        "marginBottom": 2,
        "marginLeft": 12,
        "color": "white",
        "fontSize": 15
    },
    "bannerDate": {
        "color": "rgba(255, 255, 255, 0.7)",
        "fontSize": 9,
        "fontWeight": "500",
        "marginLeft": 12,
        "marginBottom": 12
    },
    "time": {
        "color": "#999",
        "fontSize": 12,
        "marginTop": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "tagView": {
        "flexDirection": "row",
        "alignItems": "flex-start",
        "justifyContent": "flex-start",
        "marginBottom": 6
    },
    "tag": {
        "backgroundColor": "#aaa",
        "borderRadius": 12,
        "alignSelf": "flex-start",
        "marginRight": 4
    },
    "tagText": {
        "fontSize": 9,
        "marginTop": 1,
        "marginRight": 8,
        "marginBottom": 1,
        "marginLeft": 8,
        "color": "white",
        "fontWeight": "600"
    },
    "hlist": {
        "flex": 1,
        "backgroundColor": "white",
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "color": {
        "position": "absolute",
        "top": 0,
        "bottom": 0,
        "left": 0,
        "right": 0,
        "backgroundColor": "#EBEBEB"
    },
    "title": {
        "color": "#333",
        "fontSize": 22,
        "textAlign": "center",
        "fontWeight": "200",
        "marginTop": 12
    },
    "titleSmall": {
        "fontSize": 13,
        "color": "#999",
        "textAlign": "center",
        "marginBottom": 10,
        "marginTop": 4
    },
    "productItem": {
        "width": width-30,
        "height": 400,
        "marginTop": 5,
        "marginRight": 5,
        "marginBottom": 5,
        "marginLeft": 5
    },
    "detailBlock": {
        "alignItems": "center",
        "backgroundColor": "#fff",
        "paddingTop": 20,
        "paddingRight": 20,
        "paddingBottom": 20,
        "paddingLeft": 20,
        "width": width
    },
    "scrollViewContent": {
        "marginTop": Constants.Window.headerHeight,
        "position": "relative",
        "marginBottom": 100
    },
    "detailDesc": {
        "color": "#333",
        "width": width - 20,
        "marginTop": 16,
        "marginRight": 16,
        "marginBottom": 2,
        "marginLeft": 13,
        "fontWeight": "500",
        "fontSize": 22,
        "textAlign": Constants.RTL ? 'right' : 'left'
    },
    "largeImage": {
        "width": width,
        "height": width - 120,
        "resizeMode": "cover"
    },
    "largeContent": {
        "width": width,
        "position": "absolute",
        "bottom": 0,
        "height": 100
    },
    "largeTitle": {
        "color": "#fff",
        "fontSize": 18,
        "paddingTop": 20,
        "paddingRight": 20,
        "paddingBottom": 0,
        "paddingLeft": 20
    },
    "description": {
        "backgroundColor": "#fff",
        "flexDirection": "row"
    },
    "imageBackGround": {
        "position": "absolute",
        "top": 0,
        "left": 0,
        "right": 0,
        "width": width,
        "height": Constants.Window.headerHeight 
    },
    "detailPanel": {
        "height": 380,
        "width": width,
        "alignItems": "center",
        "justifyContent": "flex-end"
    },
    "toolbar": {
        "backgroundColor": "black"
    },
    "shareIcon": {
        "flexDirection": "row",
        "width": 100,
        "position": "absolute",
        "right": 0,
        "bottom": 16
    },
    "newsIcons": {
        "color": "#999",
        "marginLeft": 20
    },
    "newsTitle": {
        "fontSize": 18,
        "marginTop": 20,
        "marginRight": 20,
        "marginBottom": 20,
        "marginLeft": 20,
        "color": "white",
        "fontWeight": "400",
        "textAlign": "left",
        "backgroundColor": "transparent"
    },
    "avatar": {
        "width": 32,
        "height": 32,
        "borderRadius": 20,
        "resizeMode": "cover",
        "marginTop": 12,
        "marginRight": 12,
        "marginBottom": 12,
        "marginLeft": 12
    },
    "wrapComment": {
        "paddingLeft": 15,
        "paddingRight": 15,
        "backgroundColor": "#F7F7F7",
        "flex": 2/6
    },
    "headCommentText": {
        "fontSize": 20,
        "fontWeight": "600"
    },
    "titleVideo": {
        "flex": 1/6,
        "paddingLeft": 15,
        "paddingRight": 12
    },
    "titleVideoText": {
        "fontSize": 18,
        "color": "rgb(11,6,6)",
        "lineHeight": 22,
        "fontWeight": "bold"
    },
    "countViews": {
        "flex": 1/6,
        "marginTop": 15,
        "marginLeft": 15,
        "marginBottom": 5
    },
    "countViewsText": {
        "fontSize": 18,
        "lineHeight": 18,
        "color": "rgb(149,149,149)"
    },
    "wrapLikeShare": {
        "flex": 1/6,
        "marginTop": 5,
        "marginRight": 10,
        "marginBottom": 5,
        "flexDirection": "row",
        "justifyContent": "flex-end"
    },
    "wrapLikeShareInner": {
        "flexDirection": "row"
    },
    "icon": {
        "flexDirection": "row",
        "marginRight": 10
    },
    "numberIcon": {
        "marginLeft": 5,
        "fontSize": 18
    },
    "author": {
        "color": "#999",
        "fontSize": 13,
        "fontWeight": "600",
        "marginTop": 12,
        "marginRight": 12,
        "marginBottom": 12,
        "marginLeft": 12,
        "textAlign": Constants.RTL ? 'right': 'left'
    },
    "relatedPostText": {
        "fontSize": 16,
        "fontWeight": "bold",
        "paddingTop": 10,
        "paddingRight": 10,
        "paddingBottom": 10,
        "paddingLeft": 10
    },
    "shareIcons": {
        "flexDirection": "row",
        "justifyContent": "flex-end",
        "position": "absolute",
        "width": Platform.OS === 'android' ? width/2 - 70 : width / 2 - 90,
        "right": 4,
        "top": 8,
        "zIndex": 10
    },
    "videoView": {
        "backgroundColor": "rgba(0,0,0, .8)",
        "flex": 1
    },
    "video": {
        "height": vh * 40,
        "marginTop": 40,
        "backgroundColor": "#000"
    }
})
