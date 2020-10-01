import React from 'react';
import {IChildCategory} from '../../typings/FetchData';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../context/ThemeContext';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from '../controls/MyButton';
import {getFontFamily} from '../../utils/getFontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface ICategoryBarProps {
  tags: {id: number; name: string}[];
  onPress: (id: number) => any;
  currentId: number;
}
const CategoryBar = React.memo(
  ({tags, currentId, onPress}: ICategoryBarProps) => {
    const insets = useSafeAreaInsets();
    const {background} = useTheme();
    return (
      <View
        style={{
          marginBottom: sizes[8],
          marginTop: sizes[3],
          paddingRight: insets.right ? insets.right : sizes[1],
          paddingLeft: insets.left ? insets.left : sizes[1],
          backgroundColor: background,
          zIndex: 1,
        }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {tags.map((t) => {
            return (
              <MyButton
                onPress={() => onPress(t.id)}
                key={t.id}
                isActive={t.id === currentId}
                type={'default'}
                style={{marginHorizontal: sizes[3]}}
                styleText={{
                  fontSize: sizes[10],
                  fontFamily: getFontFamily('400'),
                  paddingHorizontal: sizes[7],
                }}>
                {t.name}
              </MyButton>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

export default CategoryBar;
