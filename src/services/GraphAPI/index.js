// import React from 'react';
import Client from 'graphql-js-client';
// import {gql} from 'babel-plugin-graphql-js-client-transform';
import AsyncStorage from '@react-native-async-storage/async-storage';

import typeBundle from './types';
// import gql from 'graphql-tag';
import {Constants} from '@common';
import LoginAction from '../../redux/User/actions';
// import ClientShopify from 'shopify-buy';
// var Shopify = ClientShopify.buildClient({
//   domain: Constants.Shopify.url,
//   storefrontAccessToken: Constants.Shopify.storeFrontAPI,
// });
const client = new Client(typeBundle, {
  url: 'https://' + Constants.Shopify.url + '/api/2023-10/graphql.json',
  fetcherOptions: {
    headers: {
      'X-Shopify-Storefront-Access-Token': Constants.Shopify.storeFrontAPI,
    },
  },
});

const GraphAPI = {
  // getProduct: () => {
  //   try {
  //     client
  //       .send(
  //         gql(client)`
  //                 query {
  //                   shop {
  //                     name
  //                     description
  //                     products(first:20) {
  //                       pageInfo {
  //                         hasNextPage
  //                         hasPreviousPage
  //                       }
  //                       edges {
  //                         node {
  //                           id
  //                           title
  //                           options {
  //                             name
  //                             values
  //                           }
  //                           variants(first: 250) {
  //                             pageInfo {
  //                               hasNextPage
  //                               hasPreviousPage
  //                             }
  //                             edges {
  //                               node {
  //                                 title
  //                                 selectedOptions {
  //                                   name
  //                                   value
  //                                 }
  //                                 image {
  //                                   src
  //                                 }
  //                                 price
  //                               }
  //                             }
  //                           }
  //                           images(first: 250) {
  //                             pageInfo {
  //                               hasNextPage
  //                               hasPreviousPage
  //                             }
  //                             edges {
  //                               node {
  //                                 src
  //                               }
  //                             }
  //                           }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               `,
  //       )
  //       .then((res) => {
  //         // console.log('res', res);
  //         // this.setState({
  //         //     shop: res.model.shop,
  //         //     products: res.model.shop.products,
  //         // });
  //       });
  //   } catch (err) {
  //     // console.log('err', err);
  //   }
  // },
  getUserByToken: async (token, dispatch) => {
    // const input = client.variable('input', 'customerAccessToken!');
    const customerQuery = client.query('customerQuery', (root) => {
      root.add(
        'customer',
        {args: {customerAccessToken: token}},
        (catCreate) => {
          catCreate.add('id');
          catCreate.add('displayName');
          catCreate.add('email');
          catCreate.add('firstName');
          catCreate.add('lastName');
          catCreate.add('phone');
          catCreate.add('defaultAddress');
          catCreate.addConnection(
            'addresses',
            {args: {first: 10}},
            (address) => {
              address.add('firstName');
            },
          );
          catCreate.addConnection('orders', {args: {first: 10}}, (address) => {
            address.add('id');
          });
        },
      );
    });

    return client.send(customerQuery).then(async (response) => {
      const {data} = response;
      if (data.customer) {
        console.log(data.customer);
        await AsyncStorage.setItem('customerAccesstoken', token);
        LoginAction.login(data.customer, dispatch);
      }
    });
  },
  loginUser: async (data, dispatch) => {
    const _this = this;
    const input = client.variable('input', 'CustomerAccessTokenCreateInput!');
    const mutation = client.mutation('myMutation', [input], (root) => {
      root.add('customerAccessTokenCreate', {args: {input}}, (catCreate) => {
        catCreate.add('customerAccessToken', (cat) => {
          cat.add('accessToken');
          cat.add('expiresAt');
        });
        catCreate.add('userErrors', (cat) => {
          cat.add('message');
          cat.add('field');
        });
      });
    });
    return client
      .send(mutation, {
        input: data,
      })
      .then(async (response) => {
        const {data} = response;
        if (data.customerAccessTokenCreate.customerAccessToken) {
          const {accessToken, expiresAt} =
            data.customerAccessTokenCreate.customerAccessToken;
          console.log('Login successful!');
          console.log('Access Token:', accessToken);
          console.log('Expires At:', expiresAt);
          await GraphAPI.getUserByToken(accessToken, dispatch);
          return {success: 'Login Successful'};
        } else {
          // console.log(
          //   'Login failed: - ',
          //   data.customerAccessTokenCreate.userErrors,
          // );
          return {error: 'Customer Not Found'};
        }
      });
  },
  registerUser: async (data) => {
    console.log(data);
    try {
      const input = client.variable('input', 'CustomerCreateInput!');
      const mutation = client.mutation('signupMutation', [input], (root) => {
        root.add('customerCreate', {args: {input}}, (catCreate) => {
          catCreate.add('customer', (customer) => {
            customer.add('id');
            customer.add('email');
            customer.add('firstName');
            customer.add('lastName');
            customer.add('acceptsMarketing');
          });
          catCreate.add('userErrors', (cat) => {
            cat.add('message');
            cat.add('field');
          });
        });
      });
      return client
        .send(mutation, {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            acceptsMarketing: true,
          },
        })
        .then((response) => {
          const {data} = response;
          console.log(data);
          if (!data.customerCreate) {
            return {error: 'Something went wrong.'};
          } else if (
            data.customerCreate &&
            data.customerCreate.userErrors &&
            data.customerCreate.userErrors.length > 0
          ) {
            return {error: data.customerCreate.userErrors[0].message};
          } else {
            return {success: true};
          }
        });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  },
};

export default GraphAPI;
