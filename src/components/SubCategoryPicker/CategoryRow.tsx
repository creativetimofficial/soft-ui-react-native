import React, {FC} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {Styles, Color, Icons} from '../../common';
import {Icon} from '../../common/Omni';

interface CategoryRowProps {
  category: {
    id: string;
    name: string;
  };
  onPress?: () => void;
  isSelect?: boolean;
  isFirst?: boolean;
}

const CategoryRow: FC<CategoryRowProps> = ({
  category,
  onPress,
  isSelect,
  isFirst,
}) => {
//   const shouldComponentUpdate = (nextProps: CategoryRowProps) => {
//     return (
//       isFirst !== nextProps.isFirst ||
//       isSelect !== nextProps.isSelect ||
//       category.id !== nextProps.category.id
//     );
//   };

  return (
    <View style={[styles.container, isFirst ? {borderTopWidth: 0} : {}]}>
      <TouchableOpacity style={styles.subContainer} onPress={onPress}>
        <View style={styles.checkboxWrap}>
          {isSelect ? (
            <Icon
              name={Icons.MaterialCommunityIcons.CheckMark}
              size={20}
              color={Color.accent}
            />
          ) : null}
        </View>
        <Text style={styles.text}>
          {(isFirst ? '' : '--- ') + category.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: Color.blackDivide,
    borderTopWidth: 1,
  },
  subContainer: {
    ...Styles.Common.RowCenterLeft,
    padding: 20,
  },
  checkboxWrap: {
    height: 20,
    width: 20,
    borderColor: Color.blackTextSecondary,
    borderWidth: 1,
    borderRadius: 5,
    ...Styles.Common.ColumnCenter,
  },
  text: {
    marginLeft: 10,
    color: Color.blackTextPrimary,
  },
});



export default CategoryRow;
