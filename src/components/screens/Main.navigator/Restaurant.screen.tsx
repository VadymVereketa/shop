import React, {useEffect, useMemo, useState} from 'react';
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
import {BoxShadow} from 'react-native-shadow';
import {
  responsiveHeight,
  responsiveWidth,
  useResponsiveWidth,
} from 'react-native-responsive-dimensions';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import ProductItem from '../../common/ProductItem';

const window = Dimensions.get('window');
const width = Math.min(window.width, window.height);

const RestaurantScreen = ({navigation, route}: RestaurantScreenProps) => {
  const perPage = 12;
  const insets = useSafeAreaInsets();
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
    if (event.nativeEvent && countItems > products.length && !isLoading) {
      const {
        contentOffset: {y},
        layoutMeasurement,
        contentSize,
      } = event.nativeEvent;
      handleLoad({y, height: contentSize.height - layoutMeasurement.height});
    }
  };

  return (
    <View style={[styles.container]}>
      <BoxView>
        <Header />
        <CategoryBar
          tags={categories}
          currentId={idCategory}
          onPress={handlePress}
        />
      </BoxView>
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
          style={styles.gridView}
          onScroll={handleEventScroll}
          scrollEventThrottle={100}
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
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

export default RestaurantScreen;
