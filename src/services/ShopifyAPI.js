// import {error} from '@app/Omni';
import {Constants} from '@common';
import Client from 'shopify-buy';
import {Category, Product, ProductSearch} from '@data';
export const error = (values) => console.log('error -->> ', values);
/**
 * https://shopify.github.io/js-buy-sdk
 */
var Shopify = Client.buildClient({
  domain: Constants.Shopify.url,
  storefrontAccessToken: Constants.Shopify.storeFrontAPI,
});

global.Buffer = global.Buffer || require('buffer').Buffer;

if (typeof btoa === 'undefined') {
  global.btoa = function (str) {
    return new Buffer(str).toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded) {
    return new Buffer(b64Encoded, 'base64').toString();
  };
}

const ShopifyAPI = {
  /** getCategories(arg)
   * @first: Int
   * @sortKey: String (ID, RELEVANCE TITLE, UPDATED_AT)
   * @query: String (title, collection_type, updated_at)
   * @reverse: Boolean
   */
  getCategories: async () => {
    try {
      const responses = await Shopify.collection.fetchQuery({
        first: 20,
      });

      return responses.map((item) => new Category(item));
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** productsByCategoryId(id)
   * id: String
   */
  productsByCategoryId: async (categoryId) => {
    try {
      const responses = await Shopify.collection.fetchWithProducts(categoryId);

      return responses.products.map((item) => new Product(item));
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** getAllProducts(arg)
   * @first: Int
   * @sortKey: String (ID, RELEVANCE TITLE, UPDATED_AT)
   * @query: String (title, collection_type, updated_at)
   * @reverse: Boolean
   */
  getAllProducts: async (filter, limit = 20) => {
    try {
      const responses = await Shopify.product.fetchQuery({
        first: limit,
        sortKey: filter && filter.toUpperCase(),
      });

      return responses.map((item) => new Product(item));
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** productSticky(id)
   * id: String
   */
  productSticky: async (
    collection_id = Constants.stickyProduct.collection_id,
    limit,
    page,
  ) => {
    try {
      const responses = await Shopify.collection.fetchWithProducts(
        collection_id,
      );

      return responses.products.map((item) => new Product(item));
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** fetchProduct(id)
   * id: String
   */
  fetchProduct: async (productId) => {
    try {
      const response = await Shopify.product.fetch(productId);

      return new Product(response);
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  searchByName: async (handle) => {
    try {
      let url = Constants.Shopify.ssl
        ? 'https://' + Constants.Shopify.url
        : Constants.Shopify.url;
      const responses = await fetch(
        url + '/search?view=json&type=product&q=' + handle,
      );
      let responsesJson = await responses.json();

      return responsesJson.map((item) => new ProductSearch(item));
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** fetchProductRelated(arg)
   * @first: Int
   * @sortKey: String (ID, RELEVANCE TITLE, UPDATED_AT)
   * @query: String (title, collection_type, updated_at)
   * @reverse: Boolean
   */
  fetchProductRelated: async (tags, excludeId = null) => {
    try {
      const responses = await Shopify.product.fetchQuery({
        query: tags[0].value,
      });

      return responses.map((item) => new Product(item));
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** initCart(input)
   * https://shopify.github.io/js-buy-sdk/checkout-resource.js.html#line64
   * @email: String
   * @lineItems: Array<Object> [{variantId, customAttributes, quantity}]
   * @shippingAddress: Object
   * @note: String
   * @customAttributes: Array<Object>
   */
  initCart: async (lineItems) => {
    try {
      const response = await Shopify.checkout.create({
        lineItems,
      });

      console.log('initCart', response);
      return response;
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** addLineItem(checkoutId, lineItems)
   * https://shopify.github.io/js-buy-sdk/checkout-resource.js.html#line85
   * checkoutId: String
   * lineItems: Array<Object>
   */
  addLineItem: async (checkoutId, lineItems) => {
    try {
      const response = await Shopify.checkout.addLineItems(
        checkoutId,
        lineItems,
      );

      console.log('addLineItem', response);
      return response;
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** fetchNextPage
   * @list: Array<GraphModel>
   */
  fetchNextPage: async (list) => {
    try {
      const responses = await Shopify.fetchNextPage(list);

      return responses.model.map((item) => new Product(item));
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
  /** fetchNextPage
   * @list: Array<GraphModel>
   */
  loginUser: async (data) => {
    try {
      // console.log(Shopify);
      const productsQuery = Shopify.graphQLClient.query((root) => {
        console.log(root);
        root.addConnection('products', {args: {first: 10}}, (product) => {
          product.add('title');
        });
      });
      // console.log(productsQuery);
      // const responses = await Shopify.customer.createCustomerAccessToken(data);
      // console.log('login responses >> ', responses);
      return null;
    } catch (err) {
      error(err);
      console.log(err);
    }
  },
};
export default ShopifyAPI;
