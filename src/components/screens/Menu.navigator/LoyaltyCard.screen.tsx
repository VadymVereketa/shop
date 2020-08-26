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
        <MyText style={styles.title}>Iнформація</MyText>
        <MyText style={styles.text}>
          1. Карта є власнiстю Egersund Seafood.
        </MyText>
        <MyText style={styles.text}>
          2. Карта дійсна у всіх ресторанах Egersund seafood.
        </MyText>
        <MyText style={styles.text}>
          3. Власник карти має право забронювати стіл в будь-якому ресторані
          Egersund seafood.
        </MyText>
        <MyText style={styles.text}>4. Карта не є кредитною.</MyText>
        <MyText style={styles.text}>5. Карта є накопичувальною.</MyText>
        <MyText style={styles.text}>
          6. Загублена карта відновлюється за номером телефону власника.
        </MyText>
        <MyText style={styles.text}>
          7. Власник карти має право отримати інформацію про спеціальні
          пропозиції представлені в ресторані.
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
