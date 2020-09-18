import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {OrderScreenProps} from '../../navigators/Menu.navigator';
import {IOrderFull} from '../../../typings/FetchData';
import service from '../../../services/service';
import {ScrollView} from 'react-native-gesture-handler';
import InfoOrder from '../../common/InfoOrder';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MyButton from '../../controls/MyButton';
import {getFontFamily} from '../../../utils/getFontFamily';
import CartItem, {PurchaseItem} from '../../common/CartItem';
import PressTitle from '../../controls/PressTitle';
import {TypeDelivery} from '../../../constants/constantsId';
import MyText from '../../controls/MyText';
import {formatAddress} from '../../../utils/formatAddress';
import Animated, {Easing, timing} from 'react-native-reanimated';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {
  formatTime,
  useFormattingContext,
} from '../../../context/FormattingContext';
import {useRepeatOrder} from '../../../useHooks/useRepeatOrder';

const h = sizes[100] + sizes[10];

const OrderScreen = React.memo(({route}: OrderScreenProps) => {
  const offsetY = useRef(new Animated.Value(-h)).current;
  const repeatOrder = useRepeatOrder();
  const [isLoading, setIsLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const insets = useSafeAreaInsets();
  const {longFormatDate, formatPrice} = useFormattingContext();
  const {border, background, lightText} = useTheme();
  const [item, setItem] = useState(route.params.item as IOrderFull);
  const [isHistory, setIsHistory] = useState(false);
  const isReady = !!item.deliveryType;
  const isCourier = item.deliveryType
    ? item.deliveryType.code === TypeDelivery.courier
    : false;
  const client = {...item.client, ...item.contact};
  const courier = item.deliveryPackage && item.deliveryPackage.courier;
  const deliveryPrice = item.deliveryPrice ? +item.deliveryPrice.price : 0;

  const handleToggle = () => {
    if (isReady) {
      setIsShow((s) => !s);
    }
  };

  const handleOrder = async () => {
    if (!isReady) return;

    setIsLoading(true);
    try {
      const data = await service.getProductsByIds(
        item!.purchases.map((p) => p.product.id),
      );
      if (data.success) {
        repeatOrder(item, data.data);
      }
    } catch (e) {}
    setIsLoading(false);
  };

  useEffect(() => {
    service.getOrder(item.id).then((res) => {
      if (res.success) {
        setItem(res.data);
      }
    });
  }, []);

  useDidUpdateEffect(() => {
    timing(offsetY, {
      toValue: isShow ? 0 : -h,
      duration: 300,
      easing: Easing.ease,
    }).start();
  }, [isShow]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {marginTop: -insets.top, marginBottom: isShow ? 0 : -h},
      ]}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: sizes[10],
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={{backgroundColor: background}}>
          <InfoOrder
            id={item.id}
            minExecuteDate={item.minExecuteDate}
            maxExecuteDate={item.maxExecuteDate}
            orderAddress={item.orderAddress}
            orderStatus={item.orderStatus}
          />
        </View>
        <PressTitle style={styles.press} expand onPress={handleToggle}>
          Повна інформація
        </PressTitle>
        {isReady && (
          <Animated.View
            style={[
              styles.infoUser,
              {
                borderColor: border,
                zIndex: -100,
                transform: [
                  {
                    translateY: isReady ? offsetY : 0,
                  },
                ],
              },
            ]}>
            <MyText
              style={
                styles.title
              }>{`${client.firstName} ${client.lastName}`}</MyText>
            <MyText style={styles.title}>{client.phone}</MyText>
            {isCourier ? (
              <MyText style={styles.text}>
                {item.orderAddress || formatAddress(item.address)}
              </MyText>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <MyText style={styles.title}>{item.sellPoint.name}</MyText>
                <MyText style={styles.text}>{item.sellPoint.address}</MyText>
              </View>
            )}
            <View style={{flexDirection: 'row'}}>
              <MyText style={styles.title}>Оплата</MyText>
              <MyText style={styles.text}>
                {item.payments.paymentType.type}
              </MyText>
            </View>
          </Animated.View>
        )}
        <Animated.View
          style={{
            transform: [
              {
                translateY: isReady ? offsetY : 0,
              },
            ],
          }}>
          <View style={[styles.btns, {borderBottomColor: border}]}>
            <MyButton
              containerStyle={{width: '47%', marginRight: sizes[5]}}
              type={'default'}
              ultraWidth={true}
              isActive={!isHistory}
              onPress={() => setIsHistory(false)}
              styleText={styles.btnText}>
              Замовлення
            </MyButton>
            <MyButton
              containerStyle={{width: '47%', marginLeft: sizes[5]}}
              type={'default'}
              ultraWidth={true}
              isActive={isHistory}
              onPress={() => setIsHistory(true)}
              styleText={styles.btnText}>
              Історія
            </MyButton>
          </View>
          {isHistory ? (
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {item.orderStatusHistories
                .sort((a, b) => b.id - a.id)
                .map((h) => {
                  const data = new Date(h.setDate);
                  const formattingDate = `${longFormatDate(
                    data,
                  )} / ${formatTime(data)}`;
                  return (
                    <View>
                      <MyText style={[styles.historyItem, {color: lightText}]}>
                        {formattingDate}
                      </MyText>
                      <MyText style={[styles.historyItem]}>
                        {h.orderStatus.status}
                      </MyText>
                    </View>
                  );
                })}
            </ScrollView>
          ) : (
            <View style={[styles.purchases, {borderTopColor: border}]}>
              {item.purchases
                .sort((a, b) => a.product.id - b.product.id)
                .map((p) => {
                  return <PurchaseItem key={p.product.id} item={p} />;
                })}
              <View style={styles.sumBlock}>
                <MyText style={styles.sumText}>Загальна сума</MyText>
                <MyText style={styles.priceText}>
                  {formatPrice(+item.productsPrice + deliveryPrice)}
                </MyText>
              </View>
            </View>
          )}
          <MyButton
            onPress={handleOrder}
            isLoading={isLoading}
            styleText={styles.historyItem}
            containerStyle={{paddingTop: sizes[10]}}>
            Повторити замовлення
          </MyButton>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: sizes[5],
    paddingTop: sizes[8],
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: sizes[10],
    paddingBottom: sizes[8],
  },
  btnText: {
    fontFamily: getFontFamily('500'),
  },
  press: {
    paddingLeft: 0,
    marginBottom: sizes[10],
  },
  infoUser: {
    padding: sizes[10],
    paddingBottom: sizes[5],
    borderWidth: 1,
  },
  title: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[10],
    marginRight: sizes[5],
    marginBottom: sizes[5],
  },
  text: {
    fontSize: sizes[10],
  },
  historyItem: {
    fontSize: sizes[9],
  },
  history: {},
  purchases: {
    borderTopWidth: 1,
  },
  sumBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes[10],
  },
  priceText: {
    fontSize: sizes[12],
    fontFamily: getFontFamily('500'),
  },
  sumText: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
});

export default OrderScreen;
