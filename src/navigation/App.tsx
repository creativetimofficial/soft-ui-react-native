import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {useFonts} from 'expo-font';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import Menu from './Menu';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
export default () => {
  const {isDark, theme, setTheme} = useData();

  /* set the status bar based on isDark constant */
  useEffect(() => {
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [isDark]);

  // load custom fonts
  const [fontsLoaded] = useFonts({
    'OpenSans-Light': theme.assets.OpenSansLight,
    'OpenSans-Regular': theme.assets.OpenSansRegular,
    'OpenSans-SemiBold': theme.assets.OpenSansSemiBold,
    'OpenSans-ExtraBold': theme.assets.OpenSansExtraBold,
    'OpenSans-Bold': theme.assets.OpenSansBold,
  });

  if (fontsLoaded) {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }

  if (!fontsLoaded) {
    return null;
  }

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      border: 'rgba(0,0,0,0)',
      text: String(theme.colors.text),
      card: String(theme.colors.card),
      primary: String(theme.colors.primary),
      notification: String(theme.colors.primary),
      background: String(theme.colors.background),
    },
  };

  return (
    <TranslationProvider>
      <ThemeProvider theme={theme} setTheme={setTheme}>
        <NavigationContainer theme={navigationTheme}>
          <Menu />
        </NavigationContainer>
      </ThemeProvider>
    </TranslationProvider>
  );
};
