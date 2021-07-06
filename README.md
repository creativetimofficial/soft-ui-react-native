# Introduction

Soft UI Pro React Native is a premium mobile UI template built with Google's React-Native allowing you to create powerful and beautiful mobile applications. 

Using the mobile application is very simple but it does require you to understand basic React functions and React Native also to work with React Native, you will need to have an understanding of JavaScript fundamentals.  

## Getting Started
* Getting started: [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
* React Fundamentals: [https://reactnative.dev/docs/intro-react](https://reactnative.dev/docs/intro-react)

## Installation

Once you've downloaded the product from our website you should unzip the folder. The next step is for you to open up your terminal and go directly to the newly created folder called `soft-ui-react-native-vX.Y` (x and y are numbers indicating the version number). Once you're there run `npm install` or `yarn install` and then `expo start` to start the project.

* **Running on Simulator**:
If you are using a simulator or emulator, you may find the following Expo CLI keyboard shortcuts to be useful:
- Pressing **i** will open in an [iOS simulator](https://docs.expo.io/workflow/ios-simulator/).
- Pressing **a** will open in an [Android emulator or connected device](https://docs.expo.io/workflow/android-studio-emulator/).
- Pressing **w** will open in your browser. Expo supports all major browsers.


# Guide

## Directory Structure
```
.
├── App.tsx
├── app.json
├── assets
├── babel.config.js
├── package.json
├── src
│   ├── assets
│   │   ├── fonts
│   │   ├── icons
│   │   └── images
│   ├── components
│   │   ├── Article.tsx
│   │   ├── Block.tsx
│   │   ├── Button.tsx
│   │   ├── Calendar.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Image.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Product.tsx
│   │   ├── Switch.tsx
│   │   ├── Text.tsx
│   │   └── index.tsx
│   ├── constants
│   │   ├── dark.ts
│   │   ├── index.ts
│   │   ├── light.ts
│   │   ├── mocks.ts
│   │   ├── regex.ts
│   │   ├── theme.ts
│   │   ├── translations
│   │   │   ├── en.json
│   │   │   ├── fr.json
│   │   │   └── index.ts
│   │   └── types
│   │       ├── components.ts
│   │       ├── index.ts
│   │       └── theme.ts
│   ├── hooks
│   │   ├── index.ts
│   │   ├── useData.tsx
│   │   ├── useScreenOptions.tsx
│   │   ├── useTheme.tsx
│   │   └── useTranslation.tsx
│   ├── navigation
│   │   ├── App.tsx
│   │   ├── Menu.tsx
│   │   └── Screens.tsx
│   └── screens
│       ├── About.tsx
│       ├── Agreement.tsx
│       ├── Articles.tsx
│       ├── Booking.tsx
│       ├── Chat.tsx
│       ├── Components.tsx
│       ├── Extras.tsx
│       ├── Home.tsx
│       ├── Login.tsx
│       ├── Notifications.tsx
│       ├── NotificationsSettings.tsx
│       ├── Privacy.tsx
│       ├── Profile.tsx
│       ├── Register.tsx
│       ├── Rental.tsx
│       ├── Rentals.tsx
│       ├── Settings.tsx
│       ├── Shopping.tsx
│       └── index.ts
└── tsconfig.json
```

#### Constants

This folder contains all constants we're using throughout our React-Native cross-platform app. 

#### Screens

Contains all screens created for Soft UI Pro React-Native. 

#### Components

Components ready to be used and transform however you'd like.

## Customize

Customizing the App will be really easy for you. This is due to the fact we provided you well prepared code. This makes it simple to be able to dig through the code and hence without problems regarding customization. 

You want to change a color thtought the whole app? Just go to the `light.ts` or `dark.ts` and modify any color or even add one yourself.

## Adding Screens

Adding screens is really easy, all you have to do is go to the `navigation` directory and edit the `Screens.tsx` file. If you want to add/edit a new screen checkout the existing example from `Stack.Navigator`

If you want to add it inside the Drawer menu under the `src/navigation/Menu.tsx` file, all you have to do is go there and you'll find the `screens` object list. Next in line should be your own route, for example you could write something like this: 

```
{name: 'Your Screen', to: 'YourScreen', icon: YourScreenIcon}
```

# Components

A list explaining all components and the parameters they're receiving. 


## Block
Default example: 
```
<Block>...</Block>
```

Card example: 
```
<Block card>...</Block>
```
#### Properties

| Property | Type | Default | Description |
| :---------: | :--------: | :---------: | :--------- |
| id | string | 'Block' | id for testID & accesibilityLabel | 
| flex | ViewStyle['flex'] | 1 | Renders a View flex style |
| row | boolean | false | Renders a View flexDirection: row style |
| wrap | ViewStyle['flexWrap'] | undefined | Renders a View flexWrap style |
| safe | boolean | false | Renders a SafeAreaView component |
| keyboard | boolean | false | Renders a KeyboardAwareScrollView component |
| scroll | boolean | false | Renders a ScrollView component |
| shadow | boolean | false | Generates a shadow style |
| card | boolean | false | Renders a View with predefined backgroundColor, borderRadius, padding, shadow / elevation |
| center | boolean | false | Renders a View with predefined justifyContent: center |
| outlined | boolean | false | Renders a View with predefined borderWidth: 1, backgroundColor: 'transparent' & borderColor inherited |
| style | StyleProp<ViewStyle> | undefined | Custom View style |
| overflow | ViewStyle['overflow'] | undefined | Renders a View style overflow |
| color | ViewStyle['backgroundColor'] | undefined | Renders a custom backgroundColor |
| gradient | string[] | undefined | Renders LinearGradient component, colors |
| primary | boolean | false | Renders a backgroundColor directly from the colors.primary value |
| secondary | boolean | false | Renders a backgroundColor directly from the colors.secondary value |
| tertiary | boolean | false | Renders a backgroundColor directly from the colors.tertiary value |
| black | boolean | false | Renders a backgroundColor directly from the colors.black value |
| white | boolean | false | Renders a backgroundColor directly from the colors.white value |
| gray | boolean | false | Renders a backgroundColor directly from the colors.gray value |
| danger | boolean | false | Renders a backgroundColor directly from the colors.danger value |
| warning | boolean | false | Renders a backgroundColor directly from the colors.warning value |
| success | boolean | false | Renders a backgroundColor directly from the colors.success value |
| info | boolean | false | Renders a backgroundColor directly from the colors.info value |
| radius | ViewStyle['borderRadius'] | undefined | Renders a custom borderRadius value |
| height | ViewStyle['height'] | undefined | Renders a custom height value |
| width | ViewStyle['width'] | undefined | Renders a custom width value |
| justify | ViewStyle['justifyContent'] | undefined | Renders a flex justifyContent. Available values: 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly' |
| align | ViewStyle['alignItems'] | undefined | Renders a flex alignItems. Available values: 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline' |
| children | React.ReactNode | undefined | Renders the View content |
| blur | boolean | false | Renders a BlueView component |
| intensity | BlurProps['intensity'] | undefined | BlueView intensity, default: 50, values accepted: 1 to 100 |
| tint | BlurProps['tint'] | undefined | BlueView tint color, default: 'default', values accepted: 'light', 'dark', 'default' |
| position | ViewStyle['position'] | undefined | Renders the View position |
| right | ViewStyle['right'] | undefined | Renders the View right offset |
| left | ViewStyle['left'] | undefined | Renders the View left offset |
| top | ViewStyle['top'] | undefined | Renders the View top offset |
| bottom | ViewStyle['bottom'] | undefined | Renders the View bottom offset |
| end | LinearGradientPoint | undefined | Renders LinearGradient end points |
| start | LinearGradientPoint | undefined | Renders LinearGradient start points |

## Button
Default usage: 
```
<Button>...</Button>
```
#### Properties

| Property | Type | Default | Description |
| :---------: | :--------: | :---------: | :--------- |
| id | string | 'Button' | id for testID & accesibilityLabel | 
| children | React.ReactNode | undefined | Renders Button content |
| round | boolean | false | Renders borderRadius value to maxSize / 2 using, maxSize value is calculated from the maximum value from width, minWidth, maxWidth, height, minHeight, maxHeight |
| rounded | boolean | false | Renders borderRadius value using theme sizes.s; default sizes.buttonRadius |
| flex | ViewStyle['flex'] | undefined | Renders a View flex style |
| radius | ViewStyle['borderRadius'] | undefined | Renders a custom borderRadius value |
| color | ViewStyle['backgroundColor'] | undefined | Renders a custom backgroundColor value |
| gradient | string[] | undefined | Renders LinearGradient component, colors |
| primary | boolean | false | Renders a backgroundColor directly from the colors.primary value |
| secondary | boolean | false | Renders a backgroundColor directly from the colors.secondary value |
| tertiary | boolean | false | Renders a backgroundColor directly from the colors.tertiary value |
| gray | boolean | false | Renders a backgroundColor directly from the colors.gray value |
| black | boolean | false | Renders a backgroundColor directly from the colors.black value |
| white | boolean | false | Renders a backgroundColor directly from the colors.white value |
| light | boolean | false | Renders a backgroundColor directly from the colors.light value |
| dark | boolean | false | Renders a backgroundColor directly from the colors.dark value |
| danger | boolean | false | Renders a backgroundColor directly from the colors.danger value |
| warning | boolean | false | Renders a backgroundColor directly from the colors.warning value |
| success | boolean | false | Renders a backgroundColor directly from the colors.success value |
| info | boolean | false | Renders a backgroundColor directly from the colors.info value |
| row | boolean | false | Renders a View flexDirection: row style |
| align | ViewStyle['alignItems'] | undefined | Renders a flex alignItems. Available values: 'auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline' |
| justify | ViewStyle['justifyContent'] | undefined | Renders a flex justifyContent. Available values: 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly' |
| height | ViewStyle['height'] | undefined | Renders a custom height value |
| width | ViewStyle['width'] | undefined | Renders a custom width value |
| outlined | boolean | false | Renders the container style with predefined borderWidth: 1, backgroundColor: 'transparent' & borderColor inherited |
| shadow | boolean | false | Generates a shadow style  |
| social | **facebook**, **twitter**, **dribbble** | undefined | Renders social icons ('logo-facebook', 'logo-twitter', 'logo-dribbble') from Ionicons |
| position | ViewStyle['position'] | undefined | Renders the View position |
| right | ViewStyle['right'] | undefined | Renders the View right offset |
| left | ViewStyle['left'] | undefined | Renders the View left offset |
| top | ViewStyle['top'] | undefined | Renders the View top offset |
| bottom | ViewStyle['bottom'] | undefined | Renders the View bottom offset |
| haptic | boolean | false | Provides haptic feedback on touch - Haptics.selectionAsync() |
| vibrate | number, number[], null | undefined | Adds vibration feedback on touch using Vibration.vibrate pattern |
| vibrateRepeat | boolean | false | Repeat vibration pattern |

## Image
Default usage: 
```
<Image source={...} />
```
#### Properties

| Property | Type | Default | Description |
| :---------: | :--------: | :---------: | :--------- |
| id | string | 'Image' | id for testID & accesibilityLabel |
| avatar | boolean | false | Avatar sizing: borderRadius from Math.min(height, weight), sets the width & height to Math.min(height, weight) |
| shadow | boolean | false | Generates a shadow style  |
| background | boolean | false | Renders an ImageBackground component |
| rounded | boolean | false | Renders a predefined theme sizes.borderRadius & overflow: 'hidden' |
| radius | ImageStyle['borderRadius'] | undefined | Renders a custom borderRadius value |
| color | ImageStyle['tintColor'] | undefined | Changes the color of all the non-transparent pixels to the tintColor. |
| transform | ImageStyle['transform'] | undefined | Modify the appearance and position of your components using 2D or 3D transformations |
| style | StyleProp<ImageStyle> | undefined | Custom Image style |
| children | React.ReactNode | undefined | Renders the ImageBackground content |

## Input
Default usage: 
```
<Input />
```
#### Properties

| Property | Type | Default | Description |
| :---------: | :--------: | :---------: | :--------- |
| id | string | 'Input' | id for testID & accesibilityLabel | 
| children | React.ReactNode | undefined | Renders the TextInput content |
| style | TextStyle | undefined | Renders the TextInput style |
| color | ColorValue | undefined | Renders a custom borderColor & placeholderTextColor |
| primary | boolean | false | Renders a borderColor & placeholderTextColor directly from the colors.primary value |
| secondary | boolean | false | Renders a borderColor & placeholderTextColor directly from the colors.secondary value |
| tertiary | boolean | false | Renders a borderColor & placeholderTextColor directly from the colors.tertiary value |
| black | boolean | false | Renders a borderColor & placeholderTextColor directly from the colors.black value |
| white | boolean | false | Renders a borderColor & placeholderTextColor directly from the colors.white value |
| gray | boolean | false | Renders a borderColor & placeholderTextColor directly from the colors.gray value |
| danger | boolean | false | Renders a right side danger icon for invalid input value. Renders a borderColor & placeholderTextColor directly from the colors.warning value |
| warning | boolean | false | Renders a borderColor & placeholderTextColor directly from the colors.success value |
| success | boolean | false | Renders a right side success icon for valid input value. Renders a borderColor & placeholderTextColor directly from the colors.info value |
| info | boolean | false | Renders a right side success icon for valid input value.Renders a borderColor & placeholderTextColor directly from the colors.info value |
| search | boolean | false | Renders a right side search icon |
| disabled | boolean | false | Renders a disabled / non-editable TextInput |
| label | string | undefined | Renders the label top text |
| icon | keyof ITheme['assets'] | undefined | Renders a left side icon image from the Theme assets |

## Switch
Default usage: 
```
<Switch />
```
#### Properties

| Property | Type | Default | Description |
| :---------: | :--------: | :---------: | :--------- |
| id | string | 'Switch' | id for testID & accesibilityLabel | 
| checked | boolean | false | Switch checked value | 
| style | ViewStyle | undefined | Renders the Switch style | 
| thumbColor | ColorValue | 'white' | Renders the thumb color value | 
| activeFillColor | ColorValue | undefined | Renders the switch active thumb backgroundColor value | 
| inactiveFillColor | ColorValue | undefined | Renders the switch inactive thumb backgroundColor value | 
| thumbStyle | ViewStyle | undefined | Renders the thumb style | 
| switchStyle | ViewStyle | undefined | Renders the switch container style | 
| onPress | (checked: boolean) => void | undefined | Switch onPress callback passing the checked value as params | 
| haptic | boolean | true | Provides haptic feedback when toggling the switch | 
| duration | Animated.TimingAnimationConfig['duration'] | 250 | Duration in ms for thumb animated position | 

## Checkbox
Default usage: 
```
<Checkbox />
```
#### Properties

| Property | Type | Default | Description |
| :---------: | :--------: | :---------: | :--------- |
| id | string | 'Checkbox' | id for testID & accesibilityLabel |
| checked | boolean | false | Checkbox checked value |
| haptic | boolean | true | Provides haptic feedback when toggling the checkbox |
| style | ViewStyle | undefined | Renders the Pressable container style |
| onPress | (checked: boolean) => void | undefined | Checkbox onPress callback passing the checked value as params |

## Text
Default usage: 
```
<Text>...</Text>
```
#### Properties

| Property | Type | Default | Description |
| :---------: | :--------: | :---------: | :--------- |
| id | string | 'Text' | id for testID & accesibilityLabel | 
| children | React.ReactNode | undefined | Renders a Text component to display text. Supports nesting, styling, and touch handling. |
| style | TextStyle | undefined | Renders the Text component with custom style, overwrite existing/predefined styles |
| center | boolean | false | Renders a Text with predefined textAlign: center |
| gradient | string[] | undefined | Renders LinearGradient component, colors |
| primary | boolean | false | Renders a Text color directly from the colors.primary value |
| secondary | boolean | false | Renders a Text color directly from the colors.secondary value |
| tertiary | boolean | false | Renders a Text color directly from the colors.tertiary value |
| black | boolean | false | Renders a Text color directly from the colors.black value |
| white | boolean | false | Renders a Text color directly from the colors.white value |
| gray | boolean | false | Renders a Text color directly from the colors.gray value |
| danger | boolean | false | Renders a Text color directly from the colors.danger value |
| warning | boolean | false | Renders a Text color directly from the colors.warning value |
| success | boolean | false | Renders a Text color directly from the colors.success value |
| info | boolean | false | Renders a Text color directly from the colors.info value |
| color | TextStyle['color'] | undefined | Renders a Text custom color value |
| opacity | TextStyle['opacity'] | undefined | Renders a Text with custom opacity value |
| size | ITheme['sizes'] | string, number, undefined | Renders a Text with custom fontSize |
| weight | TextStyle['fontWeight'] | undefined | Renders a Text with custom fontWeight |
| font | string | undefined | Renders a Text with custom fontFamily |
| bold | boolean | false | Renders a Text with predefined fontFamily from theme fonts.bold |
| semibold | boolean | false | Renders a Text with predefined fontFamily from theme fonts.semibold |
| start | LinearGradientPoint | undefined | Renders LinearGradient start points |
| end | LinearGradientPoint | undefined | Renders LinearGradient end points |
| h1 | boolean | false | Renders a Text with predefined fontSize from theme sizes.h1 |
| h2 | boolean | false | Renders a Text with predefined fontSize from theme sizes.h2 |
| h3 | boolean | false | Renders a Text with predefined fontSize from theme sizes.h3 |
| h4 | boolean | false | Renders a Text with predefined fontSize from theme sizes.h4 |
| h5 | boolean | false | Renders a Text with predefined fontSize from theme sizes.h5 |
| p | boolean | false | Renders a Text with predefined fontSize from theme sizes.p |
| align | TextStyle['textAlign'] | undefined | Renders a Text with custom textAlign |
| transform | TextStyle['textTransform'] | undefined | Renders a Text with custom textTransform: 'none', 'uppercase', 'lowercase', 'capitalize' |
| lineHeight | TextStyle['lineHeight'] | undefined | Renders a Text with custom lineHeight |
| right | TextStyle['right'] | undefined | Renders text right offset |
| left | TextStyle['left'] | undefined | Renders the View left offset |
| top | TextStyle['top'] | undefined | Renders the View top offset |
| bottom | TextStyle['bottom'] | undefined | Renders the View bottom offset |
| position | TextStyle['position'] | undefined | Renders text position |