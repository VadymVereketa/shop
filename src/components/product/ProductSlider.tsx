import React, {useEffect, useState} from 'react';
import {IProduct} from '../../typings/FetchData';
import {StyleSheet, View} from 'react-native';
import MyText from '../controls/MyText';
import {sizes} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import service from '../../services/service';
import {ScrollView} from 'react-native-gesture-handler';
import ProductItem from './ProductItem';
import {
  responsiveScreenWidth,
  responsiveWidth,
  useResponsiveScreenWidth,
  useResponsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IProductSliderProps {
  idCategory: number;
}
const ProductSlider = ({idCategory}: IProductSliderProps) => {
  const insets = useSafeAreaInsets();
  const w =
    useResponsiveScreenWidth(100) - sizes[8] - insets.left - insets.right;
  const wp = w / 2 - sizes[6];
  const [products, setProducts] = useState([] as IProduct[]);

  useEffect(() => {
    service
      .getProducts({
        idTag: null,
        top: 12,
        skip: 0,
        title: '',
        idCategory: idCategory,
      })
      .then((res) => {
        if (res.success) {
          setProducts(res.data.items);
        }
      });
  }, []);

  if (products.length === 0) return null;

  return (
    <View>
      <MyText style={styles.title}>Інші продукти з цого розділу</MyText>
      <ScrollView
        horizontal={true}
        snapToInterval={w}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginHorizontal: -sizes[1],
          marginBottom: sizes[8],
        }}>
        {products.map((p) => (
          <View
            style={{
              width: wp,
              marginHorizontal: sizes[3],
            }}>
            <ProductItem key={p.id} product={p} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
    marginBottom: sizes[8],
  },
});

export default ProductSlider;
