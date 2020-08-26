import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {CertificateScreenProps} from '../../navigators/Menu.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {sizes} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyText from '../../controls/MyText';

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
        <MyText style={styles.title}>Правила користування сертифікатом</MyText>
        <MyText style={styles.p}>
          1. Сертифікат номіналом 1000 грн діє на пред'явника сертифікату (не є
          іменним) і може бути використаний в мережі{' '}
          <MyText style={styles.bold}>Egersund Seafood.</MyText>
        </MyText>
        <MyText style={styles.p}>
          2. Сертифікат дійсний на весь асортимент продукції без обмежень.
        </MyText>
        <MyText style={styles.p}>
          3. При здійсненні покупки номінал сертифіката списується повністю. У
          випадку, якщо вартість покупки перевищує номінал сертифікату, різниця
          між вартістю товару і номіналом сертифікату оплачується банківською
          карткою або готівкою.
        </MyText>
        <MyText style={styles.p}>
          4. Сертифікат не може бути використаний для отримання готівки.
        </MyText>
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
