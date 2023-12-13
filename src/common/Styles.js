/**
 * Created by InspireUI on 20/12/2016.
 */
import { Dimensions, Platform } from 'react-native';
import Constants from './Constants';
import Device from './Device'
import Color from './Color';

const { height, width, heightWindow } = Dimensions.get('window');

let Styles = {
  width: Dimensions.get('window').width,
  height: Platform.OS !== 'ios' ? height : (height - 20),
  navBarHeight: Platform !== 'ios' ? (height - heightWindow) : 0,
  headerHeight: Platform.OS === 'ios' ? 40 : 56,

  thumbnailRatio: 1.2, //Thumbnail ratio, the product display height = width * thumbnail ratio

  app: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingTop: Device.ToolbarHeight,
  },
  FontSize: {
    tiny: 12,
    small: 14,
    medium: 16,
    big: 18,
    large: 20,
  },
  IconSize: {
    TextInput: 25,
    ToolBar: 18,
    Inline: 20,
  },
  FontFamily: {},
  app: {
    flexGrow: 1,
    backgroundColor: Color.main,
    paddingTop: Device.ToolbarHeight
  },
  FontSize: {
    tiny: 12,
    small: 14,
    medium: 16,
    big: 18,
    large: 20,
  },
  IconSize: {
    TextInput: 25,
    ToolBar: 18,
    Inline: 20,
  },
  FontFamily: {}
};

Styles.Common = {
  Column: {},
  ColumnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ColumnCenterTop: {
    alignItems: 'center',
  },
  ColumnCenterBottom: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ColumnCenterLeft: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  ColumnCenterRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  Row: {
    flexDirection: 'row',

    ...Platform.select({
      ios: {
        top: (Device.isIphoneX ? -15 : 0),
      },
      android: {
        top: 0,
      }
    })
  },
  RowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RowCenterTop: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  RowCenterBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  RowCenterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RowCenterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  RowCenterBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  //More traits

  IconSearchView: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    borderRadius: 50,

    shadowOffset: { width: 0, height: -4 },
    shadowColor: 'rgba(0,0,0, .3)',
    elevation: 10,
    shadowOpacity: 0.1,
    zIndex: 9999,
  },
  IconSearch: {
    width: 20,
    height: 20,
    margin: 12,
    zIndex: 9999,
  },
  logo: {
    width: Platform.OS === 'ios' ? 180 : 200,
    height: Platform.OS === 'ios' ? 20 : 20,
    resizeMode: "contain",
    ...Platform.select({
      ios: {
        marginTop: Device.isIphoneX ? -40 : -15,
      },
      android: {
        marginTop: 2,
        marginLeft: -15
      }
    })
  },
  toolbar: {
    backgroundColor: Color.navigationBarColor,
    // position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 0,
    ...Platform.select({
      ios: {
        height: (Device.isIphoneX ? 5 : 25),
      },
      android: {
        height: 46,
        paddingTop: 0,
        marginTop: -10,
      }
    })
  },
  IconSearch: {
    width: 20,
    height: 20,
    margin: 12,
    zIndex: 9999,
  },
  headerStyle: {
    color: Color.navigationTitleColor,
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: Constants.fontFamily,
    ...Platform.select({
      ios: {
        marginBottom: 0,
        marginTop: Device.isIphoneX ? -20 : 2,
      },
      android: {
        marginBottom: 4
      }
    })
  },
  headerStyleWishList: {
    color: Color.navigationTitleColor,
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: Constants.fontFamily,
    marginBottom: (Device.isIphoneX ? 25 : 5),
  },
  toolbarIcon: {
    "width": 16,
    "height": 16,
    "resizeMode": "contain",

    "marginRight": 12,
    "marginBottom": 12,
    "marginLeft": 8,
    "opacity": 0.8,
    ...Platform.select({
      ios: {
        marginTop: (Device.isIphoneX ? -30 : -3),
      },
      android: {
        marginTop: 10
      }
    })
  },
  iconBack: {
    width: 24,
    marginLeft: 20,
  },
  toolbarFloat: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    borderBottomWidth: 0,

    width: width,
    ...Platform.select({
      ios: {
        height: (Device.isIphoneX ? 5 : 25),
      },
      android: {
        height: 46,
        paddingTop: 0,
      }
    })
  },
  viewCover: {
    backgroundColor: "#FFF",
    zIndex: 99999,
    bottom: 0,
    left: 0,
    width,
    height: 20,
    // position: "absolute",
  },
  viewCoverWithoutTabbar: {
    backgroundColor: "#FFF",
    zIndex: 99999,
    bottom: 0,
    left: 0,
    width,
    height: 35,
    position: "absolute",
  },
};

export default Styles;
