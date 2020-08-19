import {sizes, useTheme} from '../../context/ThemeContext';
import {StyleSheet, View} from 'react-native';
import DesignIcon from './DesignIcon';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import React from 'react';
import t from '../../utils/translate';
import {GhostButton} from '../controls/MyButton';

interface IBlockCheckPasswordProps {
  password: string;
}
interface IItemCheckPasswordProps {
  password: string;
  check: (str: string) => boolean;
  text: string;
}
const ItemCheckPassword = ({
  check,
  password,
  text,
}: IItemCheckPasswordProps) => {
  const {text: color, lightText, primary, background} = useTheme();
  const isCheck = check(password);

  return (
    <View style={styles.con}>
      <View
        style={[
          styles.circle,
          {
            borderColor: isCheck ? primary : lightText,
            backgroundColor: isCheck ? primary : background,
          },
        ]}>
        <DesignIcon name={'check-mark'} size={sizes[5]} fill={background} />
      </View>
      <MyText
        style={{
          color: isCheck ? color : lightText,
          fontFamily: getFontFamily(isCheck ? '500' : '300'),
        }}>
        {text}
      </MyText>
    </View>
  );
};

const BlockCheckPassword = ({password}: IBlockCheckPasswordProps) => {
  const checks = [
    {
      check: (str: string = '') => (str || '').length >= 8,
      text: t('checkPasswordMinLength'),
    },
    {
      check: (str: string = '') => /[a-z]/.test(str),
      text: t('checkPasswordLowerCase'),
    },
    {
      check: (str: string = '') => /[A-Z]/.test(str),
      text: t('checkPasswordMUpperCase'),
    },
  ];
  return (
    <View>
      {checks.map((c) => (
        <ItemCheckPassword password={password} check={c.check} text={c.text} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes[4],
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: sizes[8],
    height: sizes[8],
    borderRadius: sizes[4],
    borderWidth: 0.5,
    marginRight: sizes[8],
  },
});

export default BlockCheckPassword;
