import React from 'react';
import dayjs from 'dayjs';
import {TouchableWithoutFeedback} from 'react-native';

import Text from './Text';
import Block from './Block';
import Image from './Image';
import {useTheme, useTranslation} from '../hooks/';
import {INewProduct} from '../constants/types';

const NewProduct = ({
  id,
  category,
  location,
  quantity,
  description,
  image,
  onPress,
}: INewProduct) => {
  const {t} = useTranslation();
  const {colors, gradients, icons, sizes} = useTheme();

  // render card for Newest & Fashion
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Block card padding={sizes.sm} marginTop={sizes.sm}>
          <Image height={170} resizeMode="cover" source={{uri: image}} />
          {/* article category */}
          <Text
            h5
            bold
            size={13}
            marginTop={sizes.s}
            transform="uppercase"
            marginLeft={sizes.xs}
            gradient={gradients.primary}>
            {category}
          </Text>
          
          {/* article description */}
          <Text
              p
              marginTop={sizes.s}
              marginLeft={sizes.xs}
              marginBottom={sizes.sm}>
              {description}
          </Text>


          {/* location & rating */}
            <Block row align="center">
              <Image source={icons.location} marginRight={sizes.s} />
              <Text p size={12} semibold>
                {location}
              </Text>
              <Text p bold marginHorizontal={sizes.s}>
                •
              </Text>
              <Image source={icons.quantity} marginRight={sizes.s} />
              <Text p size={12} semibold>
                {quantity}
              </Text>
            </Block>
        </Block>
      </TouchableWithoutFeedback>
    );
  

  
};

export default NewProduct;
