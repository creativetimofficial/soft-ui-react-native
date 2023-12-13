'use strict'

import base64 from 'base-64'
import {Constants} from "@common";

const PAYPAL_URL = Constants.PayPal.sandBoxMode ? 'https://api.sandbox.paypal.com/v1' : 'https://api.paypal.com/v1'
export const RETURN_URL = Constants.WordPress.url + '/success'
export const CANCEL_URL = Constants.WordPress.url + '/cancel'

export const PAYMENT_CANCELED_CODE = 'PAYMENT_CANCELED_CODE'
export const PAYMENT_APPROVED_CODE = 'PAYMENT_APPROVED_CODE'
export const PAYMENT_ERROR_CODE = 'PAYMENT_ERROR_CODE'

//Default payload value
const PAYMENT_BODY = {
  intent: 'sale', // Payment intent: {'sale'|'authorize'|'order'}
  redirect_urls: {
    return_url: RETURN_URL,
    cancel_url: CANCEL_URL,
  },
  payer: {
    payment_method: 'paypal' // {'paypal'|'credit_card'}
  },
  //note_to_payer: "Contact us for any questions on your order.",
}

const PayPalAPI = {
  startPaymentProcess: (transactions, callback) => {
    const body = Object.assign({}, PAYMENT_BODY, {transactions: transactions})
    PayPalAPI.getAccessToken((access_token) => PayPalAPI.createPayment(access_token, body, callback))
  },
  createPayment: (access_token, body, callback) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      },
      body: JSON.stringify(body)
    }
    fetch(PAYPAL_URL + '/payments/payment', fetchOptions).then((response) => response.json()).then((json) => {
      if (!json.name) { // Check if there is an error
        //console.log('PayPal Payment created with id: :' + json.id)
        callback(json, access_token)
      }
      else {
        // console.log('PayPal createPayment response with error: ' + json.name + ', message: ' + json.message)
        // console.log(JSON.stringify(json))
        alert(json.name + ': ' + json.message)
      }
    }).catch((error) => console.log('Error while trying to get payment request: ' + error))
  },
  executePayment: (executeURL, payer_id, access_token, callback) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
      },
      body: JSON.stringify({
        payer_id: payer_id
      })
    }
    fetch(executeURL, fetchOptions).then((response) => response.json()).then((json) => {
      if (!json.name) { // Check if there is an error
        // console.log('PayPal payment status: ' + json.state)
        callback(json)
      }
      else {
        // console.log('PayPal executePayment response with error: ' + json.name + ', message: ' + json.message)
        alert(json.name + ': ' + json.message)
      }
    }).catch((error) => console.log('Error while trying to execute PayPal payment: ' + error))
  },
  getAccessToken: (callback) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64.encode(Constants.PayPal.clientID + ':' + Constants.PayPal.secretKey),
      },
      body: encodeURIComponent('grant_type') + '=' + encodeURIComponent('client_credentials')
    }
    fetch(PAYPAL_URL + '/oauth2/token', fetchOptions).then((response) => response.json()).then((json) => {
      if (!json.error) {// Check if there is an error
        // console.log('PayPal access_token:' + json.access_token)
        callback(json.access_token)
      }
      else {
        // console.log('PayPal Token response with error: ' + json.error
        //   + ', description: ' + json.error_description
        //   + ': ' + json.details)
        console.log(JSON.stringify(json))
        alert(json.error + ': ' + json.error_description)
      }
    }).catch((error) => console.log('Error while trying to fetch PayPal token: ' + error))
  },
}
export default PayPalAPI
