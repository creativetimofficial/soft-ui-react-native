import React from 'react';
import {StyleSheet, TouchableOpacity, View, Image, TouchableWithoutFeedback, Text} from 'react-native';

const hitSlop = {top: 5, right: 20, bottom: 5, left: 20};

const ProductColor = (props) => (
    <TouchableOpacity activeOpacity={0.9}
                      hitSlop={hitSlop}
                      onPress={() => props.onPress()}>
        <View style={[styles.productColor,
            {backgroundColor: props.color},
            props.selected && [
                styles.productColorSelected,
                {borderColor: props.color}],
            props.style]}></View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    productColor: {
        width: 14,
        height: 14,
        borderRadius: 10,
    },
    productColorSelected: {
        backgroundColor: "white",
        width: 24,
        height: 24,
        borderRadius: 30,
        borderWidth: 8
    }
});

export default ProductColor;
