import React from 'react';
import Client from 'graphql-js-client';
// import {gql} from 'babel-plugin-graphql-js-client-transform';
import typeBundle from './types';
// import gql from 'graphql-tag';
import {Constants} from '@common';
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
  getUser: async (token) => {
    const query = client.query((root) => {
      root.addConnection(
        'customer',
        {args: {customerAccessToken: token}},
        (product) => {
          product.add('id');
        },
      );
    });
    return client.send(query).then((response) => {
      const {data} = response;
      console.log(data);
    });
  },
  loginUser: async (data) => {
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
      .then((response) => {
        const {data} = response;
        if (data.customerAccessTokenCreate.customerAccessToken) {
          const {accessToken, expiresAt} =
            data.customerAccessTokenCreate.customerAccessToken;
          console.log('Login successful!');
          console.log('Access Token:', accessToken);
          console.log('Expires At:', expiresAt);
          // You can store accessToken in session/local storage for future authenticated requests
        } else {
          // console.error(
          //   'Login failed:',
          //   data.customerAccessTokenCreate.userErrors,
          // );
          return {error: 'Customer Not Found'};
        }
      });
  },
  registerUser: async (data) => {
    try {
      const shopifyStore = Constants.Shopify.url;
      const accessToken = Constants.Shopify.storeFrontAPI;
      const createCustomerMutation = `
        mutation {
          customerCreate(input: {
            email: "${data.email}",
            password: "${data.password}",
            firstName: "${data.name}",
            lastName: "${data.name}",
          }) {
            customer {
              id
              email
              displayName
            }
            userErrors {
              field              
            }
          }
        }
      `;

      const response = await fetch(
        `https://${shopifyStore}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': accessToken,
          },
          body: JSON.stringify({query: createCustomerMutation}),
        },
      );

      const responseData = await response.json();
      console.log('Created customer data:', responseData.data.customerCreate);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  },
};

export default GraphAPI;
