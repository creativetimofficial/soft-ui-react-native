import React, {useLayoutEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import {useHeaderHeight} from '@react-navigation/stack';

import {useTheme} from '../hooks/';
import {Block, Button, Input, Image, Switch, Modal, Text} from '../components/';

// buttons example
const Buttons = () => {
  const [showModal, setModal] = useState(false);
  const [quantity, setQuantity] = useState('01');
  const {assets, colors, gradients, sizes} = useTheme();

  return (
    <Block paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Buttons
      </Text>
      <Block>
        <Button flex={1} gradient={gradients.primary} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            Primary
          </Text>
        </Button>
        <Button
          flex={1}
          gradient={gradients.secondary}
          marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            Secondary
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.info} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            info
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.success} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            success
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.warning} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            warning
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.danger} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            danger
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.light} marginBottom={sizes.base}>
          <Text bold transform="uppercase">
            light
          </Text>
        </Button>
        <Button flex={1} gradient={gradients.dark} marginBottom={sizes.base}>
          <Text white bold transform="uppercase">
            dark
          </Text>
        </Button>
        <Block row justify="space-between" marginBottom={sizes.base}>
          <Button
            flex={1}
            row
            gradient={gradients.dark}
            onPress={() => setModal(true)}>
            <Block
              row
              align="center"
              justify="space-between"
              paddingHorizontal={sizes.sm}>
              <Text white bold transform="uppercase" marginRight={sizes.sm}>
                {quantity}
              </Text>
              <Image
                source={assets.arrow}
                color={colors.white}
                transform={[{rotate: '90deg'}]}
              />
            </Block>
          </Button>
          <Button flex={1} gradient={gradients.dark} marginHorizontal={sizes.s}>
            <Text white bold transform="uppercase" marginHorizontal={sizes.s}>
              Delete
            </Text>
          </Button>
          <Button gradient={gradients.dark}>
            <Text white bold transform="uppercase" marginHorizontal={sizes.sm}>
              Save for later
            </Text>
          </Button>
        </Block>
      </Block>
      <Modal visible={showModal} onRequestClose={() => setModal(false)}>
        <FlatList
          keyExtractor={(index) => `${index}`}
          data={['01', '02', '03', '04', '05']}
          renderItem={({item}) => (
            <Button
              marginBottom={sizes.sm}
              onPress={() => {
                setQuantity(item);
                setModal(false);
              }}>
              <Text p white semibold transform="uppercase">
                {item}
              </Text>
            </Button>
          )}
        />
      </Modal>
    </Block>
  );
};

// texts example
const Typography = () => {
  const {sizes} = useTheme();

  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Typography
      </Text>
      <Block>
        <Text h1>Heading 1</Text>
        <Text h2>Heading 2</Text>
        <Text h3>Heading 3</Text>
        <Text h4>Heading 4</Text>
        <Text h5>Heading 5</Text>
        <Text p>Paragraph</Text>
        <Text marginBottom={sizes.xs}>Text</Text>
      </Block>
    </Block>
  );
};

// inputs example
const Inputs = () => {
  const {colors, sizes} = useTheme();

  return (
    <Block
      color={colors.card}
      marginTop={sizes.m}
      paddingTop={sizes.m}
      paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Inputs
      </Text>
      <Block>
        <Input placeholder="Regular" marginBottom={sizes.sm} />
        <Input placeholder="Search" marginBottom={sizes.sm} />
        <Input
          search
          label="Search"
          marginBottom={sizes.sm}
          placeholder="Search with label"
        />
        <Input success placeholder="Success" marginBottom={sizes.sm} />
        <Input danger placeholder="Error" marginBottom={sizes.sm} />
        <Input disabled placeholder="Disabled" marginBottom={sizes.sm} />
      </Block>
    </Block>
  );
};

