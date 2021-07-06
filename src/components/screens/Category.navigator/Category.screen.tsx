import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import SplashScreen from 'react-native-splash-screen';
import {sizes} from '../../../context/ThemeContext';
import {IFetchCategory} from '../../../typings/ICategory';
import CategoryItem from '../../common/CategoryItem';
import {CategoryScreenProps} from '../../navigators/Category.navigator';

const numColumns = 2;
const paddingHorizontal = sizes[4];
const gap = sizes[1];
const widthItem =
  responsiveScreenWidth(50) - paddingHorizontal - gap * numColumns;
const CategoryScreen = ({route, navigation}: CategoryScreenProps) => {
  const {treeCategory} = route.params;

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const filterCategory = treeCategory.children.filter((c) => !!c.children);

  return (
    <SafeAreaView style={{}}>
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

export default CategoryScreen;
