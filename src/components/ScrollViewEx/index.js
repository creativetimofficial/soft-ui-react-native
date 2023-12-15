import React, {Component} from 'react';
import {ScrollView, Dimensions, Animated, View} from 'react-native';
import Paging from './Paging';
import styles from './styles';
const {width} = Dimensions.get('window');

export default class ScrollViewEx extends Component {
  state = {pageIndex: 0};

  render() {
    const {children, height, pageStyle} = this.props;
    const {pageIndex} = this.state;

    return (
      <View style={{height: height, width: width, flex: 1}}>
        <ScrollView
          pagingEnabled
          bouncesZoom
          horizontal
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          onScroll={({nativeEvent}) => {
            const page = Math.round(nativeEvent.contentOffset.x / width);
            if (page !== pageIndex) {
              this.setState({pageIndex: page});
            }
          }}
          style={[styles.scrollView, {height: height}]}>
          {children}
        </ScrollView>

        <Paging
          dotsLength={children.length}
          activeDotIndex={pageIndex}
          containerStyle={[styles.paging, this.props.pageStyle]}
          dotStyle={styles.dot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    );
  }
}
