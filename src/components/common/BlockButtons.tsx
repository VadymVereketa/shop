import React from 'react';
import {StyleSheet, View} from 'react-native';
import MyButton from '../controls/MyButton';
import {sizes} from '../../context/ThemeContext';

interface IBlockButtonsProps {
  onCancel: any;
  onOk: any;
  isLoading: boolean;
  disabled?: boolean;
  textCancel: string;
  textOk: string;
}

const BlockButtons = ({
  isLoading,
  onCancel,
  onOk,
  textCancel,
  textOk,
  disabled = false,
}: IBlockButtonsProps) => {
  return (
    <View style={styles.btns}>
      <MyButton
        onPress={onCancel}
        disabled={isLoading}
        type={'default'}
        containerStyle={styles.btn}
        isActive
        styleText={styles.btnText}>
        {textCancel}
      </MyButton>
      <MyButton
        onPress={onOk}
        isLoading={isLoading}
        disabled={disabled}
        containerStyle={styles.btn}
        styleText={styles.btnText}>
        {textOk}
      </MyButton>
    </View>
  );
};

const styles = StyleSheet.create({
  btns: {
    flexDirection: 'row',
    marginHorizontal: -(sizes[5] / 2),
    marginBottom: sizes[5],
    marginTop: sizes[5],
  },
  btnText: {
    fontSize: sizes[9],
  },
  btn: {
    marginHorizontal: sizes[5],
    flex: 1,
  },
});

export default BlockButtons;
