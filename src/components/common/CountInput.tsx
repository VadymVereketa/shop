import React from 'react';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {GhostButton} from './MyButton';
import {TextInput} from 'react-native-gesture-handler';
import IconButton from './IconButton';
import DesignIcon from './DesignIcon';

interface ICountInputProps {
  isWeightUnit: boolean;
  //onChange: (o: number) => any;
  //value: number;
  isEditable?: boolean;
}

const iconSize = sizes[7];

const CountInput = ({isEditable, isWeightUnit}: ICountInputProps) => {
  const {primary} = useTheme();
  return isWeightUnit ? (
    <View style={[styles.con]}>
      <IconButton
        icon={{
          name: 'arrow-right',
          fill: primary,
          size: iconSize,
        }}
        style={[
          styles.incrBtn,
          {
            transform: [
              {
                rotate: '180deg',
              },
            ],
          },
        ]}
      />
      <TextInput
        keyboardType={'numeric'}
        style={[styles.inputText, {color: primary}]}
        defaultValue={'1500'}
      />
      <IconButton
        style={styles.incrBtn}
        icon={{
          name: 'arrow-right',
          fill: primary,
          size: iconSize,
        }}
      />
    </View>
  ) : (
    <View style={[styles.con]}>
      <IconButton
        style={styles.incrBtn}
        icon={{
          name: 'minus',
          fill: primary,
          size: iconSize,
        }}
      />
      <TextInput
        keyboardType={'numeric'}
        style={[styles.inputText, {color: primary}]}
        defaultValue={'1500'}
      />
      <IconButton
        style={styles.incrBtn}
        icon={{
          name: 'plus',
          fill: primary,
          size: iconSize,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: sizes[1],
    flex: 1,
  },
  incrBtn: {
    paddingHorizontal: sizes[8],
    paddingVertical: sizes[14],
  },
  inputText: {
    fontSize: sizes[10],
    textAlign: 'center',
    flexGrow: 1,
  },
});
export default CountInput;
