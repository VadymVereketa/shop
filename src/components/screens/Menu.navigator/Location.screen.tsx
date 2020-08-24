import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {LocationScreenProps} from '../../navigators/Menu.navigator';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {ScrollView} from 'react-native-gesture-handler';
import {getFontFamily} from '../../../utils/getFontFamily';
import MyText from '../../controls/MyText';
import getUrlImg from '../../../utils/getUrlImg';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

const LocationScreen = (props: LocationScreenProps) => {
  const {sellPoint} = props.route.params;
  const {primary, border} = useTheme();
  const insets = useSafeAreaInsets();
  const img = sellPoint.sellPointImage ? sellPoint.sellPointImage.uuid : null;

  return (
    <SafeAreaView style={[styles.container, {marginTop: -insets.top}]}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <MyText style={styles.title}>{sellPoint.name}</MyText>
        <MyText style={styles.address}>{sellPoint.address}</MyText>
        <Image
          source={getUrlImg(img)}
          resizeMode={'center'}
          style={styles.image}
        />
        <View style={[styles.box, {borderColor: border}]}>
          <View style={styles.viewText}>
            <MyText style={styles.subTitle}>Розклад роботи: </MyText>
            <MyText style={styles.text}>Пн - Нд {sellPoint.workTime}</MyText>
          </View>
          <MyText style={styles.subTitle}>
            Замовлення стравити для самовивозу:
          </MyText>
          <MyText style={[styles.text, {color: primary}]}>
            {sellPoint.phone}
          </MyText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: sizes[5],
  },
  title: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
    paddingTop: sizes[8],
    paddingBottom: sizes[4],
  },
  address: {
    fontSize: sizes[9],
    paddingBottom: sizes[10],
  },
  image: {
    width: responsiveScreenWidth(100),
    height: sizes[100] + sizes[20],
  },
  box: {
    borderWidth: 1,
    marginTop: sizes[12],
    paddingHorizontal: sizes[12],
    paddingVertical: sizes[8],
    borderRadius: 1,
  },
  subTitle: {
    fontSize: sizes[10],
    fontFamily: getFontFamily('500'),
  },
  text: {
    fontSize: sizes[10],
  },
  viewText: {
    marginBottom: sizes[10],
  },
});

export default LocationScreen;
