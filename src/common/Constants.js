/**
 * Created by InspireUI on 20/12/2016.
 */

import {Dimensions} from 'react-native';
// const {height, width} = Dimensions.get('screen');
const {width, height} = Dimensions.get("window");
import Images from './Images'
import Languages from './Languages'

const Constants = {
  RTL: false,
  useReactotron: true,
  fontFamily: 'opensan',
  fontHeader: 'baloo',
  fontHeaderAndroid: 'baloo',
  WordPress: {
    url: 'http://mstore.io',
    defaultDateFormat: 'YYYY-MM-DD HH:mm:ss',
  },
  Shopify: {
    url: 'theminies.myshopify.com',
    storeFrontAPI: 'd6c4d53c6145190ee6aff7adf46c4642',
    ssl: true,
  },

  WooCommerce: {
    consumerKey: 'ck_b7594bc4391db4b56c635fe6da1072a53ca4535a',
    consumerSecret: 'cs_980b9edb120e15bd2a8b668cacc734f7eca0ba40',
    // consumerKey: 'ck_571594a8ece8fa2a5b8eab340aa96831af612c5b',
    // consumerSecret: 'cs_9205c77a6cbad04595dcd9ae1d907e7ca87f1a10'
  },
  SplashScreen: {
    Duration: 2000,
  },
  AsyncCode: {
    Intro: 'async.intro',
  },
  EmitCode: {
    SideMenuOpen: 'emit.side.open',
    SideMenuClose: 'emit.side.close',
    Toast: 'toast',
  },
  Dimension: {
    ScreenWidth(percent = 1) {
      return Dimensions.get('window').width * percent
    },
    ScreenHeight(percent = 1) {
      return Dimensions.get('window').height * percent
    },
  },
  LimitAddToCart: 20,
  TagIdForProductsInMainCategory: 263,
  Window: {
    width: width,
    height: height,
    headerHeight: 35 * height / 100,
    headerBannerAndroid: 55 * height / 100,
    profileHeight: 45 * height / 100
  },

  PostImage: {
    small: 'small',
    medium: 'medium',
    medium_large: 'medium_large',
    large: 'large',
  },
  tagIdBanner: 263, // 273, // cat ID for Sticky Products
  stickyPost: true, // default is true (else false)
  PostList: {  // Custom get All Products in Home Screen
    order: 'desc', // or asc - default is "desc" column
    orderby: 'date', // date, id, title and slug - default is "date" column
  },
  Layout: {
    card: 1,
    twoColumn: 2,
    simple: 3,
    list: 4,
    advance: 5,
    threeColumn: 6,
    horizal: 7,
    oneColumn: 8,
    miniBanner: 9,
    twoColumnHigh: 10
  },
  pagingLimit: 20,
  appFacebookId: '422035778152242',
  fontText: {
    size: 16
  },
  PayPal: {
    clientID: 'ATeT4ckTzYyxo8IQ9n-d4JOmJX9c-gJqqW9CKKKhN45lHow40SdGtKNpQKg2ASnkGsYTxh83GK6wAlBh',
    secretKey: 'EHLLoxewn3KhndDE3SzgdgJ6KGCIcGJzGEWgZJDQ7r8Qt4OmneaT5Dq6lyfPhxGDVRZNCubPsAsdbOml',
    sandBoxMode: true,
  },
  Stripe: {
    publishableKey: 'pk_test_MOl5vYzj1GiFnRsqpAIHxZJl',
    name: "MStore Payment",
    // you need to reply by your server side URL node URL
    serverURL: "http://localhost:8080"
  },
  CustomPages: {
    aboutus_id: 10939,
    contact_id: 11003,
  },
  stickyProduct: {
    collection_id: '439051533',
    sortBy: 'created-descending',
    // "updated_at", "best-selling",
    //"title-ascending", "title-descending",
    //"price-descending", "price-ascending",
    //"created-descending", "created-ascending",
    //or "collection-default".
  },

  Collections: ["Features", "Men", "Bags", "Women", "Clothing", "Shoes"],

  ProductImages: {
    small: "medium",
    medium: "medium",
    large: "large",
    full: "grande"
  },

  Sortings: [
    {filter: 'updated_at', text: Languages.updatedAt},
    {filter: 'best-selling', text: Languages.bestSelling},
    {filter: 'title-ascending', text: Languages.titleAscending},
    {filter: 'created-descending', text: Languages.createdDescending},
    {filter: 'price-ascending', text: Languages.priceAscending},
    {filter: 'price-descending', text: Languages.priceDescending},
  ]
};

export default Constants;
