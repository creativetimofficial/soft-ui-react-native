import React, {FC, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, Modal, Platform, FlatList} from 'react-native';
import {connect} from 'react-redux';
import {Styles, Color} from '../../common';
import CategoryRow from './CategoryRow';
import Button from '../Button';

interface SubCategoryPickerProps {
  visible: boolean;
  closeModal: () => void;
  mainCategory: {
    id: string;
  };
  subCategories: Array<any>;
  selectedCategory: {
    id: string;
  };
  setSelectedCategory: (category: {id: string}) => void;
}

const SubCategoryPicker: FC<SubCategoryPickerProps> = ({
  visible,
  closeModal,
  mainCategory,
  subCategories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [tempCategory, setTempCategory] = useState(selectedCategory);

  const onShow = () => setTempCategory(selectedCategory);

  const renderRow = ({item}: {item: any; index: number}) => {
    const onPress = () => setTempCategory(item);

    return (
      <CategoryRow
        category={item}
        isSelect={tempCategory.id === item.id}
        isFirst={mainCategory.id === item.id}
        onPress={onPress}
      />
    );
  };

  const onSelectPressHandle = () => {
    if (tempCategory.id !== selectedCategory.id) {
      setSelectedCategory(tempCategory);
    }
    closeModal();
  };

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
      onShow={onShow}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.titleWrap}>
            <Text style={styles.title}>Categories</Text>
          </View>
          <View style={styles.listViewWrap}>
            <FlatList
              data={subCategories}
              keyExtractor={(item, index) => `${index}`}
              renderItem={renderRow}
            />
          </View>

          <View style={styles.row}>
            <Button
              text={'Cancel'}
              style={styles.cancelContainer}
              textStyle={styles.cancelText}
              onPress={closeModal}
            />
            <Button
              text={'Select'}
              style={styles.selectContainer}
              textStyle={styles.selectText}
              onPress={onSelectPressHandle}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Styles.width / 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  subContainer: {
    backgroundColor: Color.background,
    borderRadius: 10,
    ...(Platform.OS === 'android' && {
      elevation: 4,
    }),
  },
  titleWrap: {
    ...Styles.Common.ColumnCenter,
    padding: 20,
    backgroundColor: Color.navigationBarColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontWeight: '500',
    color: Color.black,
    fontSize: Styles.FontSize.medium,
  },
  listViewWrap: {
    maxHeight: Styles.height / 2,
    paddingHorizontal: 3,
  },
  selectContainer: {
    padding: 15,
    backgroundColor: 'rgba(0,145,234,1)',
    borderWidth: 0.5,
    borderColor: '#FFF',
    flex: 1,
    borderBottomRightRadius: 10,
  },
  selectText: {
    color: 'white',
    fontSize: 14,
  },
  cancelContainer: {
    padding: 15,
    backgroundColor: '#eee',
    flex: 1,
    borderBottomLeftRadius: 10,
  },
  cancelText: {
    color: 'rgba(0,0,0,1)',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
  },
});

SubCategoryPicker.propTypes = {
  visible: PropTypes.bool,
  closeModal: PropTypes.func,
  mainCategory: PropTypes.object,
  subCategories: PropTypes.array,
};

SubCategoryPicker.defaultProps = {
  visible: false,
};

const mapStateToProps = (state: any) => {
  return {
    categories: state.categories,
    selectedCategory: state.categories.selectedCategory,
  };
};

function mergeProps(stateProps: any, dispatchProps: any, ownProps: any) {
  const {categories} = stateProps;
  const {dispatch} = dispatchProps;
  const {mainCategory} = ownProps;
  const {actions} = require('@redux/Categories');

  return {
    ...ownProps,
    ...stateProps,
    subCategories: [
      mainCategory,
      ...categories.list.filter(
        (category: any) => category.parent === mainCategory.id,
      ),
    ],
    setSelectedCategory: (category: {id: string}) =>
      dispatch(actions.setSelectedCategory(category)),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps,
)(SubCategoryPicker);
