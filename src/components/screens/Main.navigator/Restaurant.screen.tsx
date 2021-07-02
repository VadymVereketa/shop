import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {RestaurantScreenProps} from '../../navigators/Main.navigator';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {FlatGrid} from 'react-native-super-grid';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
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
import ModalUpdateApp from '../../modals/ModalUpdateApp';
import ModalAssortment from '../../modals/ModalAssortment';
import ModalAssortmentWarning from '../../modals/ModalAssortmentWarning';
import {selectorsOrder} from '../../../redux/order/orderReducer';
import {selectorCategory2} from '../../../redux/category/categoryReducer';

const window = Dimensions.get('window');
const width = Math.min(window.width, window.height);

const RestaurantScreen = React.memo(
  ({navigation, route}: RestaurantScreenProps) => {
    const perPage = useRef(12);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const {background} = useTheme();
    const HEADER_HEIGHT = sizes[55];
    const categories = route.params.categories;

    const [idCategory, setIdCategory] = useState<any>(null);
    const ID_DEFAULT_SELLPOINT = useSelector(selectorsOther.getIdSellPoint);
    const isDeliverySelf = useSelector(selectorsOrder.isDeliverySelf);
    const isModalAssortment = useSelector(selectorsOther.getIsModalAssortment);
    const isExpress = false;
    const cartSellPoint = useSelector(selectorsOrder.getSellPointId);
    const [isShow, setIsShow] = useState(false);
    const [skip, setSkip] = useState(0);
    const [countItems, setCountItems] = useState(0);
    const isGlobalSearch = useSelector(selectorsOther.getIsGlobalSearch);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([] as IProduct[]);
    const {isLoading, request} = useAxios(service.getProducts);

    const idsCategories = useSelector(
      selectorCategory2.getIdsCategory(idCategory),
    );

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
      console.log(id);

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
      if (isExpress) {
        return;
      }
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
        <View
          style={[
            styles.header,
            {
              backgroundColor: background,
            },
          ]}>
          <Header
            isShow={isShow}
            setIsShow={setIsShow}
            initValue={search}
            onChange={setSearch}
          />
          {isExpress ? (
            <View
              style={{
                height: sizes[4],
              }}
            />
          ) : (
            <CategoryBar
              tags={categories}
              currentId={isGlobalSearch ? -1 : idCategory}
              onPress={handlePress}
            />
          )}
        </View>
        {!isExpress && (
          <Loader isLoading={isLoading} top={sizes[30] + insets.top} />
        )}
        <FlatGrid
          itemDimension={width / Math.max(Math.floor(width / 230), 2)}
          spacing={-1}
          scrollEnabled={!isShow}
          data={products}
          bounces={false}
          contentContainerStyle={[
            styles.gridView,
            {
              paddingTop: isExpress ? sizes[28] : HEADER_HEIGHT + sizes[5],
            },
          ]}
          onScroll={handleEventScroll}
          scrollEventThrottle={16}
          renderItem={({item}) => (
            <View key={item.id} style={[styles.itemContainer]}>
              <ProductItem product={item} />
            </View>
          )}
        />
      </SafeAreaView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridView: {},
  itemContainer: {
    flex: 1,
    margin: sizes[5],
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
