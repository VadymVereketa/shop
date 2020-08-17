import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import MyText from '../../common/MyText';
import {sizes, useTheme} from '../../../context/ThemeContext';
import PressTitle from '../../common/PressTitle';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getFontFamily} from '../../../utils/getFontFamily';
import {MenuScreenProps} from '../../navigators/Main.navigator';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectorCategory,
  thunkGetCustomCategories,
} from '../../../redux/category/categoryReducer';

const MenuScreen = ({navigation}: MenuScreenProps) => {
  const dis = useDispatch();
  const {border, lightBackground} = useTheme();
  const data = useSelector(selectorCategory.getCustomCategories);
  const err = useSelector(selectorCategory.getError);

  const handle = () => {
    dis(thunkGetCustomCategories);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <MyText style={[styles.text]}>Профiль</MyText>
      <View style={{height: 1, backgroundColor: border}} />
      <PressTitle
        onPress={() => {
          navigation.navigate('AuthNavigator', {screen: 'Login'});
        }}
        style={[styles.btn, styles.btnTop, {backgroundColor: lightBackground}]}>
        Увiйдiть
      </PressTitle>
      <PressTitle
        onPress={() => {
          navigation.navigate('AuthNavigator', {screen: 'SignUp'});
        }}
        style={[styles.btn, {backgroundColor: lightBackground}]}>
        Реєстрація
      </PressTitle>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: sizes[5],
    flex: 1,
  },
  text: {
    textAlign: 'center',
    paddingVertical: sizes[5],
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
  },
  btnTop: {
    marginTop: sizes[10],
    marginBottom: sizes[5],
  },
  btn: {
    borderRadius: sizes[1],
  },
});

export default MenuScreen;
