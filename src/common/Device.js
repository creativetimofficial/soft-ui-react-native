import { Dimensions } from 'react-native';

const { width, height, scale } = Dimensions.get("window");
const isIphoneX = (height * scale) > 2000;

export default {
  isIphoneX,
  ToolbarHeight: isIphoneX ? 35 : 0
}