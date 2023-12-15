import React, {FC} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
} from 'react-native';

import {Color, Images, Styles} from '../../common';
import {DisplayMode} from '@redux/Categories';

interface ControlBarProps {
  switchDisplayMode: (mode: DisplayMode) => void;
  categories: any;
  openCategoryPicker: () => void;
  isVisible: boolean;
  name: string;
}

const controlBarHeight = 50;

const ControlBar: FC<ControlBarProps> = ({
  switchDisplayMode,
  categories,
  openCategoryPicker,
  isVisible,
  name,
}) => {
  const shouldComponentUpdate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return true;
  };

  return (
    <View
      style={[styles.container, {height: isVisible ? controlBarHeight : 0}]}>
      <TouchableOpacity
        onPress={openCategoryPicker}
        style={styles.iconAndTextWrap}>
        <Image
          source={Images.IconFilter}
          style={[styles.iconStyle, styles.dark]}
        />
        <Text style={styles.text}>{name}</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {Platform.OS == 'ios' && (
          <TouchableOpacity
            onPress={() => switchDisplayMode(DisplayMode.CardMode)}
            style={styles.modeButton}>
            <Image
              source={Images.IconCard}
              style={[
                styles.iconStyle,
                categories.displayMode === DisplayMode.CardMode && styles.dark,
                ,
              ]}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => switchDisplayMode(DisplayMode.ListMode)}
          style={styles.modeButton}>
          <Image
            source={Images.IconList}
            style={[
              styles.iconStyle,
              categories.displayMode === DisplayMode.ListMode && styles.dark,
              ,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => switchDisplayMode(DisplayMode.GridMode)}
          style={styles.modeButton}>
          <Image
            source={Images.IconGrid}
            style={[
              styles.iconStyle,
              categories.displayMode === DisplayMode.GridMode && styles.dark,
              ,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: controlBarHeight,
    backgroundColor: Color.navigationBarColor,
    borderColor: Color.lightDivide,
    borderTopWidth: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,

    ...Platform.select({
      ios: {
        borderBottomWidth: 1,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modeButton: {
    ...Styles.Common.ColumnCenter,
    borderColor: Color.lightDivide,
    borderLeftWidth: 1,
    width: controlBarHeight - 10,
    height: controlBarHeight - 10,
  },
  iconAndTextWrap: {
    ...Styles.Common.RowCenter,
    marginHorizontal: 20,
  },
  text: {
    color: Color.black,
    paddingLeft: 10,
  },
  iconStyle: {
    resizeMode: 'contain',
    width: 18,
    height: 18,
    opacity: 0.2,
  },
  dark: {
    opacity: 0.9,
  },
});

import {connect} from 'react-redux';

const mapStateToProps = (state: any) => {
  return {categories: state.categories};
};

function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  const {categories} = stateProps;
  const {dispatch} = dispatchProps;
  const {actions} = require('@redux/Categories');

  return {
    ...ownProps,
    ...stateProps,
    switchDisplayMode: (mode: DisplayMode) => {
      dispatch(actions.switchDisplayMode(mode));
    },
  };
}

export default connect(mapStateToProps, undefined, mergeProps)(ControlBar);
