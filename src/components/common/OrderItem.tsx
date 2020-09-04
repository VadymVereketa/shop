import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  ICartItem,
  IContact,
  IOrderFull,
  IOrderItem,
} from '../../typings/FetchData';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import MyText from '../controls/MyText';
import {
  formatTime,
  useFormattingContext,
} from '../../context/FormattingContext';
import {useNavigation} from '@react-navigation/native';
import MyButton from '../controls/MyButton';
import {ScrollView} from 'react-native-gesture-handler';
import getUrlImg from '../../utils/getUrlImg';
import IconButton from '../controls/IconButton';
import InfoOrder from './InfoOrder';
import {OrdersScreenNavigationProp} from '../navigators/Menu.navigator';
import service from '../../services/service';
import {actionsCart} from '../../redux/cart/cartReducer';
import {IReceiver} from '../../redux/order/orderTypes';
import {useDispatch} from 'react-redux';
import {actionsOrder} from '../../redux/order/orderReducer';
import {TypeDelivery} from '../../constants/constantsId';
import {useRepeatOrder} from '../../useHooks/useRepeatOrder';

interface IOrderItemProps {
  order: IOrderItem;
}

const OrderItem = React.memo(({order}: IOrderItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<OrdersScreenNavigationProp>();
  const repeatOrder = useRepeatOrder();
  const {border, text} = useTheme();
  const {formatPrice} = useFormattingContext();

  const images = order.purchases.map((purchase) => {
    const productImages = purchase.product.productImages;
    if (productImages.length > 0) {
      return productImages[0].uuid;
    }
    return null;
  });

  const handlePress = () => {
    navigation.push('Order', {
      item: order,
    });
  };

  const handleOrder = async () => {
    setIsLoading(true);
    try {
      const datas = await Promise.all([
        service.getOrder(order.id),
        service.getProductsByIds(order!.purchases.map((p) => p.product.id)),
      ]);
      if (datas[0].success && datas[1].success) {
        repeatOrder(datas[0].data, datas[1].data);
      }
    } catch (e) {}
    setIsLoading(false);
  };

  return (
    <View style={[styles.con, {borderColor: border}]}>
      <InfoOrder
        id={order.id}
        minExecuteDate={order.minExecuteDate}
        maxExecuteDate={order.maxExecuteDate}
        orderAddress={order.orderAddress}
        orderStatus={order.orderStatus}
      />
      {/* <View style={[styles.qr, {borderColor: border}]}>
        <MyText style={styles.textOrder}>Ваш личный QR-code</MyText>
      </View>*/}
      <View style={{flexDirection: 'row', marginTop: sizes[8]}}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.products}>
          {images.map((img) => {
            return (
              <Image
                source={getUrlImg(img)}
                resizeMode={'cover'}
                style={styles.img}
              />
            );
          })}
        </ScrollView>
        <IconButton
          onPress={handlePress}
          style={{
            paddingLeft: sizes[12],
          }}
          icon={{
            name: 'next',
            size: sizes[10],
            fill: text,
          }}
        />
      </View>
      <View style={styles.bottomBlock}>
        <View style={styles.priceBlock}>
          <MyText style={styles.textOrder}>Cума:</MyText>
          <MyText style={styles.priceText}>
            {formatPrice(+order.productsPrice)}
          </MyText>
        </View>
        <View
          style={{
            flexGrow: 1,
          }}>
          <MyButton
            styleText={styles.btnText}
            ultraWidth={true}
            onPress={handleOrder}
            isLoading={isLoading}>
            замовити
          </MyButton>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  con: {
    borderWidth: 1,
    padding: sizes[10],
    marginBottom: sizes[5],
  },
  qr: {
    marginTop: sizes[8],
    borderWidth: 1,
    padding: sizes[5],
  },
  textOrder: {
    fontFamily: getFontFamily('500'),
  },
  textStatus: {
    fontFamily: getFontFamily('500'),
    textTransform: 'uppercase',
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: getFontFamily('500'),
    fontSize: sizes[10],
    marginLeft: sizes[5],
    marginRight: sizes[10],
  },
  btnText: {
    fontSize: sizes[9],
  },
  bottomBlock: {
    flexDirection: 'row',
    marginTop: sizes[8],
  },
  products: {},
  img: {
    width: sizes[30],
    height: sizes[20],
    marginRight: sizes[5],
  },
});

export default OrderItem;
