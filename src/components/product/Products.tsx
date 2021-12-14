import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FlatGrid} from 'react-native-super-grid';
import {useSelector} from 'react-redux';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import {
  selectorCategory,
  selectorCategory2,
} from '../../redux/category/categoryReducer';
import {SelectorCity} from '../../redux/city/cityReducer';
import {selectorsOrder} from '../../redux/order/orderReducer';
import {selectorsOther} from '../../redux/other/otherReducer';
import service from '../../services/service';
import {IProduct} from '../../typings/FetchData';
import TypeSortProduct from '../../typings/TypeSortProduct';
import {useAxios} from '../../useHooks/useAxios';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import Loader from '../common/Loader';
import ProductItem from './ProductItem';

const window = Dimensions.get('window');
const width = Math.min(window.width, window.height);

interface IProductsProps {
  scrollEnabled?: boolean;
  search: string;
  perPage: number;
  idCategory: any;
  isTag: boolean;
  onPress?: (p: IProduct) => void;
  style?: StyleProp<ViewStyle>;
  sort: TypeSortProduct | null;
}

const Products = ({
  scrollEnabled = true,
  idCategory,
  isTag,
  perPage,
  search,
  onPress,
  style,
  sort,
}: IProductsProps) => {
  const {primary} = useTheme();
  const insets = useSafeAreaInsets();
  const [skip, setSkip] = useState(0);
  const [countItems, setCountItems] = useState(0);
  const {isLoading, request} = useAxios(service.getProducts);
  const [products, setProducts] = useState([] as IProduct[]);

  const idSelectedCity = useSelector(SelectorCity.getSelectedCityId)!;
  const isDeliverySelf = useSelector(selectorsOrder.isDeliverySelf);
  const cartSellPoint = useSelector(selectorsOrder.getSellPointId);

  const isGlobalSearch = idCategory === -1;
  const idsCategories = useSelector(
    selectorCategory2.getSelfIdOrChildrenIds(idCategory),
  );

  const idsTags = useSelector(selectorCategory.getTagsIds);

  useDidUpdateEffect(() => {
    setProducts([]);
    setCountItems(0);
    setSkip(0);
  }, [search, idCategory, sort]);

  useDidUpdateEffect(() => {
    handleRequest();
  }, [skip, idCategory, search, isGlobalSearch, sort]);

  const handleRequest = () => {
    const idTag = idCategory === -1 ? idsTags : idCategory;
    const id = isGlobalSearch ? null : idsCategories;

    request<any>({
      idTag: isTag ? idTag : null,
      top: perPage,
      skip: skip * perPage,
      title: search,
      idCategory: !isTag ? id : null,
      sort,
      idSellPoint: isDeliverySelf ? cartSellPoint : undefined,
      idCity: isDeliverySelf ? undefined : idSelectedCity,
    }).then((res) => {
      if (res.success) {
        setProducts((p) => {
          return [...p, ...res.data.items];
        });
        setCountItems(res.data.count);
      }
    });
  };

  const handleEventScroll = () => {
    if (countItems > products.length && !isLoading) {
      setSkip((s) => {
        return s + 1;
      });
    }
  };

  return (
    <FlatGrid
      itemDimension={Math.floor(width / Math.max(Math.floor(width / 230), 2))}
      spacing={0}
      additionalRowStyle={{}}
      style={[
        {
          flexGrow: 1,
        },
        style,
      ]}
      contentContainerStyle={{
        paddingBottom: insets.bottom + sizes[20],
      }}
      ListFooterComponent={
        isLoading
          ? () => (
              <ActivityIndicator
                style={{paddingVertical: sizes[10]}}
                color={primary}
                size="small"
              />
            )
          : undefined
      }
      scrollEnabled={true}
      data={products}
      bounces={false}
      onEndReached={handleEventScroll}
      onEndReachedThreshold={0.3}
      renderItem={({item}) => (
        <View key={item.id} style={[styles.itemContainer]}>
          <ProductItem product={item} onPress={onPress} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexGrow: 1,
    padding: sizes[2],
  },
});

export default Products;
