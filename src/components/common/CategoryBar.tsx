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
  currentId: number | null;
}
const CategoryBar = React.memo(
  ({tags, currentId, onPress}: ICategoryBarProps) => {
    const insets = useSafeAreaInsets();
    const {background} = useTheme();
    return (
      <ScrollView
        style={{
          marginVertical: sizes[10],
          paddingHorizontal: sizes[5],
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}>
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
    );
  },
);

export default CategoryBar;
