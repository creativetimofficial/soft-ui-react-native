import React, {useCallback, useEffect, useState} from 'react'; 
import {Linking, Platform, FlatList} from 'react-native'; 
import {useNavigation} from '@react-navigation/core'; 
 
import {useData, useTheme, useTranslation} from '../hooks'; 
import * as regex from '../constants/regex'; 
import {Block, Button, Input, Image, Text, Checkbox, Location, Modal} from '../components'; 
import { ILocation } from '../constants/types'; 
 
 
const isAndroid = Platform.OS === 'android'; 
 
const AddLocation = () => { 
  const [showModal, setModal] = useState(false); 
  const [quantity, setQuantity] = useState('01'); 
  const {t} = useTranslation(); 
  const navigation = useNavigation(); 
   
  const {assets, colors, gradients, sizes} = useTheme(); 
 
  return ( 
    <Block 
      color={colors.card} 
      marginTop={sizes.m} 
      paddingTop={sizes.m} 
      paddingHorizontal={sizes.padding}> 
      <Text p semibold marginBottom={sizes.s}> 
        Location 
      </Text> 
      <Block>
        <Input placeholder="Flat No, House no, Building, Company, Apartment" marginBottom={sizes.sm} /> 
        <Input placeholder="Area, Street" marginBottom={sizes.sm} /> 
        <Input placeholder="Landmark" marginBottom={sizes.sm} /> 
        <Input placeholder="Town/City" marginBottom={sizes.sm} /> 
        <Input placeholder="Zipcode/Pincode" marginBottom={sizes.sm} /> 

        <Button 
          marginVertical={sizes.s} 
          marginHorizontal={sizes.sm} 
          gradient={gradients.primary}
          onPress={() => navigation.navigate('Locations')}>
          <Text bold white transform="uppercase"> 
            {t('common.save')}
          </Text> 
        </Button> 
      </Block> 
    </Block> 
  ); 
}; 

export default AddLocation;