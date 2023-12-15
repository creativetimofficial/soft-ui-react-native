/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  Animated,
  Share,
} from 'react-native';
import styles from './ProductDetail_Style';
import {connect} from 'react-redux';
import {useTheme} from '../../hooks';
import {
  Button,
  ProductColor,
  ProductSize,
  ScrollViewEx,
  //   ProductSize,
  //   ScrollViewEx,
  //   ProductColor,
  //   ProductRelated,
  //   Spinkit,
} from '../../components';
// import HTMLView from './../../components/HTMLView';
import AttributesView from './AttributesView';
import {Styles, Languages, Color, Images, Constants} from '../../common';
import Modal from 'react-native-modalbox';
import {Ionicons} from '@expo/vector-icons';
import {getProductImage, currencyFormatter, Timer} from '../../common/Omni';
import HTMLView from '../../components/HTMLView';

const PRODUCT_IMAGE_HEIGHT = (55 * Constants.Window.height) / 100;
const NAVI_HEIGHT = 64;

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      tabIndex: 0,
      selectedSize: 0,
      selectedColor: 0,
    };

    this.productInfoHeight = PRODUCT_IMAGE_HEIGHT;
    this.inCartTotal = 0;
    this.isInWishList = false;

    this.fetchAttribute();
  }

  fetchAttribute = () => {
    const {product, isSearch} = this.props;

    if (!isSearch) {
      this.productSize = this.getProductAttribute(product, 'size');
      this.productColor = this.getProductAttribute(product, 'color');
    } else {
      // use for search case
      this.props.fetchProduct(product.id);
      const {productDetail} = this.props.products;

      if (productDetail != null && isSearch) {
        this.productSize = this.getProductAttribute(productDetail, 'size');
        this.productColor = this.getProductAttribute(productDetail, 'color');
      }
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.getCartTotal(nextProps, true);
    this.getWishList(nextProps, true);
    this.fetchAttribute();
  }

  componentDidMount() {
    this.getCartTotal(this.props);
    this.getWishList(this.props);
  }

  closePhoto = () => this.refs.modalPhoto.close();

  openPhoto = () => this.refs.modalPhoto.open();

  getColor(value) {
    const color = value.toLowerCase();
    if (typeof Color.attributes[color] !== 'undefined') {
      return Color.attributes[color];
    }
    return '#333';
  }

  handleClickTab(tabIndex) {
    this.setState({tabIndex});
    Timer.setTimeout(() => this.state.scrollY.setValue(0), 50);
  }

  getProductAttribute(product, name) {
    var attribute = null;

    if (typeof product.attributes !== 'undefined') {
      for (var i = 0; i < product.attributes.length; i++) {
        const productName = product.attributes[i].name;
        if (
          typeof productName !== 'undefined' &&
          productName.toLowerCase() == name
        ) {
          attribute = product.attributes[i];
          break;
        }
      }
    }
    return attribute;
  }

  share() {
    Share.share({
      message: this.props.product.description.replace(/(<([^>]+)>)/gi, ''),
      url: this.props.product.permalink,
      title: this.props.product.name,
    });
  }

  addToCart = (go = false) => {
    if (this.inCartTotal < Constants.LimitAddToCart) {
      var _variation = {};
      if (this.productSize) {
        _variation.size = this.productSize.options[this.state.selectedSize];
        _variation.selectedSize = this.state.selectedSize;
      }
      if (this.productColor) {
        _variation.color = this.productColor.options[this.state.selectedColor];
        _variation.selectedColor = this.state.selectedColor;
      }

      this.props.addCartItem(this.props.product, _variation);
    } else {
      alert(Languages.ProductLimitWaring);
    }

    if (go) {
    //   this.props.onViewCart();
    }
  };

  addToWishList() {
    var _variation = {};
    if (this.productSize) {
      _variation.size = this.productSize.options[this.state.selectedSize];
    }
    if (this.productColor) {
      _variation.color = this.productColor.options[this.state.selectedColor];
    }
    if (this.isInWishList) {
      this.props.removeWishListItem(this.props.product, _variation);
    } else {
      this.props.addWishListItem(this.props.product, _variation);
    }
  }

  getCartTotal(props, check = false) {
    const {cartItems} = props;

    if (cartItems != null) {
      if (check == true && props.cartItems == this.props.cartItems) {
        return;
      }

      this.inCartTotal = cartItems.reduce((accumulator, currentValue) => {
        if (currentValue.product.id == this.props.product.id) {
          return accumulator + currentValue.quantity;
        } else {
          return 0;
        }
      }, 0);

      let sum = cartItems.reduce(
        (accumulator, currentValue) => accumulator + currentValue.quantity,
        0,
      );
      //   var params = this.props.navigation.route.params;
      //   params.cartTotal = sum;
      //   this.props.navigation.setParams(params);
    }
  }

  getWishList(props, check = false) {
    if (props.hasOwnProperty('wishListItems')) {
      if (check == true && props.wishListItems == this.props.wishListItems) {
        return;
      }
      this.isInWishList =
        props.wishListItems.find(
          (item) => item.product.id == this.props.product.id,
        ) != undefined;

      let sum = props.wishListItems.length;
      //   var params = this.props.navigation.state.params;
      //   params.wistListTotal = sum;
      //   this.props.navigation.setParams(params);
    }
  }

  render() {
    let product = this.props.product;

    const {productDetail} = this.props.products;
    if (this.props.isSearch && productDetail != null) {
      product = productDetail;
    }

    if (typeof product.attributes === 'undefined') {
      return <View style={{marginTop: 20}}>{/* <Spinkit /> */}</View>;
    }

    const price = product.variants[this.state.selectedSize].price;
    const regularPrice =
      product.variants[this.state.selectedSize].regular_price;
    const cartItems = this.props.cartItems;
    const isAddToCart =
      cartItems &&
      cartItems.filter((item) => item.product.id === product.id).length > 0
        ? true
        : false;

    const wishListItems = this.props.wishListItems;
    const isAddWishList =
      wishListItems.filter((item) => item.product.id === product.id).length > 0
        ? true
        : false;
    const imageScale = this.state.scrollY.interpolate({
      inputRange: [-300, 0, NAVI_HEIGHT, this.productInfoHeight / 2],
      outputRange: [2, 1, 1, 0.7],
      extrapolate: 'clamp',
    });

    const renderTabView = () => {
      return (
        product != null && (
          <View style={styles.headView}>
            <Text style={styles.headTitle}>
              {Languages.AdditionalInformation}
            </Text>
            <View style={styles.head} />
            <View style={styles.description}>
              <HTMLView
                stylesheet={{
                  lineHeight: 24,
                  padding: 0,
                  margin: 0,
                  color: '#666',
                  textAlign: 'left',
                }}
                value={product.description}
              />
            </View>

            <Text style={styles.headTitle}>{Languages.ProductFeatures}</Text>
            <View style={styles.head} />

            <AttributesView attributes={product.attributes} />
          </View>
        )
      );
    };

    const renderButtons = () => {
      //   const {assets, colors, gradients, sizes} = useTheme();
      return (
        <View
          style={[
            styles.bottomView,
            Constants.RTL && {flexDirection: 'row-reverse'},
          ]}>
          <View style={styles.buttonContainer}>
            <Button
              outlined
              source={Images.IconShare}
              imageStyle={styles.imageButton}
              buttonStyle={styles.buttonStyle}
              onPress={this.share.bind(this)}>
              <Text>Share</Text>
            </Button>
            <Button
              isAddWishList={isAddWishList}
              imageStyle={styles.imageButton}
              buttonStyle={styles.buttonStyle}
              onPress={this.addToWishList.bind(this)}>
              <Text>Wishlist</Text>
            </Button>
            <Button
              isAddToCart={isAddToCart}
              imageStyle={styles.imageButton}
              buttonStyle={styles.buttonStyle}
              onPress={this.addToCart}>
              <Text>Add To Cart</Text>
            </Button>
          </View>

          <Button
            primary
            style={styles.btnBuy}
            textStyle={styles.btnBuyText}
            onPress={() => this.addToCart(true)}>
            <Text>BUY NOW</Text>
          </Button>
        </View>
      );
    };

    const renderImages = () => (
      <ScrollViewEx height={PRODUCT_IMAGE_HEIGHT}>
        {product !== null &&
          typeof product.images !== 'undefined' &&
          product.images.map((image, index) => (
            <TouchableOpacity
              activeOpacity={0.9}
              key={index}
              style={styles.imageProduct}
              onPress={this.openPhoto.bind(this)}>
              <Animated.Image
                source={{
                  uri: getProductImage(image, Constants.ProductImages.large),
                }}
                style={[
                  styles.imageProduct,
                  {transform: [{scale: imageScale}]},
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
      </ScrollViewEx>
    );

    const renderTitle = () =>
      product != null && (
        <View
          style={{
            minHeight: 64,
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 15,
          }}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.productPrice}>{currencyFormatter(price)}</Text>
            {product.on_sale && (
              <Text style={styles.sale_price}>
                {currencyFormatter(regularPrice)}
              </Text>
            )}
          </View>
        </View>
      );

    const renderProductSize = () => {
      var attribute = this.productSize;
      if (attribute) {
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            style={styles.productSizeStyle}
            contentContainerStyle={[
              styles.productSizeContainer,
              Constants.RTL && {flexDirection: 'row-reverse'},
            ]}>
            {this.productSize.options.map((option, index) => (
              <ProductSize
                key={index}
                text={option}
                style={styles.productSize}
                onPress={() => this.setState({selectedSize: index})}
                selected={this.state.selectedSize == index}
              />
            ))}
          </ScrollView>
        );
      }
    };

    const renderProductColor = () => {
      if (this.productColor) {
        const translateY = this.state.scrollY.interpolate({
          inputRange: [0, PRODUCT_IMAGE_HEIGHT / 2, PRODUCT_IMAGE_HEIGHT],
          outputRange: [0, -PRODUCT_IMAGE_HEIGHT / 3, -PRODUCT_IMAGE_HEIGHT],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              styles.productColorContainer,
              {transform: [{translateY: translateY}]},
            ]}>
            {this.productColor.options.length > 2 &&
              this.productColor.options.map((option, index) => (
                <ProductColor
                  key={index}
                  color={this.getColor(option)}
                  style={styles.productColor}
                  onPress={() => this.setState({selectedColor: index})}
                  selected={this.state.selectedColor == index}
                />
              ))}
          </Animated.View>
        );
      }
    };

    const renderProductRelated = () => (
      <View>
        {/* <ProductRelated
                    tags={product.tags}
                    onViewProductScreen={this.props.onViewProductScreen}
                    currentId={product.id}
                /> */}
      </View>
    );

    return (
      <View style={styles.container}>
        <Animated.ScrollView
          style={styles.listContainer}
          scrollEventThrottle={1}
          onScroll={(event) => {
            this.state.scrollY.setValue(event.nativeEvent.contentOffset.y);
          }}>
          <View
            style={[styles.productInfo]}
            onLayout={(event) =>
              (this.productInfoHeight = event.nativeEvent.layout.height)
            }>
            {renderImages()}
            {renderProductSize()}
            {renderTitle()}
          </View>
          {renderTabView()}
          {/* {renderProductRelated()} */}
        </Animated.ScrollView>
        {renderProductColor()}
        {renderButtons()}

        {/* <Modal
          ref="modalPhoto"
          swipeToClose={false}
          animationDuration={200}
          style={styles.modalBoxWrap}>
          <ScrollViewEx
            height={Constants.Window.height - 40}
            pageStyle={styles.pageStyle}>
            {product !== null &&
              typeof product.images !== 'undefined' &&
              product.images.map((image, index) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={index}
                  style={styles.imageProduct}
                  onPress={this.openPhoto.bind(this)}>
                  <Animated.Image
                    source={{
                      uri: getProductImage(image, Constants.ProductImages.full),
                    }}
                    style={styles.imageProductFull}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
          </ScrollViewEx>

          <TouchableOpacity
            style={styles.iconZoom}
            onPress={this.closePhoto.bind(this)}>
            <Ionicons
              name="ios-close"
              size={20}
              style={styles.iconClose}
              color="#666"
            />
            <Text style={styles.textClose}>CLOSE</Text>
          </TouchableOpacity>
        </Modal> */}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state.carts);
  console.log('<<<<ownProps>>>>');
  return {
    cartItems: state.carts.cartItems,
    wishListItems: state.wishList.wishListItems,
    products: state.products,
    product: ownProps.route.params.product,
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const {dispatch} = dispatchProps;
  const {actions: CartActions} = require('@redux/Carts');
  const {actions: WishListActions} = require('@redux/WishList');
  const {actions: ProductActions} = require('@redux/Products');

  return {
    ...ownProps,
    ...stateProps,
    addCartItem: (product, variation) => {
      CartActions.addCartItem(dispatch, product, variation);
    },
    addWishListItem: (product, variation) => {
      WishListActions.addWishListItem(dispatch, product, variation);
    },
    removeWishListItem: (product, variation) => {
      WishListActions.removeWishListItem(dispatch, product, variation);
    },
    fetchProduct: (productId) => {
      ProductActions.fetchProduct(dispatch, productId);
    },
  };
}

export default connect(mapStateToProps, undefined, mergeProps)(Detail);
