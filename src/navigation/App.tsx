import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {useFonts} from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import Menu from './Menu';
import {store} from '../redux/store';
import {useData, ThemeProvider, TranslationProvider} from '../hooks';
import GraphAPI from '../services/GraphAPI';

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
  const checkUser = async () => {
    const customerAccesstoken = await AsyncStorage.getItem(
      'customerAccesstoken',
    );
    console.log('customerAccesstoken-----------', customerAccesstoken);
    if (customerAccesstoken) {
      GraphAPI.getUserByToken(customerAccesstoken, store.dispatch);
    }
  };
  useEffect(() => {
    console.log('<<<<<<<<<<');
    checkUser();
  }, []);

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
      <Provider store={store}>
        <ThemeProvider theme={theme} setTheme={setTheme}>
          <NavigationContainer theme={navigationTheme}>
            <Menu />
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </TranslationProvider>
  );
};
