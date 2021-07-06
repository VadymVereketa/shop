import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IFetchCategory} from '../../typings/ICategory';
import {getFontFamily} from '../../utils/getFontFamily';
import getUrlImg from '../../utils/getUrlImg';
import MyText from '../controls/MyText';

interface ICategoryItemProps {
  category: IFetchCategory;
  onPress: any;
  conStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const CategoryItem = ({
  category,
  onPress,
  conStyle,
  style,
}: ICategoryItemProps) => {
  const {primary, background} = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.con, style]}>
      <Image style={styles.image} source={getUrlImg(category.categoryImages)} />
      <MyText
        style={[
          styles.text,
          {
            color: primary,
            backgroundColor: background,
          },
        ]}>
        {category.name}
      </MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  con: {
    borderBottomRightRadius: sizes[2],
    borderBottomLeftRadius: sizes[2],
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: 'rgb(60, 65, 98)',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 2,
  },
  image: {
    width: '100%',
    height: sizes[70],
  },
  text: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('300'),
    textAlign: 'center',
    paddingVertical: sizes[5],

    borderBottomRightRadius: sizes[2],
    borderBottomLeftRadius: sizes[2],
  },
});
export default CategoryItem;
