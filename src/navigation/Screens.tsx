import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Articles, Components, Home, Profile, Register, Login, Locations, AddLocation} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';

const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />

      <Stack.Screen
        name="Components"
        component={Components}
        options={screenOptions.components}
      />

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Locations"
        component={Locations}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="AddLocation" 
        component={AddLocation} 
        options={{ 
                  headerShown: true,  
                  title: t('navigation.addlocation') 
                }} 
      /> 
      
    </Stack.Navigator>
  );
};
