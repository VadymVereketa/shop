import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {IProduct} from '../../typings/FetchData';
import ProductItem from './ProductItem';

const window = Dimensions.get('window');
const width = Math.min(window.width, window.height);

interface IProductsProps {
  scrollEnabled?: boolean;
  products: IProduct[];
  onScroll?: any;
}

const Products = ({products, onScroll, scrollEnabled}: IProductsProps) => {
  return (
    <FlatGrid
      itemDimension={width / Math.max(Math.floor(width / 230), 2)}
      spacing={-1}
      scrollEnabled={scrollEnabled}
      data={products}
      bounces={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      renderItem={({item}) => (
        <View key={item.id} style={[styles.itemContainer]}>
          <ProductItem product={item} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {},
});

export default Products;
