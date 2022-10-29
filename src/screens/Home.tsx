import React, {useCallback, useState} from 'react';
import {FlatList} from 'react-native';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Image, Input, Product, Text} from '../components/';
import NewProduct from '../components/NewProduct';

const Home = () => {
  const {t} = useTranslation();
  const [tab, setTab] = useState<number>(0);
  const {recentlyAdded, following, trending} = useData();
  const [products, setProducts] = useState(following);
  const {assets, colors, fonts, gradients, sizes} = useTheme();

  const productList = [
    {
      id:1, 
      category:"Electornic",
      location: "Flat 402",
      quantity: 5,
      description: "New Iphone purchased from MediaMarkt on 12-Oct-22",
      image: 'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
    },
    {
      id:2, 
      category:"Home Appliances",
      location: "Flat 403",
      quantity: 10,
      description: "New Iphone sold out",
      image: 'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
    },
    {
      id:3, 
      category:"phones",
      location: "Flat 40",
      quantity: 10,
      description: "New Iphone sold out",
      image: 'https://images.unsplash.com/photo-1604998103924-89e012e5265a?fit=crop&w=450&q=80',
    },
    
  ]

  const handleProducts = useCallback(
    (tab: number) => {
      setTab(tab);
      if(tab === 0){
        setProducts(recentlyAdded);   
      }else if(tab === 1){
        setProducts(following);
      }else{
        setProducts(trending);
      }
      
    },
    [recentlyAdded, following, trending, setTab, setProducts],
  );

  return (
    <Block>
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={t('common.search')} />
      </Block>

      {/* toggle products list */}
      <Block
        row
        flex={0}
        align="center"
        justify="center"
        color={colors.card}
        paddingBottom={sizes.sm}>
        <Button onPress={() => void(0)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
              <Image source={assets.extras} color={colors.white} radius={0} />
            </Block>
            <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
              {t('home.recentlyadded')}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              {t('home.trending')}
            </Text>
          </Block>
        </Button>
        <Block
          gray
          flex={0}
          width={1}
          marginHorizontal={sizes.sm}
          height={sizes.socialIconSize}
        />
        <Button onPress={() => handleProducts(1)}>
          <Block row align="center">
            <Block
              flex={0}
              radius={6}
              align="center"
              justify="center"
              marginRight={sizes.s}
              width={sizes.socialIconSize}
              height={sizes.socialIconSize}
              gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
              <Image
                radius={0}
                color={colors.white}
                source={assets.documentation}
              />
            </Block>
            <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
              {t('home.trending')}
            </Text>
          </Block>
        </Button>
      </Block>
      

      {/* products list */}
      <FlatList
        data={productList}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.id}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => <NewProduct {...item} />}
      />
    </Block>
  );
};

export default Home;
