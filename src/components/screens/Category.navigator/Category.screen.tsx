import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import SplashScreen from 'react-native-splash-screen';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {IFetchCategory} from '../../../typings/ICategory';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import CategoryItem from '../../common/CategoryItem';
import IconButton from '../../controls/IconButton';
import ModalSearchProduct from '../../modals/ModalSearchProduct';
import {CategoryScreenProps} from '../../navigators/Category.navigator';

const numColumns = 2;
const paddingHorizontal = sizes[4];
const gap = sizes[1];
const widthItem =
  responsiveScreenWidth(50) - paddingHorizontal - gap * numColumns;

interface IHeaderRightProps {
  onPressSearch: any;
}

const HeaderRight = ({onPressSearch}: IHeaderRightProps) => {
  const {text} = useTheme();

  return (
    <View style={styles.headerView}>
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

const CategoryScreen = ({route, navigation}: CategoryScreenProps) => {
  const {treeCategory} = route.params;
  const [isShowSearchModal, setIsShowSearchModal] = useState(false);
  const [search, setSearch] = useState('');

  const handlePressSearch = () => {
    setIsShowSearchModal(true);
  };

  useDidUpdateEffect(() => {
    if (isShowSearchModal) {
      return;
    }
    setSearch('');
  }, [isShowSearchModal]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return <HeaderRight onPressSearch={handlePressSearch} />;
      },
    });
  }, []);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const filterCategory = treeCategory.children.filter((c) => !!c.children);

  return (
    <SafeAreaView style={{}}>
      {isShowSearchModal && (
        <ModalSearchProduct
          onSubmit={(str) => setSearch(str)}
          defaultSearch={search}
          modalVisible={isShowSearchModal}
          isInnerSearch={true}
          onClose={() => setIsShowSearchModal(false)}
        />
      )}
      <FlatList
        style={{
          paddingVertical: sizes[10],
          paddingHorizontal: paddingHorizontal,
        }}
        columnWrapperStyle={{}}
        contentContainerStyle={{
          paddingBottom: sizes[20],
        }}
        numColumns={numColumns}
        data={filterCategory}
        renderItem={(info) => {
          const item: IFetchCategory = info.item;

          return (
            <CategoryItem
              conStyle={{}}
              style={{
                marginHorizontal: gap,
                width: widthItem,
                marginBottom: sizes[5],
              }}
              onPress={() => {
                navigation.navigate('Products', {
                  categories: item.children,
                  isTag: false,
                  parentCategoryName: item.name,
                });
              }}
              category={item}
            />
          );
        }}
        keyExtractor={(info) => info.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
export default CategoryScreen;
