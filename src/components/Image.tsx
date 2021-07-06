import React from 'react';
import {
  StyleSheet,
  Image as RNImage,
  ImageStyle,
  ImageBackground,
  Platform,
} from 'react-native';
import {IImageProps} from '../constants/types';

import useTheme from '../hooks/useTheme';

const Image = ({
  id = 'Image',
  style,
  children,
  avatar,
  shadow,
  rounded,
  background,
  radius,
  color,
  height,
  width,
  transform,
  padding,
  paddingVertical,
  paddingHorizontal,
  paddingRight,
  paddingLeft,
  paddingTop,
  paddingBottom,
  margin,
  marginVertical,
  marginHorizontal,
  marginRight,
  marginLeft,
  marginTop,
  marginBottom,
  ...props
}: IImageProps) => {
  const {colors, sizes} = useTheme();

  const imageStyles = StyleSheet.flatten([
    style,
    {
      borderRadius: sizes.imageRadius,
      ...(height && {height}),
      ...(width && {width}),
      ...(margin && {margin}),
      ...(marginBottom && {marginBottom}),
      ...(marginTop && {marginTop}),
      ...(marginHorizontal && {marginHorizontal}),
      ...(marginVertical && {marginVertical}),
      ...(marginRight && {marginRight}),
      ...(marginLeft && {marginLeft}),
      ...(padding && {padding}),
      ...(paddingBottom && {paddingBottom}),
      ...(paddingTop && {paddingTop}),
      ...(paddingHorizontal && {paddingHorizontal}),
      ...(paddingVertical && {paddingVertical}),
      ...(paddingRight && {paddingRight}),
      ...(paddingLeft && {paddingLeft}),
      ...(rounded && {borderRadius: sizes.radius, overflow: 'hidden'}),
      ...(radius !== undefined && {borderRadius: radius, overflow: 'hidden'}),
      ...(color && {tintColor: color}),
      ...(transform && {transform}),
      ...(shadow && {
        shadowColor: colors.shadow,
        shadowOffset: {
          width: sizes.shadowOffsetWidth,
          height: sizes.shadowOffsetHeight,
        },
        shadowOpacity: sizes.shadowOpacity,
        shadowRadius: sizes.shadowRadius,
      }),
      ...(avatar && {
        height: sizes.avatarSize,
        width: sizes.avatarSize,
        borderRadius: sizes.avatarRadius,
        overflow: 'hidden',
      }),
    },
  ]) as ImageStyle;

  // generate component testID or accessibilityLabel based on Platform.OS
  const imageID =
    Platform.OS === 'android' ? {accessibilityLabel: id} : {testID: id};

  if (background) {
    return (
      <ImageBackground {...imageID} style={imageStyles} {...props}>
        {children}
      </ImageBackground>
    );
  }

  return <RNImage {...imageID} style={imageStyles} {...props} />;
};

export default Image;
