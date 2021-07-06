import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View, SafeAreaView} from 'react-native';
import {RestaurantScreenProps} from '../../navigators/Main.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {FlatGrid} from 'react-native-super-grid';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../common/Header';
import {useDispatch, useSelector} from 'react-redux';
import CategoryBar from '../../common/CategoryBar';
import {actionsOther, selectorsOther} from '../../../redux/other/otherReducer';
import {IProduct} from '../../../typings/FetchData';
import service from '../../../services/service';
import {useAxios} from '../../../useHooks/useAxios';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import ProductItem from '../../product/ProductItem';
import SplashScreen from 'react-native-splash-screen';
import Loader from '../../common/Loader';
import {thunkGetTypes} from '../../../redux/types/typeReducer';
import {selectorsOrder} from '../../../redux/order/orderReducer';
import {selectorCategory2} from '../../../redux/category/categoryReducer';
import {ProductsScreenProps} from '../../navigators/Category.navigator';
import ModalSearchProduct from '../../modals/ModalSearchProduct';
import Products from '../../product/Products';

const window = Dimensions.get('window');
const width = Math.min(window.width, window.height);

const RestaurantScreen = React.memo(
  ({navigation, route}: ProductsScreenProps) => {
    const perPage = useRef(12);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const {categories, isTag, parentCategoryName} = route.params;

    const joinCategories = useMemo(() => {
      return [{id: -1, name: 'ВСЕ'}, ...categories];
    }, []);
    const [idCategory, setIdCategory] = useState<number | null>(null);
    const ID_DEFAULT_SELLPOINT = useSelector(selectorsOther.getIdSellPoint);
    const isDeliverySelf = useSelector(selectorsOrder.isDeliverySelf);
    const isModalAssortment = useSelector(selectorsOther.getIsModalAssortment);
    const isExpress = false;
    const cartSellPoint = useSelector(selectorsOrder.getSellPointId);
    const [isShow, setIsShow] = useState(false);
    const [skip, setSkip] = useState(0);
    const [countItems, setCountItems] = useState(0);
    const isGlobalSearch = idCategory === -1;
    const [search, setSearch] = useState('');
    const [isShowSearchModal, setIsShowSearchModal] = useState(true);
    const [products, setProducts] = useState([] as IProduct[]);
    const {isLoading, request} = useAxios(service.getProducts);

    const idsCategories = useSelector(
      selectorCategory2.getIdsCategory(idCategory),
    );

    useEffect(() => {
      if (parentCategoryName) {
        navigation.setOptions({
          title: parentCategoryName,
        });
      }
    }, [parentCategoryName]);

    useEffect(() => {
      SplashScreen.hide();
      setProducts([]);
      setSearch('');
      dispatch(
        actionsOther.setData({
          isGlobalSearch: false,
        }),
      );
      dispatch(thunkGetTypes);
    }, []);

    useEffect(() => {
      if (categories.length > 0) {
        setIdCategory(categories[0].id);
      }
    }, [categories]);

    useDidUpdateEffect(() => {
      setSkip(0);
      setProducts([]);
    }, [idCategory, search, isGlobalSearch, isModalAssortment]);

    useDidUpdateEffect(() => {
      if (!isModalAssortment) {
        handleRequest();
      }
    }, [skip, idCategory, search, isGlobalSearch, isModalAssortment]);

    const handleRequest = () => {
      const idTag = isGlobalSearch ? null : idCategory;
      const id = isGlobalSearch ? null : idsCategories;

      request<any>({
        idTag: route.params.isTag ? idTag : null,
        top: perPage.current,
        skip: skip * perPage.current,
        title: search,
        idCategory: !route.params.isTag ? id : null,
        idSellPoint: isDeliverySelf
          ? cartSellPoint || ID_DEFAULT_SELLPOINT
          : undefined,
      }).then((res) => {
        if (res.success) {
          setProducts((p) => {
            return [...p, ...res.data.items];
          });
          setCountItems(res.data.count);
        }
      });
    };

    const handlePress = (id: number) => {
      setIdCategory(id);
      setSearch('');
      dispatch(
        actionsOther.setData({
          isGlobalSearch: false,
        }),
      );
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
      <SafeAreaView
        style={[
          styles.container,
          {
            marginBottom: -insets.bottom,
          },
        ]}>
        {isShowSearchModal && (
          <ModalSearchProduct
            onSubmit={(str) => setSearch(str)}
            defaultSearch={search}
            modalVisible={isShowSearchModal}
            isInnerSearch
            onClose={() => setIsShowSearchModal(false)}
          />
        )}
        <CategoryBar
          tags={joinCategories}
          currentId={idCategory}
          onPress={handlePress}
        />
        {!isExpress && <Loader isLoading={isLoading} top={-sizes[20]} />}
        <Products
          products={products}
          onScroll={handleEventScroll}
          scrollEnabled={!isShow}
        />
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {},
  gridView: {},
  itemContainer: {
    marginHorizontal: sizes[5],
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 5,
  },
  conLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 90,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loading: {
    borderRadius: sizes[30],
    padding: sizes[4],
  },
});

export default RestaurantScreen;
