import React from 'react';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {GhostButton} from './MyButton';
import {TextInput} from 'react-native-gesture-handler';
import IconButton from './IconButton';

interface ICountInputProps {
  isWeightUnit: boolean;
  //onChange: (o: number) => any;
  //value: number;
  isEditable?: boolean;
}

const CountInput = ({isEditable, isWeightUnit}: ICountInputProps) => {
  const {primary} = useTheme();
  return isWeightUnit ? (
    <View style={[styles.con]}>
      <IconButton
        icon={{
          name: 'arrow-right',
          fill: primary,
          size: sizes[10],
        }}
        style={{
          backgroundColor: 'red',
          paddingHorizontal: sizes[5],
          transform: [
            {
              rotate: '180deg',
            },
          ],
        }}
      />
      <TextInput
        keyboardType={'numeric'}
        style={[styles.inputText, {color: primary}]}
        defaultValue={'1500'}
      />
      <IconButton
        style={{
          backgroundColor: 'red',
          paddingHorizontal: sizes[5],
        }}
        icon={{
          name: 'arrow-right',
          fill: primary,
          size: sizes[10],
        }}
      />
    </View>
  ) : (
    <View style={[styles.con]}>
      <GhostButton
        style={{backgroundColor: 'red'}}
        styleText={[styles.incrBtn, {color: primary}]}>
        -
      </GhostButton>
      <TextInput
        keyboardType={'numeric'}
        style={[styles.inputText, {color: primary}]}
        defaultValue={'1500'}
      />
      <GhostButton styleText={[styles.incrBtn, {color: primary}]}>
        +
      </GhostButton>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  incrBtn: {
    fontSize: sizes[12],
  },
  inputText: {
    fontSize: sizes[10],
    textAlign: 'center',
    marginHorizontal: -sizes[20],
    minWidth: sizes[30],
    flexGrow: 1,
  },
});
export default CountInput;
