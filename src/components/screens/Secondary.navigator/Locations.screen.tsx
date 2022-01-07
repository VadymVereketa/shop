import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {getSellPoints} from '../../../redux/sellPoints/sellPointsReducer';
import t from '../../../utils/translate';
import MyText from '../../controls/MyText';
import PressTitle from '../../controls/PressTitle';
import {LocationsScreenProps} from '../../navigators/Secondary.navigator';

const LocationsScreen = ({navigation}: LocationsScreenProps) => {
  const sellPoints = useSelector(getSellPoints(false));
  const {border, lightBackground, primary} = useTheme();

  return (
    <View>
      {sellPoints.map((s) => {
        return (
          <PressTitle
            key={s.id}
            style={styles.itemMenu}
            isBorder
            onPress={() => {
              navigation.navigate('Location', {
                sellPoint: s,
              });
            }}>
            {s.name}
          </PressTitle>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  itemMenu: {
    paddingVertical: sizes[9],
  },
  locations: {
    paddingTop: sizes[20],
    paddingBottom: sizes[4],
    paddingLeft: sizes[6],
    borderBottomWidth: 1,
  },
});

export default LocationsScreen;
