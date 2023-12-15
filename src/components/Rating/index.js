'use strict';

import React, {PureComponent} from 'react';
// import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
import {Color, Icons, Styles} from '@common';
import {Icon} from '@common/Omni';

class Rating extends PureComponent {
  render() {
    const {rating, size, color, style} = this.props;

    let stars = [];
    for (let i = 1; i < 6; i++) {
      stars[i - 1] = (
        <Icon
          key={i}
          name={Icons.MaterialCommunityIcons.Star}
          size={size}
          color={rating >= i ? color : Color.blackDivide}
        />
      );
    }

    return <View style={[styles.container, style]}>{stars}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

// Rating.propTypes = {
//   size: PropTypes.number,
//   color: PropTypes.string,
//   rating: PropTypes.number.isRequired,
// };

//noinspection JSUnusedGlobalSymbols
Rating.defaultProps = {
  size: Styles.IconSize.Inline,
  color: Color.accent,
  rating: 5,
};

export {Rating};