// switch example
const Switches = () => {
  const {colors, sizes} = useTheme();
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);

  return (
    <Block
      color={colors.card}
      paddingVertical={sizes.m}
      paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Switches
      </Text>
      <Block>
        <Block row flex={0} align="center" justify="space-between">
          <Text>Switch is {switch1 ? 'ON' : 'OFF'}</Text>
          <Switch
            checked={switch1}
            onPress={(checked) => setSwitch1(checked)}
          />
        </Block>
        <Block
          row
          flex={0}
          align="center"
          justify="space-between"
          marginTop={sizes.s}>
          <Text>Switch is {switch2 ? 'ON' : 'OFF'}</Text>
          <Switch
            checked={switch2}
            onPress={(checked) => setSwitch2(checked)}
          />
        </Block>
      </Block>
    </Block>
  );
};

// social example
const Social = () => {
  const {sizes} = useTheme();

  return (
    <Block paddingVertical={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Social
      </Text>
      <Block row justify="space-evenly">
        <Button social="facebook" />
        <Button social="twitter" />
        <Button social="dribbble" />
      </Block>
    </Block>
  );
};

// cards example
const Cards = () => {
  const {assets, colors, gradients, sizes} = useTheme();

  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Cards
      </Text>
      {/* single card */}
      <Block>
        <Block card row>
          <Image
            resizeMode="contain"
            source={assets?.card1}
            style={{height: 114}}
          />
          <Block padding={sizes.s} justify="space-between">
            <Text p>Adventures - Multi day trips with meals and stays.</Text>
            <TouchableOpacity>
              <Block row align="center">
                <Text p semibold marginRight={sizes.s} color={colors.link}>
                  Read Article
                </Text>
                <Image source={assets.arrow} color={colors.link} />
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
      {/* inline cards */}
      <Block row marginTop={sizes.sm}>
        <Block card marginRight={sizes.sm}>
          <Image
            resizeMode="cover"
            source={assets?.card2}
            style={{width: '100%'}}
          />
          <Block padding={sizes.s} justify="space-between">
            <Text p marginBottom={sizes.s}>
              New ways to meet your business goals.
            </Text>
            <TouchableOpacity>
              <Block row align="center">
                <Text p semibold marginRight={sizes.s} color={colors.link}>
                  Read Article
                </Text>
                <Image source={assets.arrow} color={colors.link} />
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
        <Block card>
          <Image
            resizeMode="cover"
            source={assets?.card3}
            style={{width: '100%'}}
          />
          <Block padding={sizes.s} justify="space-between">
            <Text p marginBottom={sizes.s}>
              The highest status people.
            </Text>
            <TouchableOpacity>
              <Block row align="center">
                <Text p semibold marginRight={sizes.s} color={colors.link}>
                  Read Article
                </Text>
                <Image source={assets.arrow} color={colors.link} />
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
      {/* full image width card */}
      <Block card marginTop={sizes.sm}>
        <Image
          resizeMode="cover"
          source={assets?.card4}
          style={{width: '100%'}}
        />
        <Text
          h5
          bold
          transform="uppercase"
          gradient={gradients.primary}
          marginTop={sizes.sm}>
          Trending
        </Text>
        <Text
          p
          marginTop={sizes.s}
          marginLeft={sizes.xs}
          marginBottom={sizes.sm}>
          The most beautiful and complex UI Kits built by Creative Tim.
        </Text>
        {/* user details */}
        <Block row marginLeft={sizes.xs} marginBottom={sizes.xs}>
          <Image
            source={assets.avatar1}
            style={{width: sizes.xl, height: sizes.xl, borderRadius: sizes.s}}
          />
          <Block marginLeft={sizes.s}>
            <Text p semibold>
              Mathew Glock
            </Text>
            <Text p gray>
              Posted on 28 February
            </Text>
          </Block>
        </Block>
      </Block>
      {/* image background card */}
      <Block card padding={0} marginTop={sizes.sm}>
        <Image
          background
          resizeMode="cover"
          source={assets.card5}
          radius={sizes.cardRadius}>
          <Block color="rgba(0,0,0,0.3)" padding={sizes.padding}>
            <Text h4 white marginBottom={sizes.sm}>
              Flexible office space means growth.
            </Text>
            <Text p white>
              Rather than worrying about switching offices every couple years,
              you can instead stay in the same location.
            </Text>
            {/* user details */}
            <Block row marginLeft={sizes.xs} marginTop={sizes.xxl}>
              <Image
                source={assets.avatar2}
                style={{
                  width: sizes.xl,
                  height: sizes.xl,
                  borderRadius: sizes.s,
                }}
              />
              <Block marginLeft={sizes.s}>
                <Text p white semibold>
                  Devin Coldewey
                </Text>
                <Text p white>
                  Marketing Manager
                </Text>
              </Block>
            </Block>
          </Block>
        </Image>
      </Block>
    </Block>
  );
};

