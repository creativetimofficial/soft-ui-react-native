import React from 'react';
import {TouchableOpacity} from 'react-native';

import Text from './Text';
import Block from './Block';
import {useTheme, useTranslation} from '../hooks/';
import {ILocation} from '../constants/types';

const Location = ({
    id,
    location,
    landmark,
    city
   }: ILocation ) => {
  
  const {t} = useTranslation();
  const {colors, gradients, icons, sizes} = useTheme();

  return (
    <Block card marginTop={sizes.sm}>
        <Block row>
          <Block padding={sizes.s} justify="space-between">
            <Text p>{location}</Text>
            <TouchableOpacity>
              <Block row align="center">
              <Text 
                  h5
                  bold
                  size={13}
                  marginTop={sizes.s}
                  transform="uppercase"
                  marginRight={sizes.s}
                  color={colors.link}
                  >
                  {landmark}, {city}
                </Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
  );
}

export default Location;