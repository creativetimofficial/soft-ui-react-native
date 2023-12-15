import {StyleSheet, Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');

const DEFAULT_DOT_SIZE = 6;
const DEFAULT_DOT_COLOR = 'rgba(0, 0, 0, 0.75)';

export default StyleSheet.create({
  sliderPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  sliderPaginationDot: {
    width: DEFAULT_DOT_SIZE,
    height: DEFAULT_DOT_SIZE,
    borderRadius: DEFAULT_DOT_SIZE / 2,
    marginHorizontal: 4,
    backgroundColor: DEFAULT_DOT_COLOR
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  scrollView: {
    width: width
  },
  paging: {
    backgroundColor: 'transparent',  // 'transparent',
    width: width,
    alignItems: 'center',
    bottom: 10
  }
});