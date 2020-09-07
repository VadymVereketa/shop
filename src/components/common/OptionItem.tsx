import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MyText from '../controls/MyText';
import DesignIcon from './DesignIcon';
import {sizes, useTheme} from '../../context/ThemeContext';
import {StyleSheet} from 'react-native';

interface IOptionItemProps {
  info: {
    item: {
      label: string;
      value: number;
    };
  };
  selected: number;
  setSelected: any;
}
const OptionItem = ({info, selected, setSelected}: IOptionItemProps) => {
  const s = info.item;
  const {border, primary, text} = useTheme();

  return (
    <TouchableOpacity
      onPress={() => setSelected(s.value)}
      key={s.value}
      style={[styles.item, {borderBottomColor: border}]}>
      <MyText
        style={[styles.text, {color: selected === s.value ? primary : text}]}>
        {s.label}
      </MyText>
      {selected === s.value && (
        <DesignIcon name={'check-mark'} size={sizes[10]} fill={primary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: sizes[10],
  },
  text: {
    fontSize: sizes[9],
    paddingVertical: sizes[8],
    paddingLeft: sizes[10],
    flexGrow: 1,
  },
});

export default OptionItem;
