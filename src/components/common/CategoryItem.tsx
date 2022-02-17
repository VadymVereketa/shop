import React from 'react';
import {
  Image,
  PixelRatio,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../context/ThemeContext';
import {IFetchCategory} from '../../typings/ICategory';
import {
  categoryImage,
  getCDNKeyBySize,
  ICDNVariantKey,
} from '../../typings/ICDNImage';
import {getFontFamily} from '../../utils/getFontFamily';
import getUrlImg from '../../utils/getUrlImg';
import MyText from '../controls/MyText';

interface ICategoryItemProps {
  category: IFetchCategory;
  onPress: any;
  conStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const key = getCDNKeyBySize(
  PixelRatio.getPixelSizeForLayoutSize(responsiveScreenWidth(48)),
) as ICDNVariantKey;

const CategoryItem = ({
  category,
  onPress,
  conStyle,
  style,
}: ICategoryItemProps) => {
  const {primary, background} = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.con, {backgroundColor: background}, style]}>
      <Image style={styles.image} source={categoryImage(category, key)} />
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
