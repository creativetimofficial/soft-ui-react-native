import React, {useEffect} from 'react';
// import {useTranslation} from '../hooks/';
import {Block} from '../components';
import CategoryPage from '../components/Category';

const CategoryInfo = ({route, navigation}) => {
  //   const {t} = useTranslation();
  const {category} = route.params;
  console.log('sadsad', route.params);

  useEffect(() => {
    // Update the header title based on the parameter
    navigation.setOptions({
      title: category.name, // Set the title based on categoryName or a default value
    });
  }, [navigation, category.name]);
  // const {navigate, state} = this.props.navigation;
  return (
    <Block>
      <CategoryPage category={category} />
    </Block>
  );
};

export default CategoryInfo;
