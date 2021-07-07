import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {LoyaltyCardScreenProps} from '../../navigators/Menu.navigator';
import {useSelector} from 'react-redux';
import {getSellPoints} from '../../../redux/sellPoints/sellPointsReducer';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import MyText from '../../controls/MyText';
import t from '../../../utils/translate';
import PressTitle from '../../controls/PressTitle';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getFontFamily} from '../../../utils/getFontFamily';

const LoyaltyCardScreen = React.memo(({navigation}: LoyaltyCardScreenProps) => {
  const insets = useSafeAreaInsets();
  const {border} = useTheme();
  const sellPoints = useSelector(getSellPoints(false));

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: -insets.top,
        },
      ]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={[styles.locations, {borderBottomColor: border}]}>
          <MyText>{t('profileLocations')}</MyText>
        </View>
        {sellPoints.map((s) => {
          return (
            <PressTitle
              key={s.id}
              style={styles.itemMenu}
              isBorder
              onPress={() => {
                navigation.push('MenuNavigator', {
                  screen: 'Location',
                  params: {
                    sellPoint: s,
                  },
                });
              }}>
              {s.name}
            </PressTitle>
          );
        })}
        <MyText style={styles.title}>{t('loyaltyCardInformation')}</MyText>
        <MyText style={styles.text}>
          {t('loyaltyCardInformationList1')}
        </MyText>
        <MyText style={styles.text}>
          {t('loyaltyCardInformationList2')}
        </MyText>
        <MyText style={styles.text}>
          {t('loyaltyCardInformationList3')}
        </MyText>
        <MyText style={styles.text}>{t('loyaltyCardInformationList4')}</MyText>
        <MyText style={styles.text}>{t('loyaltyCardInformationList5')}</MyText>
        <MyText style={styles.text}>
          {t('loyaltyCardInformationList6')}
        </MyText>
        <MyText style={styles.text}>
          {t('loyaltyCardInformationList7')}
        </MyText>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: sizes[5],
  },
  itemMenu: {
    paddingVertical: sizes[9],
  },
  itemMenuBorder: {
    borderTopWidth: 1,
  },
  locations: {
    paddingBottom: sizes[4],
    paddingLeft: sizes[6],
    borderBottomWidth: 1,
  },
  title: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
    marginVertical: sizes[10],
  },
  text: {
    marginBottom: sizes[5],
  },
});

export default LoyaltyCardScreen;
