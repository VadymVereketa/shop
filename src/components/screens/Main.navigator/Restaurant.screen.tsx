import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  PixelRatio,
  PointPropType,
  Image,
} from 'react-native';
import {RestaurantScreenProps} from '../../navigators/Main.navigator';
import {sizes, useTheme, widths} from '../../../context/ThemeContext';
import {Dimensions} from 'react-native';
import {FlatGrid} from 'react-native-super-grid';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../common/Header';
import {useFormattingContext} from '../../../context/FormattingContext';
import {useSelector} from 'react-redux';
import {selectorCategory} from '../../../redux/category/categoryReducer';
import CategoryBar from '../../common/CategoryBar';
import BoxView from '../../common/BoxView';
import {selectorsOther} from '../../../redux/other/otherReducer';
import {IImgProduct, IProduct} from '../../../typings/FetchData';
import service from '../../../services/service';
import {useAxios} from '../../../useHooks/useAxios';
import {getIndexProductOption} from '../../../utils/getIndexProductOption';
import getUrlImg from '../../../utils/getUrlImg';
import MyButton from '../../common/MyButton';
import {getFontFamily} from '../../../utils/getFontFamily';
import {
  responsiveHeight,
  responsiveWidth,
  useResponsiveWidth,
} from 'react-native-responsive-dimensions';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import ProductItem from '../../common/ProductItem';
import {BoxShadow} from 'react-native-shadow';
import Animated, {diffClamp, interpolate} from 'react-native-reanimated';

const window = Dimensions.get('window');
const width = Math.min(window.width, window.height);

const RestaurantScreen = ({navigation, route}: RestaurantScreenProps) => {
  const perPage = 12;
  const w = useResponsiveWidth(100);
  const shadowOpt = {
    width: w,
    height: 0,
    color: '#a0a0a0',
    border: 3,
    radius: 0,
    opacity: 0.3,
    x: 0,
    y: 0,
    style: {},
  };
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClampScrollY = Animated.diffClamp(
    scrollY,
    0,
    HEADER_HEIGHT.current,
  );
  const categories = route.params.categories;
  const [idCategory, setIdCategory] = useState(-1);
  const [skip, setSkip] = useState(-1);
  const [countItems, setCountItems] = useState(0);
  const isGlobalSearch = useSelector(selectorsOther.getIsGlobalSearch);
  const search = useSelector(selectorsOther.getSearch);
  const [products, setProducts] = useState([] as IProduct[]);
  const {isLoading, request} = useAxios(service.getProducts);

  useEffect(() => {
    if (categories.length > 0) {
      setIdCategory(categories[0].id);
    }
  }, [categories]);

  useDidUpdateEffect(() => {
    setSkip(0);
    setProducts([]);
  }, [idCategory]);

  useDidUpdateEffect(() => {
    request<any>({
      idTag: route.params.isTag ? idCategory : null,
      top: perPage,
      skip: skip * perPage,
      title: search,
      idCategory: !route.params.isTag ? idCategory : null,
    }).then((res) => {
      if (res.success) {
        setProducts((p) => {
          return [...p, ...res.data.items];
        });
        setCountItems(res.data.count);
      }
    });
  }, [skip, idCategory]);

  const handlePress = (id: number) => {
    setIdCategory(id);
  };

  const handleLoad = ({height, y}) => {
    if (height - y <= 50) {
      setSkip((s) => {
        return s + 1;
      });
    }
  };

  const handleEventScroll = (event) => {
    scrollY.setValue(event.nativeEvent.contentOffset.y);

    if (event.nativeEvent && countItems > products.length && !isLoading) {
      const {
        contentOffset: {y},
        layoutMeasurement,
        contentSize,
      } = event.nativeEvent;
      handleLoad({y, height: contentSize.height - layoutMeasurement.height});
    }
  };

  const headerY = Animated.interpolate(diffClampScrollY, {
    inputRange: [0, HEADER_HEIGHT.current],
    outputRange: [0, -HEADER_HEIGHT.current],
  });

  return (
    <View style={[styles.container]}>
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 100,
          transform: [
            {
              translateY: headerY,
            },
          ],
        }}
        onLayout={(e) => (HEADER_HEIGHT.current = e.nativeEvent.layout.height)}>
        <Header />
        <CategoryBar
          tags={categories}
          currentId={idCategory}
          onPress={handlePress}
        />
        <BoxShadow setting={shadowOpt} />
      </Animated.View>
      {!isLoading && countItems === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {countItems === 0 && (
            <Text
              style={{fontFamily: getFontFamily('500'), fontSize: sizes[10]}}>
              На жаль в цій категорії продуктів немає
            </Text>
          )}
        </View>
      ) : (
        <FlatGrid
          itemDimension={width / Math.max(Math.floor(width / 260), 2)}
          data={products}
          bounces={false}
          contentContainerStyle={[
            styles.gridView,
            {paddingTop: HEADER_HEIGHT.current},
          ]}
          onScroll={handleEventScroll}
          scrollEventThrottle={16}
          spacing={-1}
          renderItem={({item}) => (
            <View
              key={item.id}
              style={[styles.itemContainer, {margin: sizes[5]}]}>
              <ProductItem product={item} />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridView: {},
  itemContainer: {
    flex: 1,
  },
});

export default RestaurantScreen;
