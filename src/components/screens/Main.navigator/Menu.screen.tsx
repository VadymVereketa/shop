import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {sizes} from '../../../context/ThemeContext';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../../redux/user/userReducer';
import AuthContent from '../../Menu.screen/AuthContent';
import NoAuthContent from '../../Menu.screen/NoAuthContent';
import {useFormattingContext} from '../../../context/FormattingContext';

const MenuScreen = React.memo(() => {
  const isAuth = useSelector(selectorsUser.isAuth);
  const {currentLocale} = useFormattingContext();

  return (
    <SafeAreaView style={[styles.container]}>
      {isAuth ? <AuthContent /> : <NoAuthContent />}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginHorizontal: sizes[5],
    flexGrow: 1,
  },
});

export default MenuScreen;
