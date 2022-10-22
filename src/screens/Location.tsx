import React, {useCallback, useEffect, useState} from 'react';
import {Linking, Platform, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components';

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

const Location = () => {
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

  return (
    <Block scroll marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Locations
      </Text>
      {/* first card */}
      <Block card marginTop={sizes.sm}>
        <Block row>
          <Block padding={sizes.s} justify="space-between">
            <Text p>Flat 402</Text>
            <TouchableOpacity>
              <Block row align="center">
                <Text p semibold marginRight={sizes.s} color={colors.link}>
                  Blenheim Center, Hounslow
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
      {/* second card */}
      <Block card marginTop={sizes.sm}>
        <Block row>
          <Block padding={sizes.s} justify="space-between">
            <Text p>B3 4</Text>
            <TouchableOpacity>
              <Block row align="center">
                <Text p semibold marginRight={sizes.s} color={colors.link}>
                  Bramha Estate, Pune
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
      {/* third card */}
      <Block card marginTop={sizes.sm}>
        <Block row>
          <Block padding={sizes.s} justify="space-between">
            <Text p>A6 13</Text>
            <TouchableOpacity>
              <Block row align="center">
                <Text p semibold marginRight={sizes.s} color={colors.link}>
                  Bramha Estate, Pune
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Location;
