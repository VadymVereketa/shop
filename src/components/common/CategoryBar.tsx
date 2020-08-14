import React from 'react';
import {IChildCategory} from '../../typings/FetchData';
import {useResponsiveWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../context/ThemeContext';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import MyButton from './MyButton';
import {getFontFamily} from '../../utils/getFontFamily';

interface ICategoryBarProps {
  tags: {id: number; name: string}[];
  onPress: (id: number) => any;
  currentId: number;
}
const CategoryBar = ({tags, currentId, onPress}: ICategoryBarProps) => {
  const {background} = useTheme();
  return (
    <View
      style={{
        paddingVertical: sizes[8],
        paddingHorizontal: sizes[5],
        backgroundColor: background,
        zIndex: 1,
      }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          marginHorizontal: -sizes[3],
        }}>
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
                fontFamily: getFontFamily('500'),
                paddingVertical: sizes[4],
                paddingHorizontal: sizes[7],
              }}>
              {t.name}
            </MyButton>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryBar;
