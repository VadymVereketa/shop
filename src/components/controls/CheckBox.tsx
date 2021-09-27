import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {sizes, useTheme} from '../../context/ThemeContext';
import DesignIcon from '../common/DesignIcon';
import MyText from './MyText';

interface ICheckBoxProps<T> {
  value: T;
  onChecked: (value: T) => any;
  isChecked: boolean;
  title: string;
  styleCon?: StyleProp<ViewStyle>;
}

const CheckBox = <T,>({
  isChecked,
  onChecked,
  title,
  value,
  styleCon,
}: ICheckBoxProps<T>) => {
  const {border, accent, background, text} = useTheme();

  const onPress = () => {
    onChecked(value);
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.con, styleCon]}>
      <View
        style={[
          styles.box,
          {
            borderColor: border,
          },
        ]}>
        <DesignIcon
          name="check-mark"
          fill={isChecked ? accent : background}
          size={sizes[7]}
        />
      </View>
      <MyText
        style={{
          color: isChecked ? border : text,
        }}>
        {title}
      </MyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    width: sizes[12],
    height: sizes[12],
    borderRadius: sizes[1],
    marginRight: sizes[6],
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default CheckBox;
