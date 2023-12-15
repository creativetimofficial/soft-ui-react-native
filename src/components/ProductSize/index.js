import React from 'react';
import { StyleSheet, TouchableHighlight, Text } from 'react-native';
import { Constants } from '@common';
import _ from 'lodash';

const ProductSize = (props) => {
  const text = _.isObject(props.text) ? props.text.value : props.text;
  return (
    <TouchableHighlight onPress={() => props.onPress()}
      style={[
        styles.container,
        props.style,
        props.selected && styles.active,
        text.length > 2 && { width: text.length * 14 }
      ]}
      activeOpacity={0.6}
      underlayColor="#C6D8E4">
      <Text style={[styles.text, props.selected && { color: "white", fontSize: 18 }]}>
        {text}
      </Text>
    </TouchableHighlight>
  )
}


const styles = StyleSheet.create({
  active: {
    backgroundColor: "rgba(51, 63, 70, 1)",
    borderWidth: 0
  },
  container: {
    width: 34,
    height: 34,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#C6D8E4",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,1)",
  },
  text: {
    color: "#C6D8E4",
    fontSize: 16,
    fontFamily: Constants.fontHeader,
  },
});

export default ProductSize;
