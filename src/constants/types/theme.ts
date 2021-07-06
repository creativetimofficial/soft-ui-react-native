import * as React from 'react';
import {
  ColorValue,
  FlexStyle,
  ImageSourcePropType,
  ScaledSize,
  TextStyle,
} from 'react-native';

// Spacing types
export interface ISpacing
  extends Pick<
    FlexStyle,
    | 'margin'
    | 'marginVertical'
    | 'marginHorizontal'
    | 'marginLeft'
    | 'marginRight'
    | 'marginTop'
    | 'marginBottom'
    | 'padding'
    | 'paddingVertical'
    | 'paddingHorizontal'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingTop'
    | 'paddingBottom'
  > {}

export type TWeight =
  /** fontWeight: 400 */
  | 'normal'
  /** fontWeight: 100 */
  | 'thin'
  /** fontWeight: 200 */
  | 'extralight'
  /** fontWeight: 300 */
  | 'light'
  /** fontWeight: 500 */
  | 'medium'
  /** fontWeight: 600 */
  | 'semibold'
  /** fontWeight: 700 */
  | 'bold'
  /** fontWeight: 800 */
  | 'extrabold'
  /** fontWeight: 900 */
  | 'black';

export interface ITheme {
  colors: ThemeColors;
  gradients: ThemeGradients;
  sizes: ThemeSizes & ThemeSpacing & ICommonTheme['sizes'];
  assets: ThemeAssets & ThemeIcons;
  icons: ThemeIcons;
  fonts: ThemeFonts;
  weights: ThemeWeights;
  lines: ThemeLineHeights;
}
export interface ICommonTheme {
  assets: ThemeAssets & ThemeIcons;
  icons: ThemeIcons;
  fonts: ThemeFonts;
  weights: ThemeWeights;
  lines: ThemeLineHeights;
  sizes: {
    width: ScaledSize['width'];
    height: ScaledSize['height'];
  };
}

export interface IThemeProvider {
  children?: React.ReactNode;
  theme?: ITheme;
  setTheme?: (theme?: ITheme) => void;
}

export interface ThemeColors {
  text: ColorValue;
  primary: ColorValue;
  secondary: ColorValue;
  tertiary: ColorValue;
  black: ColorValue;
  white: ColorValue;
  light: ColorValue;
  dark: ColorValue;
  gray: ColorValue;
  danger: ColorValue;
  warning: ColorValue;
  success: ColorValue;
  info: ColorValue;
  card: ColorValue;
  background: ColorValue;
  shadow: ColorValue;
  overlay: ColorValue;
  focus: ColorValue;
  input: ColorValue;
  switchOn: ColorValue;
  switchOff: ColorValue;
  checkbox: string[];
  checkboxIcon: ColorValue;
  facebook: ColorValue;
  twitter: ColorValue;
  dribbble: ColorValue;
  icon: ColorValue;
  blurTint: 'light' | 'dark' | 'default';
  link: ColorValue;
}

export interface ThemeGradients {
  primary?: string[];
  secondary?: string[];
  tertiary?: string[];
  black?: string[];
  white?: string[];
  light?: string[];
  dark?: string[];
  gray?: string[];
  danger?: string[];
  warning?: string[];
  success?: string[];
  info?: string[];
  divider?: string[];
  menu?: string[];
}

export interface ThemeSizes {
  base: number;
  text: number;
  radius: number;
  padding: number;

  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  p: number;

  buttonBorder: number;
  buttonRadius: number;
  socialSize: number;
  socialRadius: number;
  socialIconSize: number;

  inputHeight: number;
  inputBorder: number;
  inputRadius: number;
  inputPadding: number;

  shadowOffsetWidth: number;
  shadowOffsetHeight: number;
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;

  cardRadius: number;
  cardPadding: number;

  imageRadius: number;
  avatarSize: number;
  avatarRadius: number;

  switchWidth: number;
  switchHeight: number;
  switchThumb: number;

