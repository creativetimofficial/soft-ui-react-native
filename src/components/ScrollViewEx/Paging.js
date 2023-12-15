import React, {PureComponent} from 'react';
import {View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import Dot from './dot';
import styles from './styles';

export default class Paging extends PureComponent {
  static propTypes = {
    dotsLength: PropTypes.number.isRequired,
    activeDotIndex: PropTypes.number.isRequired,
    containerStyle: ViewPropTypes.style,
    dotStyle: ViewPropTypes.style,
    inactiveDotOpacity: PropTypes.number,
    inactiveDotScale: PropTypes.number,
  };

  get dots() {
    const {
      dotsLength,
      activeDotIndex,
      dotStyle,
      inactiveDotOpacity,
      inactiveDotScale,
    } = this.props;

    let dots = [];

    for (var i = 0; i < dotsLength; i++) {
      dots.push(
        <Dot
          key={`pagination-dot-${i}`}
          active={i === activeDotIndex}
          style={dotStyle}
          inactiveOpacity={inactiveDotOpacity}
          inactiveScale={inactiveDotScale}
        />,
      );
    }

    return dots;
  }

  render() {
    const {dotsLength, containerStyle} = this.props;

    if (!dotsLength || dotsLength < 2) {
      return false;
    }

    return (
      <View
        pointerEvents={'none'}
        style={[styles.sliderPagination, containerStyle || {}]}>
        {this.dots}
      </View>
    );
  }
}
