import React, {useEffect, useMemo, useState} from 'react';
import {IProduct} from '../../typings/FetchData';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import MyText from '../controls/MyText';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import service from '../../services/service';
import {ScrollView} from 'react-native-gesture-handler';
import ProductItem from './ProductItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IProductSliderProps {
  idCategory: number;
}
const ProductSlider = ({idCategory}: IProductSliderProps) => {
  const insets = useSafeAreaInsets();
  const {width} = Dimensions.get('window');
  const {primary, lightBackground} = useTheme();

  const config = useMemo(() => {
    const snap = width - sizes[10] - insets.left - insets.right;
    const count = Math.max(Math.floor(snap / 250), 2);
    const widthItem = snap / count;
    return {
      snap,
      count,
      widthItem,
    };
  }, [width, insets]);

  const [products, setProducts] = useState([] as IProduct[]);
  const [current, setCurrent] = useState(0);

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

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setCurrent(Math.ceil(e.nativeEvent.contentOffset.x / config.snap));
  };

  if (products.length === 0) return null;

  return (
    <View>
      <MyText style={styles.title}>Інші продукти з цого розділу</MyText>
      <ScrollView
        horizontal={true}
        bounces={false}
        snapToInterval={config.snap}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: sizes[8],
        }}>
        {products.map((p, i) => (
          <View
            style={{
              width: config.widthItem,
              paddingHorizontal: sizes[3],
            }}>
            <ProductItem key={p.id} product={p} />
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          flex: 1,
          marginBottom: sizes[10],
        }}>
        {Array(Math.ceil(products.length / config.count))
          .fill(1)
          .map((_, i) => {
            return (
              <View
                style={[
                  styles.circle,
                  {backgroundColor: i === current ? primary : lightBackground},
                ]}
              />
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
    marginBottom: sizes[8],
  },
  circle: {
    width: sizes[5],
    height: sizes[5],
    borderRadius: sizes[3],
    marginHorizontal: sizes[2],
  },
});

export default ProductSlider;
