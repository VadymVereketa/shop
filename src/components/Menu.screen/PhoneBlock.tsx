import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {selectorsOther} from '../../redux/other/otherReducer';
import {getFontFamily} from '../../utils/getFontFamily';
import t from '../../utils/translate';
import DesignIcon from '../common/DesignIcon';
import MyText from '../controls/MyText';

const PhoneBlock = () => {
  const {lightBackground, primary} = useTheme();
  const phone = useSelector(selectorsOther.getPhone);

  const handlePhone = () => {
    Linking.openURL(`tel:${phone}`);
  };
  return (
    <View style={[styles.infoBlock, {backgroundColor: lightBackground}]}>
      <View>
        <MyText style={{fontSize: sizes[7]}}>{t('profileCall')}</MyText>
        <MyText style={{fontSize: sizes[7], fontFamily: getFontFamily('500')}}>
          10:00 - 19:00
        </MyText>
      </View>
      <View style={styles.phoneBlock}>
        <DesignIcon name={'phone'} size={sizes[8]} fill={primary} />
        <MyText style={styles.phone} onPress={handlePhone}>
          {phone}
        </MyText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoBlock: {
    marginVertical: sizes[8],
    borderRadius: sizes[1],
    paddingHorizontal: sizes[5],
    paddingVertical: sizes[2],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    marginRight: sizes[9],
    marginLeft: sizes[3],
    fontFamily: getFontFamily('500'),
  },
});

export default PhoneBlock;