  checkboxWidth: number;
  checkboxHeight: number;
  checkboxRadius: number;
  checkboxIconWidth: number;
  checkboxIconHeight: number;

  linkSize: number;

  multiplier: number;
}

export interface ThemeSpacing {
  xs: number;
  s: number;
  sm: number;
  m: number;
  md: number;
  l: number;
  xl: number;
  xxl: number;
}

export interface ThemeWeights {
  text: TextStyle['fontWeight'];
  h1?: TextStyle['fontWeight'];
  h2?: TextStyle['fontWeight'];
  h3?: TextStyle['fontWeight'];
  h4?: TextStyle['fontWeight'];
  h5?: TextStyle['fontWeight'];
  p?: TextStyle['fontWeight'];

  thin: TextStyle['fontWeight'];
  extralight: TextStyle['fontWeight'];
  light: TextStyle['fontWeight'];
  normal: TextStyle['fontWeight'];
  medium: TextStyle['fontWeight'];
  semibold?: TextStyle['fontWeight'];
  bold?: TextStyle['fontWeight'];
  extrabold?: TextStyle['fontWeight'];
  black?: TextStyle['fontWeight'];
}
export interface ThemeIcons {
  apple: ImageSourcePropType;
  google: ImageSourcePropType;
  facebook: ImageSourcePropType;
  arrow: ImageSourcePropType;
  articles: ImageSourcePropType;
  basket: ImageSourcePropType;
  bell: ImageSourcePropType;
  calendar: ImageSourcePropType;
  chat: ImageSourcePropType;
  check: ImageSourcePropType;
  clock: ImageSourcePropType;
  close: ImageSourcePropType;
  components: ImageSourcePropType;
  document: ImageSourcePropType;
  documentation: ImageSourcePropType;
  extras: ImageSourcePropType;
  flight: ImageSourcePropType;
  home: ImageSourcePropType;
  hotel: ImageSourcePropType;
  image: ImageSourcePropType;
  location: ImageSourcePropType;
  menu: ImageSourcePropType;
  more: ImageSourcePropType;
  notification: ImageSourcePropType;
  office: ImageSourcePropType;
  payment: ImageSourcePropType;
  profile: ImageSourcePropType;
  register: ImageSourcePropType;
  rental: ImageSourcePropType;
  search: ImageSourcePropType;
  settings: ImageSourcePropType;
  star: ImageSourcePropType;
  train: ImageSourcePropType;
  users: ImageSourcePropType;
  warning: ImageSourcePropType;
}

export interface ThemeAssets {
  OpenSansLight?: any;
  OpenSansRegular?: any;
  OpenSansSemiBold?: any;
  OpenSansExtraBold?: any;
  OpenSansBold?: any;

  logo: ImageSourcePropType;
  header: ImageSourcePropType;
  background: ImageSourcePropType;

  card1: ImageSourcePropType;
  card2: ImageSourcePropType;
  card3: ImageSourcePropType;
  card4: ImageSourcePropType;
  card5: ImageSourcePropType;

  photo1: ImageSourcePropType;
  photo2: ImageSourcePropType;
  photo3: ImageSourcePropType;
  photo4: ImageSourcePropType;
  photo5: ImageSourcePropType;
  photo6: ImageSourcePropType;
  carousel1: ImageSourcePropType;

  avatar1: ImageSourcePropType;
  avatar2: ImageSourcePropType;

  x5: ImageSourcePropType;
  gle: ImageSourcePropType;
  tesla: ImageSourcePropType;

  ios: ImageSourcePropType;
  android: ImageSourcePropType;
}

export interface ThemeFonts {
  text: string;
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  p: string;
  thin: string;
  extralight: string;
  light: string;
  normal: string;
  medium: string;
  bold: string;
  semibold: string;
  extrabold: string;
  black: string;
}

export interface ThemeLineHeights {
  text: number;
  h1: number;
  h2: number;
  h3: number;
  h4: number;
  h5: number;
  p: number;
}