// Photo gallery example
const Gallery = () => {
  const {assets, sizes} = useTheme();
  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  return (
    <Block marginTop={sizes.m} paddingHorizontal={sizes.padding}>
      <Text p semibold marginBottom={sizes.s}>
        Carousel
      </Text>
      {/* carousel example */}
      <Block marginBottom={sizes.xxl}>
        <Image
          resizeMode="cover"
          source={assets.carousel1}
          style={{width: '100%'}}
        />
        <Text p secondary marginTop={sizes.sm}>
          Private Room • 1 Guests • 1 Sofa
        </Text>
        <Text h4 marginVertical={sizes.s}>
          Single room in center
        </Text>
        <Text p lineHeight={26}>
          As Uber works through a huge amount of internal management turmoil,
          the company is also consolidating.
        </Text>
      </Block>
      {/* photo gallery */}
      <Block>
        <Block row align="center" justify="space-between">
          <Text h5 semibold>
            Album 1
          </Text>
          <Button>
            <Text p primary semibold>
              View all
            </Text>
          </Button>
        </Block>
        <Block row justify="space-between" wrap="wrap">
          <Image
            resizeMode="cover"
            source={assets?.photo1}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo2}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo3}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo4}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo5}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
          <Image
            resizeMode="cover"
            source={assets?.photo6}
            marginBottom={IMAGE_MARGIN}
            style={{
              height: IMAGE_SIZE,
              width: IMAGE_SIZE,
            }}
          />
        </Block>
      </Block>

      {/* vertical image */}
      <Block>
        <Block row align="center" justify="space-between">
          <Text h5 semibold>
            Album 2
          </Text>
          <Button>
            <Text p primary semibold>
              View all
            </Text>
          </Button>
        </Block>
        <Block row justify="space-between" wrap="wrap">
          <Image
            resizeMode="cover"
            source={assets?.photo1}
            style={{
              width: IMAGE_VERTICAL_SIZE + IMAGE_MARGIN / 2,
              height: IMAGE_VERTICAL_SIZE * 2 + IMAGE_VERTICAL_MARGIN,
            }}
          />
          <Block marginLeft={sizes.m}>
            <Image
              resizeMode="cover"
              source={assets?.photo2}
              marginBottom={IMAGE_VERTICAL_MARGIN}
              style={{
                height: IMAGE_VERTICAL_SIZE,
                width: IMAGE_VERTICAL_SIZE,
              }}
            />
            <Image
              resizeMode="cover"
              source={assets?.photo3}
              style={{
                height: IMAGE_VERTICAL_SIZE,
                width: IMAGE_VERTICAL_SIZE,
              }}
            />
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const Components = () => {
  const {assets, sizes} = useTheme();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Image
          radius={0}
          resizeMode="cover"
          width={sizes.width}
          height={headerHeight}
          source={assets.header}
        />
      ),
    });
  }, [assets.header, navigation, sizes.width, headerHeight]);

  return (
    <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.padding}}>
        <Block>
          <Buttons />
          <Typography />
          <Inputs />
          <Switches />
          <Social />
          <Cards />
          <Gallery />
        </Block>
      </Block>
    </Block>
  );
};

export default Components;
