import React from 'react';
import {
  RefreshControl,
  StyleSheet,
  ScrollView,
  Animated,
  FlatList,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Color, Styles} from '../../common';
// import {Timer, toast, BlockTimer} from '@app/Omni';
import ProductRow from '../ProductRow';
import {DisplayMode} from '@redux/Categories';
import Text from '../Text';

const styles = StyleSheet.create({
  listView: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'flex-start',
    paddingBottom: 10,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Color.background,
  },
});

class CategoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      loadingBuffer: true,
      modalVisible: false,
      displayControlBar: true,
    };
    this.pageNumber = 1;

    this.renderList = this.renderList.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);
    this.onRowClickHandle = this.onRowClickHandle.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.onRefreshHandle = this.onRefreshHandle.bind(this);
    this.onListViewScroll = this.onListViewScroll.bind(this);

    this.openCategoryPicker = () => this.setState({modalVisible: true});
    this.closeCategoryPicker = () => this.setState({modalVisible: false});
  }

  componentDidMount() {
    // Timer.setTimeout(() => this.setState({loadingBuffer: false}), 1000);
    const {
      fetchProductsByCategoryId,
      clearProducts,
      // selectedCategory,
      category,
    } = this.props;
    clearProducts();
    fetchProductsByCategoryId(category.id, this.pageNumber++);
  }

  // componentWillReceiveProps(nextProps) {
  //   const props = this.props;
  //   const {error} = nextProps.products;
  //   if (error) {
  //     console.log('error');
  //   }

  //   if (props.selectedCategory !== nextProps.selectedCategory) {
  //     this.pageNumber = 1;
  //     props.clearProducts();
  //     props.fetchProductsByCategoryId(
  //       nextProps.selectedCategory.id,
  //       this.pageNumber++,
  //     );
  //   }
  // }

  renderList(data) {
    const {products, displayMode} = this.props;
    const isCardMode = displayMode == DisplayMode.CardMode;
    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderRow}
        enableEmptySections={true}
        onEndReached={this.onEndReached}
        refreshControl={
          <RefreshControl
            refreshing={products.isFetching}
            onRefresh={this.onRefreshHandle}
          />
        }
        contentContainerStyle={styles.listView}
        initialListSize={6}
        pageSize={2}
        numColumns={2}
        renderScrollComponent={this.renderScrollComponent}
      />
    );
  }

  renderRow = ({item, index}) => {
    const {displayMode} = this.props;
    const onPress = () => this.onRowClickHandle(item);
    const isInWishList =
      this.props.wishListItems.find((val) => val.product.id === item.id) !==
      undefined;
    return (
      <ProductRow
        key={index}
        product={item}
        onPress={onPress}
        displayMode={displayMode}
        isInWishList={isInWishList}
        addToWishList={this.addToWishList.bind(this)}
        removeWishListItem={this.removeWishListItem.bind(this)}
      />
    );
  };

  renderScrollComponent(props) {
    const {displayMode} = this.props;
    const mergeOnScroll = (event) => {
      props.onScroll(event);
      this.onListViewScroll(event);
    };

    if (displayMode == DisplayMode.CardMode) {
      return (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          props
          {...props}
          onScroll={mergeOnScroll}
        />
      );
    }

    return <ScrollView props {...props} onScroll={mergeOnScroll} />;
  }

  addToWishList(product) {
    this.props.addWishListItem(product);
  }

  removeWishListItem(product) {
    this.props.removeWishListItem(product);
  }

  onRowClickHandle(product) {
    // BlockTimer.execute(() => {
    //   this.props.onViewProductScreen(product);
    // }, 500);
  }

  onEndReached() {
    // const { products, fetchProductsByCategoryId, selectedCategory } = this.props;
    // if (!products.isFetching && products.stillFetch) {
    //   fetchProductsByCategoryId(selectedCategory.id, this.pageNumber++);
    // }
  }

  onRefreshHandle() {
    // const { fetchProductsByCategoryId, clearProducts, selectedCategory } =
    //   this.props;
    // this.pageNumber = 1;
    // clearProducts();
    // fetchProductsByCategoryId(selectedCategory.id, this.pageNumber++);
  }

  onListViewScroll(event) {
    this.state.scrollY.setValue(event.nativeEvent.contentOffset.y);
  }

  render() {
    // const { modalVisible, loadingBuffer, displayControlBar } = this.state;
    const {products} = this.props;
    // const mainCategory = this.props.mainCategory;
    if (!products) {
      return <Text>Loading..</Text>;
      // return <LogoSpinner fullStretch={true} />;
    } else if (products.error) {
      return <Text>No product here</Text>;
      // return <Empty text={products.error} />;
    }

    let marginControlBar = this.state.scrollY.interpolate({
      inputRange: [-100, 0, 40, 50],
      outputRange: [40, 40, -40, -40],
    });
    return (
      <View style={styles.container}>
        {/* <Animated.View style={{marginTop: marginControlBar}}>
          <ControlBar
            openCategoryPicker={this.openCategoryPicker}
            isVisible={displayControlBar}
            name={this.props.selectedCategory.name}
          />
        </Animated.View>*/}
        {this.renderList(products.list)}
        {/* <SubCategoryPicker
          closeModal={this.closeCategoryPicker}
          visible={modalVisible}
          mainCategory={mainCategory}
        /> */}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedCategory: ownProps.category,
    netInfo: state.netInfo,
    displayMode: state.categories.displayMode,
    products: state.products,
    wishListItems: state.wishList.wishListItems,
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const {netInfo} = stateProps;
  const {dispatch} = dispatchProps;
  const {actions} = require('../../redux/Products');
  const {actions: WishListActions} = require('../../redux/WishList');
  return {
    ...ownProps,
    ...stateProps,
    fetchProductsByCategoryId: (categoryId, page, per_page = 20) => {
      // if (!netInfo.isConnected) {
      //   return 'No connection';
      // }
      actions.fetchProductsByCategoryId(dispatch, categoryId, per_page, page);
    },
    clearProducts: () => dispatch(actions.clearProducts()),
    addWishListItem: (product) => {
      WishListActions.addWishListItem(dispatch, product, null);
    },
    removeWishListItem: (product, variation) => {
      WishListActions.removeWishListItem(dispatch, product, null);
    },
  };
}

export default connect(mapStateToProps, undefined, mergeProps)(CategoryScreen);
