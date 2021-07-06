import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CategoryBar from '../../common/CategoryBar';
import SplashScreen from 'react-native-splash-screen';
import {ProductsScreenProps} from '../../navigators/Category.navigator';
import ModalSearchProduct from '../../modals/ModalSearchProduct';
import Products from '../../product/Products';
import IconButton from '../../controls/IconButton';
import {responsiveScreenHeight} from 'react-native-responsive-dimensions';

interface IHeaderRightProps {
  onPressSort: any;
  onPressSearch: any;
}

const HeaderRight = ({onPressSearch, onPressSort}: IHeaderRightProps) => {
  const {text} = useTheme();

  return (
    <View style={styles.headerView}>
      <IconButton
        style={styles.headerItem}
        onPress={onPressSort}
        icon={{
          name: 'sort',
          fill: text,
          size: sizes[9],
        }}
      />
      <IconButton
        style={styles.headerItem}
        onPress={onPressSearch}
        icon={{
          name: 'search',
          fill: text,
          size: sizes[9],
        }}
      />
    </View>
  );
};

const RestaurantScreen = React.memo(
  ({navigation, route}: ProductsScreenProps) => {
    const perPage = 12;
    const insets = useSafeAreaInsets();
    const {categories, isTag, parentCategoryName} = route.params;
    const joinCategories = useMemo(() => {
      return [{id: -1, name: 'ВСЕ'}, ...categories];
    }, []);
    const [idCategory, setIdCategory] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [isShowSearchModal, setIsShowSearchModal] = useState(false);
    const [isShowSortModal, setIsShowSortModal] = useState(false);

    const handlePressSort = () => {
      setIsShowSortModal(true);
    };

    const handlePressSearch = () => {
      setIsShowSearchModal(true);
    };

    useEffect(() => {
      navigation.setOptions({
        headerRight: () => {
          return (
            <HeaderRight
              onPressSearch={handlePressSearch}
              onPressSort={handlePressSort}
            />
          );
        },
      });
    }, []);

    useEffect(() => {
      if (parentCategoryName) {
        navigation.setOptions({
          title: search || parentCategoryName,
        });
      }
    }, [parentCategoryName, search]);

    useEffect(() => {
      SplashScreen.hide();
    }, []);

    useEffect(() => {
      if (categories.length > 0) {
        setIdCategory(categories[0].id);
      }
    }, [categories]);

    const handlePress = (id: number) => {
      setIdCategory(id);
      setSearch('');
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
            isInnerSearch={false}
            onClose={() => setIsShowSearchModal(false)}
          />
        )}
        <CategoryBar
          tags={joinCategories}
          currentId={idCategory}
          onPress={handlePress}
        />
        <Products
          idCategory={idCategory}
          isTag={isTag}
          perPage={perPage}
          search={search}
          style={{
            maxHeight: responsiveScreenHeight(78),
          }}
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
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -sizes[7],
  },
  headerItem: {
    marginHorizontal: sizes[7],
  },
});

export default RestaurantScreen;
