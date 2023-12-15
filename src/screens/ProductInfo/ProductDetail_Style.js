import {StyleSheet, Dimensions} from 'react-native';
import {Constants, Styles} from '@common';
import {Color} from '@common';
const {width, height} = Dimensions.get('window');

export default {
  container: {
    flex: 1,
    backgroundColor: 'rgba(247, 247, 249, 1)',
    paddingTop: 40,
  },
  naviBar: {
    height: 64,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  naviTitle: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBack: {
    zIndex: 2,
    position: 'absolute',
    top: 20,
    left: 10,
  },
  btnBackImage: {
    height: 30,
    width: 30,
  },
  listContainer: {
    flex: 1,
  },
  productInfo: {
    alignItems: 'center',
    backgroundColor: '#f6f6f8',
  },
  imageSlider: {
    flex: 1,
    marginTop: 0,
  },
  imageProduct: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5,
    width: width - 40,
    resizeMode: 'contain',
  },
  imageProductFull: {
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 4,
  },
  productSizeStyle: {
    marginTop: 10,
    paddingLeft: 20,
    height: 70,
  },
  productSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingRight: 20,
    width: width,
  },
  productSize: {
    marginLeft: 5,
    marginRight: 5,
  },
  productName: {
    textAlign: 'center',
    fontSize: 20,
    color: Color.Text,
    padding: 4,
    marginTop: 0,
  },
  productPrice: {
    textAlign: 'center',
    fontSize: 18,
    color: Color.blackTextSecondary,
  },
  sale_price: {
    textDecorationLine: 'line-through',
    color: Color.blackTextDisable,
    marginLeft: 5,
    marginTop: 4,
  },
  tabButton: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#f5f5f5',
    borderBottomColor: '#f5f5f5',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  textTab: {
    color: 'rgba(183, 196, 203, 1)',
    fontSize: 16,
  },
  tabButtonHead: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    opacity: 0,
  },
  tabItem: {
    flex: 0.25,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  bottomView: {
    height: 50,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f7f9',
  },
  buttonContainer: {
    flex: 0.5,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageButton: {
    width: 20,
    height: 20,
    tintColor: '#ccc',
    flex: 1,
  },
  buttonStyle: {
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBuy: {
    flex: 0.5,
    backgroundColor: Color.BuyNowButton,
  },
  btnBuyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    padding: 20,
    paddingTop: 20,
    backgroundColor: 'rgba(255,255,255,1)',
    alignItems: Constants.RTL ? 'flex-end' : 'flex-start',
  },
  productColorContainer: {
    position: 'absolute',
    top: 50,
    left: Constants.RTL ? width - 50 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: 50,
  },
  productColor: {
    marginTop: 16,
  },
  modalBoxWrap: {
    position: 'absolute',
    borderRadius: 2,
    width: width,
    height: height,
    zIndex: 9999,
    top: 0,
  },

  image: {
    width: width,
    height: height - 40,
    zIndex: 9999,
  },
  dotActive: {
    backgroundColor: 'rgba(183, 196, 203, 1)',
    width: 10,
    height: 10,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(183, 196, 203, 1)',
  },

  headView: {
    backgroundColor: '#fff',
  },
  head: {
    width: 30,
    alignItems: 'flex-start',
    marginBottom: 0,
    paddingLeft: 16,
    marginLeft: 15,
    marginTop: 0,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    borderColor: Color.headerTintColor,
  },
  headTitle: {
    fontSize: 16,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 0,
    fontWeight: '600',
    color: 'rgba(51, 51, 51, 1)',
    lineHeight: 40,
    fontFamily: Constants.fontHeader,
  },
  iconClose: {
    marginRight: 16,
    marginLeft: 8,
    marginTop: 2,
  },
  iconZoom: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    backgroundColor: 'rgba(0,0,0, .1)',
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 4,
    paddingLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textClose: {
    color: '#666',
    fontWeight: '600',
    fontSize: 11,
    right: 8,
  },
  pageStyle: {
    bottom: 60,
  },
};
