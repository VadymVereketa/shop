import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ProductScreenProps} from '../../navigators/Secondary.navigator';
import CountInput from '../../common/CountInput';
import I18n from 'react-native-i18n';
import MyText from '../../common/MyText';
import {useFormattingContext} from '../../../context/FormattingContext';
import MyButton from '../../common/MyButton';
import t from '../../../utils/translate';

const ProductScreen = ({navigation, route}: ProductScreenProps) => {
  const {setLocale, currentLocale} = useFormattingContext();
  const [v1, setV1] = useState(1000);
  const [v2, setV2] = useState(1000);
  return (
    <View style={[styles.container]}>
      <MyButton onPress={() => setLocale(currentLocale === 'uk' ? 'en' : 'uk')}>
        asd
      </MyButton>
      <View style={[styles.con]}>
        <CountInput
          isWeightUnit={true}
          value={v1}
          onChange={setV1}
          isEditable={true}
        />
        <CountInput
          isWeightUnit={false}
          value={v2}
          onChange={setV2}
          isEditable={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  con: {
    flexDirection: 'row',
  },
});

export default ProductScreen;
