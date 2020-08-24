import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  LocationScreenProps,
  ResultScreenProps,
} from '../../navigators/Menu.navigator';
import {sizes} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyText from '../../controls/MyText';
import MyButton from '../../controls/MyButton';
import ResultSvg from '../../../assets/svg/pic-result.svg';
import {SafeAreaView} from 'react-native-safe-area-context';

const ResultScreen = ({navigation, route}: ResultScreenProps) => {
  const {screen, navigator, title} = route.params;

  const handleBack = () => {
    navigation.replace(navigator as any, {
      screen,
    });
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.top}>
        <ResultSvg width={'100%'} height={sizes[70]} />
        <MyText style={styles.text}>{title}</MyText>
      </View>
      <View>
        <MyButton styleText={styles.btnText} onPress={handleBack}>
          Повернутися
        </MyButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: sizes[5],
    marginBottom: sizes[5],
  },
  text: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
    textAlign: 'center',
    marginTop: sizes[16],
  },
  btnText: {
    fontSize: sizes[10],
  },
  top: {
    marginTop: sizes[30],
  },
});

export default ResultScreen;
