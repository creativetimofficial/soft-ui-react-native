import React, {useCallback, useEffect, useState} from 'react';
import {Linking, Platform, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox, Location} from '../components';

const isAndroid = Platform.OS === 'android';


interface IRegistration {
  name: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  name: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const Locations = () => {
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    email: false,
    password: false,
    agreed: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    email: '',
    password: '',
    agreed: false,
  });
  const {assets, colors, gradients, sizes} = useTheme();

  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

  const handleSignUp = useCallback(() => {
    if (!Object.values(isValid).includes(false)) {
      /** send/save registratin data */
      console.log('handleSignUp', registration);
    }
  }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

 

  const locations = [
    { id: 1, location: 'Flat 402', landmark: 'Blenheim Center', city: 'Hounslow'},
    { id: 2, location: 'B3 4', landmark: 'Bramha Estate', city: 'Pune'},
    { id: 3, location: 'A6 13', landmark: 'Bramha Estate', city: 'Pune'},
    { id: 4, location: 'Flat 402', landmark: 'Blenheim Center', city: 'Hounslow'},
    { id: 5, location: 'B3 4', landmark: 'Bramha Estate', city: 'Pune'},
    { id: 6, location: 'A6 13', landmark: 'Bramha Estate', city: 'Pune'},
    { id: 7, location: '401', landmark: 'VTP Pegasus', city: 'Pune'},
  ]

  return (
    <Block>
        {/* search input */}
        <Block color={colors.card} flex={0} padding={sizes.padding}>
            <Input search placeholder={t('common.search')} />
        </Block>
        <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
            <FlatList
                data={locations}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => `${item?.id}`}
                style={{paddingHorizontal: sizes.padding}}
                contentContainerStyle={{paddingBottom: sizes.l}}
                renderItem={({item}) => <Location {...item} />}
                />
                <Button 
                    position="absolute" 
                    right={sizes.s}
                    bottom={sizes.xxl}
                    round
                    icon="add"
                    onPress={() => navigation.navigate('AddLocation')}/> 
        </Block>
    </Block>
  );
};

export default Locations;