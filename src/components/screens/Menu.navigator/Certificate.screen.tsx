import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CertificateScreenProps} from '../../navigators/Menu.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {sizes} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyText from '../../controls/MyText';
import t from '../../../utils/translate';

const CertificateScreen = React.memo((props: CertificateScreenProps) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <ScrollView>
        <MyText style={styles.title}>{t('certificateRules')}</MyText>
        <MyText style={styles.p}>
          {t('certificateRulesOne')}
          <MyText style={styles.bold}>Egersund Seafood.</MyText>
        </MyText>
        <MyText style={styles.p}>{t('certificateRulesTwo')}</MyText>
        <MyText style={styles.p}>{t('certificateRulesThree')}</MyText>
        <MyText style={styles.p}>{t('certificateRulesFour')}</MyText>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
    flex: 1,
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginVertical: sizes[10],
  },
  bold: {
    fontFamily: getFontFamily('500'),
  },
  p: {
    marginBottom: sizes[10],
  },
});

export default CertificateScreen;
