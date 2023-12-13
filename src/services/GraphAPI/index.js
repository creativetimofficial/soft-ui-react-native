import React from 'react';
import Client from 'graphql-js-client';
import {gql} from 'babel-plugin-graphql-js-client-transform';
import typeBundle from './types';

import {Constants} from "@common";

const client = new Client(typeBundle, {
    url: 'https://' + Constants.Shopify.url + '/api/graphql',
    fetcherOptions: {headers: {'X-Shopify-Storefront-Access-Token': Constants.Shopify.storeFrontAPI}}
});

const GraphAPI = {
    getProduct: () => {
        try {
            client.send(gql(client)`
                  query {
                    shop {
                      name
                      description
                      products(first:20) {
                        pageInfo {
                          hasNextPage
                          hasPreviousPage
                        }
                        edges {
                          node {
                            id
                            title
                            options {
                              name
                              values
                            }
                            variants(first: 250) {
                              pageInfo {
                                hasNextPage
                                hasPreviousPage
                              }
                              edges {
                                node {
                                  title
                                  selectedOptions {
                                    name
                                    value
                                  }
                                  image {
                                    src
                                  }
                                  price
                                }
                              }
                            }
                            images(first: 250) {
                              pageInfo {
                                hasNextPage
                                hasPreviousPage
                              }
                              edges {
                                node {
                                  src
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                `).then((res) => {
                // console.log('res', res);
                // this.setState({
                //     shop: res.model.shop,
                //     products: res.model.shop.products,
                // });
            });
        }
        catch (err) {
            // console.log('err', err);
        }
    }
}

export default GraphAPI;