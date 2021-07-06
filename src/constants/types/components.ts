import * as React from 'react';
import {
  Animated,
  ColorValue,
  ImageProps,
  ImageStyle,
  KeyboardAvoidingViewProps,
  ModalProps,
  ScrollViewProps,
  StyleProp,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {BlurProps} from 'expo-blur';
import {LinearGradientPoint} from 'expo-linear-gradient';
import {ISpacing, ITheme} from './theme';

/**
 * ## Block
 * Default usage:
 * ```
 * <Block>...</Block>
 * ```
 *
 */
export interface IBlockProps
  extends ISpacing,
    ViewProps,
    ScrollViewProps,
    KeyboardAvoidingViewProps {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Renders a View flex style
   * @see https://reactnative.dev/docs/flexbox#proptypes
   * @see https://reactnative.dev/docs/layout-props
   */
  flex?: ViewStyle['flex'];
  /**
   * Renders a View flexDirection: row style
   * @see https://reactnative.dev/docs/flexbox#flex-direction
   */
  row?: boolean;
  /**
   * Renders a View flexWrap style
   * @see https://reactnative.dev/docs/flexbox#flex-wrap
   */
  wrap?: ViewStyle['flexWrap'];
  /**
   * Renders a SafeAreaView component
   * @see https://reactnative.dev/docs/safeareaview
   */
  safe?: boolean;
  /**
   * Renders a KeyboardAwareScrollView component
   * @see https://github.com/APSL/react-native-keyboard-aware-scroll-view#usage
   */
  keyboard?: boolean;
  /**
   * Renders a ScrollView component
   * @see https://reactnative.dev/docs/scrollview
   */
  scroll?: boolean;
  /**
   * Generates a shadow style
   * @see https://reactnative.dev/docs/shadow-props
   */
  shadow?: boolean;
  /**
   * Renders a View with predefined backgroundColor, borderRadius, padding, shadow / elevation
   * @see https://reactnative.dev/docs/shadow-props
   */
  card?: boolean;
  /**
   * Renders a View with predefined justifyContent: center
   * @see https://reactnative.dev/docs/flexbox#justify-content
   */
  center?: boolean;
  /**
   * Renders a View with predefined borderWidth: 1, backgroundColor: 'transparent' & borderColor inherited
   */
  outlined?: boolean;
  /**
   * Renders the View/Block component with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/view#style
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Renders a View style overflow
   * @see https://reactnative.dev/docs/layout-props#overflow
   */
  overflow?: ViewStyle['overflow'];
  /**
   * Renders a custom backgroundColor
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  color?: ViewStyle['backgroundColor'];
  /**
   * Renders LinearGradient component, colors
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  gradient?: string[];
  /**
   * Renders a backgroundColor directly from the colors.primary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  primary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.secondary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  secondary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.tertiary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  tertiary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.black value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  black?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.white value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  white?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.gray value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  gray?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.danger value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  danger?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.warning value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  warning?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.success value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  success?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.info value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  info?: boolean;
  /**
   * Renders a custom borderRadius value
   * @see https://reactnative.dev/docs/view-style-props#borderradius
   */
  radius?: ViewStyle['borderRadius'];
  /**
   * Renders a custom height value
   * @see https://reactnative.dev/docs/layout-props#height
   */
  height?: ViewStyle['height'];
  /**
   * Renders a custom width value
   * @see https://reactnative.dev/docs/layout-props#width
   */
  width?: ViewStyle['width'];
  /**
   * Renders a flex justifyContent
   * Available values: 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
   * @see https://reactnative.dev/docs/layout-props#justifycontent
   */
  justify?: ViewStyle['justifyContent'];
  /**
   * Renders a flex alignItems
   * Available values: 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
   * @see https://reactnative.dev/docs/layout-props#alignitems
   */
  align?: ViewStyle['alignItems'];
  /**
   * Renders the View content
   */
  children?: React.ReactNode;
  /**
   * Renders a BlueView component
   * @see https://docs.expo.io/versions/latest/sdk/blur-view/
   */
  blur?: boolean;
  /**
   * BlueView intensity, default: 50, values accepted: 1 to 100
   * @see https://docs.expo.io/versions/latest/sdk/blur-view/#intensity
   */
  intensity?: BlurProps['intensity'];
  /**
   * BlueView tint color, default: 'default', values accepted: 'light', 'dark', 'default'
   * @see https://docs.expo.io/versions/latest/sdk/blur-view/#blurtint
   */
  tint?: BlurProps['tint'];
  /**
   * Renders the View position
   * @see https://reactnative.dev/docs/layout-props#position
   */
  position?: ViewStyle['position'];
  /**
   * Renders the View right offset
   * @see https://reactnative.dev/docs/layout-props#right
   */
  right?: ViewStyle['right'];
  /**
   * Renders the View left offset
   * @see https://reactnative.dev/docs/layout-props#left
   */
  left?: ViewStyle['left'];
  /**
   * Renders the View top offset
   * @see https://reactnative.dev/docs/layout-props#top
   */
  top?: ViewStyle['top'];
  /**
   * Renders the View bottom offset
   * @see https://reactnative.dev/docs/layout-props#bottom
   */
  bottom?: ViewStyle['bottom'];
  /**
   * Renders LinearGradient start points
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  start?: LinearGradientPoint;
  /**
   * Renders LinearGradient end points
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  end?: LinearGradientPoint;
}

/**
 * ## Button
 * Default usage:
 * ```
 * <Button>...</Button>
 * ```
 *
 */
export interface IButtonProps extends TouchableOpacityProps, ISpacing {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Renders borderRadius value to maxSize / 2 using
   * maxSize value is calculated from the maximum value from width, minWidth, maxWidth, height, minHeight, maxHeight
   * @see https://reactnative.dev/docs/view-style-props#borderradius
   */
  round?: boolean;
  /**
   * Renders borderRadius value using theme sizes.s; default sizes.buttonRadius
   * @see https://reactnative.dev/docs/view-style-props#borderradius
   */
  rounded?: boolean;
  /**
   * Renders a View flex style
   * @see https://reactnative.dev/docs/flexbox#proptypes
   * @see https://reactnative.dev/docs/layout-props
   */
  flex?: ViewStyle['flex'];
  /**
   * Renders a custom borderRadius value
   * @see https://reactnative.dev/docs/view-style-props#borderradius
   */
  radius?: ViewStyle['borderRadius'];
  /**
   * Renders a custom backgroundColor value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  color?: ViewStyle['backgroundColor'];
  /**
   * Renders LinearGradient component, colors
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  gradient?: string[];
  /**
   * Renders a backgroundColor directly from the colors.primary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  primary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.secondary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  secondary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.tertiary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  tertiary?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.gray value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  gray?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.black value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  black?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.white value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  white?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.light value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  light?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.dark value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  dark?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.danger value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  danger?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.warning value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  warning?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.success value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  success?: boolean;
  /**
   * Renders a backgroundColor directly from the colors.info value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  info?: boolean;
  /**
   * Renders a View flexDirection: row style
   * @see https://reactnative.dev/docs/flexbox#flex-direction
   */
  row?: boolean;
  /**
   * Renders a flex alignItems
   * Available values: 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
   * @see https://reactnative.dev/docs/layout-props#alignitems
   */
  align?: ViewStyle['alignItems'];
  /**
   * Renders a flex justifyContent
   * Available values: 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
   * @see https://reactnative.dev/docs/layout-props#justifycontent
   */
  justify?: ViewStyle['justifyContent'];
  /**
   * Renders a custom height value
   * @see https://reactnative.dev/docs/layout-props#height
   */
  height?: ViewStyle['height'];
  /**
   * Renders a custom width value
   * @see https://reactnative.dev/docs/layout-props#width
   */
  width?: ViewStyle['width'];
  /**
   * Renders the container style with predefined borderWidth: 1, backgroundColor: 'transparent' & borderColor inherited
   */
  outlined?: boolean | string;
  /**
   * Generates a shadow style
   * @see https://reactnative.dev/docs/shadow-props
   */
  shadow?: boolean;
  /**
   * Renders social icons ('logo-facebook', 'logo-twitter', 'logo-dribbble') from Ionicons
   * @see https://docs.expo.io/guides/icons/
   * @see https://icons.expo.fyi
   */
  social?: 'facebook' | 'twitter' | 'dribbble';
  /**
   * Renders the View position
   * @see https://reactnative.dev/docs/layout-props#position
   */
  position?: ViewStyle['position'];
  /**
   * Renders the View right offset
   * @see https://reactnative.dev/docs/layout-props#right
   */
  right?: ViewStyle['right'];
  /**
   * Renders the View left offset
   * @see https://reactnative.dev/docs/layout-props#left
   */
  left?: ViewStyle['left'];
  /**
   * Renders the View top offset
   * @see https://reactnative.dev/docs/layout-props#top
   */
  top?: ViewStyle['top'];
  /**
   * Renders the View bottom offset
   * @see https://reactnative.dev/docs/layout-props#bottom
   */
  bottom?: ViewStyle['bottom'];
  /**
   * Provides haptic feedback on touch - Haptics.selectionAsync()
   * @see https://docs.expo.io/versions/latest/sdk/haptics/
   */
  haptic?: boolean;
  /**
   * Adds vibration feedback on touch using Vibration.vibrate pattern
   * @see https://reactnative.dev/docs/vibration
   */
  vibrate?: number | number[] | null;
  /**
   * Repeat vibration pattern
   * @see https://reactnative.dev/docs/vibration
   */
  vibrateRepeat?: boolean | null;
  /**
   * Renders Button content
   */
  children?: React.ReactNode;
}

/**
 * ## Checkbox
 * Default usage:
 * ```
 * <Checkbox checked />
 * ```
 *
 */
export interface ICheckboxProps extends ISpacing {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Checkbox checked value
   */
  checked?: boolean;
  /**
   * Provides haptic feedback when toggling the checkbox
   * @see https://docs.expo.io/versions/latest/sdk/haptics/
   */
  haptic?: boolean;
  /**
   * Renders the Pressable container style
   * @see https://reactnative.dev/docs/view#style
   */
  style?: ViewStyle;
  /**
   * Checkbox onPress callback passing the checked value as params
   */
  onPress?: (checked: boolean) => void;
}

/**
 * ## Image
 * Default usage:
 * ```
 * <Image source={...} />
 * ```
 *
 */
export interface IImageProps extends ImageProps, ISpacing {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Avatar sizing: borderRadius from Math.min(height, weight)
   * sets the width & height to Math.min(height, weight)
   */
  avatar?: boolean;
  /**
   * Generates a shadow style
   * @see https://reactnative.dev/docs/shadow-props
   */
  shadow?: boolean;
  /**
   * Renders an ImageBackground component
   * @see https://reactnative.dev/docs/imagebackground
   */
  background?: boolean;
  /**
   * Renders a predefined theme sizes.borderRadius & overflow: 'hidden'
   * @see https://reactnative.dev/docs/image-style-props#borderradius
   */
  rounded?: boolean;
  /**
   * Renders a custom borderRadius value
   * @see https://reactnative.dev/docs/image-style-props#borderradius
   */
  radius?: ImageStyle['borderRadius'];
  /**
   * Changes the color of all the non-transparent pixels to the tintColor.
   * @see https://reactnative.dev/docs/image-style-props#tintcolor
   */
  color?: ImageStyle['tintColor'];
  /**
   * Modify the appearance and position of your components using 2D or 3D transformations
   * @see https://reactnative.dev/docs/transforms#transform
   */
  transform?: ImageStyle['transform'];
  /**
   * Renders the Image component with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/image#style
   */
  style?: StyleProp<ImageStyle>;
  /** Renders the ImageBackground content */
  children?: React.ReactNode;
}

/**
 * ## Input
 * Default usage:
 * ```
 * <Input />
 * ```
 *
 */
export interface IInputProps extends TextInputProps, ISpacing {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Renders a custom borderColor & placeholderTextColor
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  color?: ColorValue;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.primary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  primary?: boolean;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.secondary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  secondary?: boolean;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.tertiary value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  tertiary?: boolean;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.black value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  black?: boolean;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.white value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  white?: boolean;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.gray value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  gray?: boolean;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.danger value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  danger?: boolean;
  /**
   * Renders a right side danger icon for invalid input value
   * Renders a borderColor & placeholderTextColor directly from the colors.warning value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  warning?: boolean;
  /**
   * Renders a borderColor & placeholderTextColor directly from the colors.success value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  success?: boolean;
  /**
   * Renders a right side success icon for valid input value
   * Renders a borderColor & placeholderTextColor directly from the colors.info value
   * @see https://reactnative.dev/docs/view-style-props#backgroundcolor
   */
  info?: boolean;
  /**
   * Renders a right side search icon
   */
  search?: boolean;
  /**
   * Renders a disabled / non-editable TextInput
   * @see https://reactnative.dev/docs/textinput#editable
   */
  disabled?: boolean;
  /**
   * Renders the label top text
   */
  label?: string;
  /**
   * Renders a left side icon image from the Theme assets
   */
  icon?: keyof ITheme['assets'];
  /**
   * Renders the TextInput content
   */
  children?: React.ReactNode;
  /**
   * Renders the TextInput/Input component with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/textinput#style
   */
  style?: TextStyle;
}

/**
 * ## Modal
 * Default usage:
 * ```
 * <Modal visible>...</Modal>
 * ```
 *
 */
export interface IModalProps extends ModalProps {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Renders the Modal content
   */
  children?: React.ReactNode;
  /**
   * Renders the Text Modal with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/view#style
   */
  style?: ViewStyle;
}

/**
 * ## Switch
 * Default usage:
 * ```
 * <Switch checked />
 * ```
 *
 */
export interface ISwitchProps extends ISpacing {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Switch checked value
   */
  checked?: boolean;
  /**
   * Renders the Switch component with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/view#style
   */
  style?: ViewStyle;
  /**
   * Renders the thumb color value
   */
  thumbColor?: ColorValue;
  /**
   * Renders the switch active thumb backgroundColor value
   */
  activeFillColor?: ColorValue;
  /**
   * Renders the switch inactive thumb backgroundColor value
   */
  inactiveFillColor?: ColorValue;
  /**
   * Renders the thumb style
   * @see https://reactnative.dev/docs/view#style
   */
  thumbStyle?: ViewStyle;
  /**
   * Renders the switch container style
   * @see https://reactnative.dev/docs/view#style
   */
  switchStyle?: ViewStyle;
  /**
   * Switch onPress callback passing the checked value as params
   */
  onPress?: (checked: boolean) => void;
  /**
   * Provides haptic feedback when toggling the switch
   * @see https://docs.expo.io/versions/latest/sdk/haptics/
   */
  haptic?: boolean;
  /**
   * Duration in ms for thumb animated position
   */
  duration?: Animated.TimingAnimationConfig['duration'];
}

/**
 * ## Text
 * Default usage:
 * ```
 * <Text>...</Text>
 * ```
 *
 */
export interface ITextProps extends TextProps, ISpacing {
  /**
   * id for testID & accesibilityLabel
   */
  id?: string;
  /**
   * Renders a Text with predefined textAlign: center
   * @see https://reactnative.dev/docs/text-style-props#textalign
   */
  center?: boolean;
  /**
   * Renders LinearGradient component, colors
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  gradient?: string[];
  /**
   * Renders a Text color directly from the colors.primary value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  primary?: boolean;
  /**
   * Renders a Text color directly from the colors.secondary value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  secondary?: boolean;
  /**
   * Renders a Text color directly from the colors.tertiary value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  tertiary?: boolean;
  /**
   * Renders a Text color directly from the colors.black value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  black?: boolean;
  /**
   * Renders a Text color directly from the colors.white value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  white?: boolean;
  /**
   * Renders a Text color directly from the colors.gray value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  gray?: boolean;
  /**
   * Renders a Text color directly from the colors.danger value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  danger?: boolean;
  /**
   * Renders a Text color directly from the colors.warning value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  warning?: boolean;
  /**
   * Renders a Text color directly from the colors.success value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  success?: boolean;
  /**
   * Renders a Text color directly from the colors.info value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  info?: boolean;
  /**
   * Renders a Text custom color value
   * @see https://reactnative.dev/docs/text-style-props#color
   */
  color?: TextStyle['color'];
  /**
   * Renders a Text with custom opacity value
   * @see https://reactnative.dev/docs/view-style-props#opacity
   */
  opacity?: TextStyle['opacity'];
  /**
   * Renders a Text with custom fontSize
   * @see https://reactnative.dev/docs/text-style-props#fontsize
   */
  size?: ITheme['sizes'] | string | number;
  /**
   * Renders a Text with custom fontWeight
   * @see https://reactnative.dev/docs/text-style-props#fontweight
   */
  weight?: TextStyle['fontWeight'];
  /**
   * Renders a Text with custom fontFamily
   * @see https://reactnative.dev/docs/text-style-props#fontfamily
   */
  font?: string;
  /**
   * Renders a Text with predefined fontFamily from theme fonts.bold
   * @see https://reactnative.dev/docs/text-style-props#fontfamily
   */
  bold?: boolean;
  /**
   * Renders a Text with predefined fontFamily from theme fonts.semibold
   * @see https://reactnative.dev/docs/text-style-props#fontfamily
   */
  semibold?: boolean;
  /**
   * Renders LinearGradient start points
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  start?: LinearGradientPoint;
  /**
   * Renders LinearGradient end points
   * @see https://docs.expo.io/versions/latest/sdk/linear-gradient/#props
   */
  end?: LinearGradientPoint;
  /**
   * Renders a Text with predefined fontSize from theme sizes.h1
   * @see https://reactnative.dev/docs/text-style-props#fontsize
   */
  h1?: boolean;
  /**
   * Renders a Text with predefined fontSize from theme sizes.h2
   * @see https://reactnative.dev/docs/text-style-props#fontsize
   */
  h2?: boolean;
  /**
   * Renders a Text with predefined fontSize from theme sizes.h3
   * @see https://reactnative.dev/docs/text-style-props#fontsize
   */
  h3?: boolean;
  /**
   * Renders a Text with predefined fontSize from theme sizes.h4
   * @see https://reactnative.dev/docs/text-style-props#fontsize
   */
  h4?: boolean;
  /**
   * Renders a Text with predefined fontSize from theme sizes.h5
   * @see https://reactnative.dev/docs/text-style-props#fontsize
   */
  h5?: boolean;
  /**
   * Renders a Text with predefined fontSize from theme sizes.p
   * @see https://reactnative.dev/docs/text-style-props#fontsize
   */
  p?: boolean;
  /**
   * Renders a Text with custom textAlign
   * @see https://reactnative.dev/docs/text-style-props#textalign
   */
  align?: TextStyle['textAlign'];
  /**
   * Renders a Text with custom textTransform: 'none', 'uppercase', 'lowercase', 'capitalize'
   * @see https://reactnative.dev/docs/text-style-props#texttransform
   */
  transform?: TextStyle['textTransform'];
  /**
   * Renders a Text with custom lineHeight
   * @see https://reactnative.dev/docs/text-style-props#lineheight
   */
  lineHeight?: TextStyle['lineHeight'];
  /**
   * Renders text right offset
   * @see https://reactnative.dev/docs/layout-props#right
   */
  right?: TextStyle['right'];
  /**
   * Renders the View left offset
   * @see https://reactnative.dev/docs/layout-props#left
   */
  left?: TextStyle['left'];
  /**
   * Renders the View top offset
   * @see https://reactnative.dev/docs/layout-props#top
   */
  top?: TextStyle['top'];
  /**
   * Renders the View bottom offset
   * @see https://reactnative.dev/docs/layout-props#bottom
   */
  bottom?: TextStyle['bottom'];
  /**
   * Renders text position
   * @see https://reactnative.dev/docs/layout-props#position
   */
  position?: TextStyle['position'];
  /**
   * Renders a Text component to display text
   * Supports nesting, styling, and touch handling.
   * @see https://reactnative.dev/docs/text
   */
  children?: React.ReactNode;
  /**
   * Renders the Text component with custom style, overwrite existing/predefined styles
   * @see https://reactnative.dev/docs/text#style
   */
  style?: TextStyle;
}
